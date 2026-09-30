import { OrderStatus, Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/db/prisma";
import { createAddress } from "@/lib/db/addresses";
import type { CreateOrderInput } from "@/lib/validators/orders";
import { getPricingConfig } from "@/lib/db/pricing";

const MAX_RETRIES = 3;

type ShippingSnapshot = {
  name: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
};

const orderDetailSelect = {
  id: true,
  status: true,
  productsAmount: true,
  productProtection: true,
  shippingPrice: true,
  shippingInsurance: true,
  serviceFee: true,
  totalAmount: true,
  createdAt: true,
  shippingName: true,
  shippingStreet: true,
  shippingCity: true,
  shippingProvince: true,
  shippingPostalCode: true,
  shippingCountry: true,
  items: {
    select: {
      id: true,
      quantity: true,
      priceAtPurchase: true,
      productProtectionSelected: true,
      product: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
          category: { select: { name: true } },
        },
      },
      color: { select: { name: true, hexValue: true } },
    },
  },
} as const;

type RawOrderItem = {
  id: string;
  quantity: number;
  priceAtPurchase: Prisma.Decimal;
  productProtectionSelected: boolean;
  product: {
    id: string;
    name: string;
    imageUrl: string;
    category: { name: string };
  };
  color: { name: string; hexValue: string } | null;
};

type RawOrder = {
  id: string;
  status: OrderStatus;
  productsAmount: Prisma.Decimal;
  productProtection: Prisma.Decimal;
  shippingPrice: Prisma.Decimal;
  shippingInsurance: Prisma.Decimal;
  serviceFee: Prisma.Decimal;
  totalAmount: Prisma.Decimal;
  createdAt: Date;
  shippingName: string;
  shippingStreet: string;
  shippingCity: string;
  shippingProvince: string;
  shippingPostalCode: string;
  shippingCountry: string;
  items: RawOrderItem[];
};

function serializeOrder(order: RawOrder) {
  return {
    id: order.id,
    status: order.status,
    productsAmount: Number(order.productsAmount),
    productProtection: Number(order.productProtection),
    shippingPrice: Number(order.shippingPrice),
    shippingInsurance: Number(order.shippingInsurance),
    serviceFee: Number(order.serviceFee),
    totalAmount: Number(order.totalAmount),
    createdAt: order.createdAt.toISOString(),
    shippingName: order.shippingName,
    shippingStreet: order.shippingStreet,
    shippingCity: order.shippingCity,
    shippingProvince: order.shippingProvince,
    shippingPostalCode: order.shippingPostalCode,
    shippingCountry: order.shippingCountry,
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      priceAtPurchase: Number(item.priceAtPurchase),
      productProtectionSelected: item.productProtectionSelected,
      product: item.product,
      color: item.color,
    })),
  };
}

export async function createOrder(userId: string, input: CreateOrderInput) {
  const pricing = await getPricingConfig();
  const cart = await prisma.cart.findUnique({
    where: { userId },
    select: {
      id: true,
      items: {
        select: {
          id: true,
          quantity: true,
          productProtectionSelected: true,
          product: {
            select: { id: true, name: true, price: true, stock: true },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return { success: false as const, error: "Cart is empty", status: 400 };
  }

  let shippingData: ShippingSnapshot;

  if (input.type === "existing") {
    const address = await prisma.address.findUnique({
      where: { id: input.addressId },
      select: {
        userId: true,
        name: true,
        street: true,
        city: true,
        province: true,
        postalCode: true,
        country: true,
      },
    });

    if (!address || address.userId !== userId) {
      return {
        success: false as const,
        error: "Shipping address not found",
        status: 404,
      };
    }

    shippingData = address;
  } else {
    const createdAddress = await createAddress(userId, input.newAddress);
    shippingData = createdAddress;
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const orderId = await prisma.$transaction(
        async (tx) => {
          const productIds = cart.items.map((item) => item.product.id);
          const products = await tx.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, name: true, price: true, stock: true },
          });
          const productMap = new Map(products.map((p) => [p.id, p]));

          for (const item of cart.items) {
            const product = productMap.get(item.product.id);
            if (!product) throw new Error(`PRODUCT_NOT_FOUND:${item.id}`);
            if (product.stock < item.quantity) {
              throw new Error(
                `INSUFFICIENT_STOCK:${product.name}:${product.stock}`,
              );
            }
          }

          const totalQuantity = cart.items.reduce(
            (sum, item) => sum + item.quantity,
            0,
          );

          const productsAmount = cart.items.reduce((sum, item) => {
            const product = productMap.get(item.product.id)!;
            return sum.plus(product.price.mul(item.quantity));
          }, new Prisma.Decimal(0));

          const productProtection = cart.items.reduce((sum, item) => {
            if (!item.productProtectionSelected) return sum;
            return sum.plus(
              pricing.productProtectionPerUnit.mul(item.quantity),
            );
          }, new Prisma.Decimal(0));
          const shippingInsurance = productsAmount.mul(
            pricing.shippingInsuranceRate,
          );
          const shippingPrice = pricing.shippingPrice;
          const serviceFee = pricing.serviceFee;

          const totalAmount = productsAmount
            .plus(productProtection)
            .plus(shippingPrice)
            .plus(shippingInsurance)
            .plus(serviceFee);

          const order = await tx.order.create({
            data: {
              userId,
              status: "PAID",
              productsAmount,
              productProtection,
              shippingPrice,
              shippingInsurance,
              serviceFee,
              totalAmount,
              shippingName: shippingData.name,
              shippingStreet: shippingData.street,
              shippingCity: shippingData.city,
              shippingProvince: shippingData.province,
              shippingPostalCode: shippingData.postalCode,
              shippingCountry: shippingData.country,
            },
          });

          const orderItemsData = cart.items.map((item) => {
            const product = productMap.get(item.product.id)!;
            return {
              orderId: order.id,
              productId: item.product.id,
              quantity: item.quantity,
              priceAtPurchase: product.price,
              productProtectionSelected: item.productProtectionSelected,
            };
          });

          await tx.orderItem.createMany({ data: orderItemsData });

          for (const item of cart.items) {
            await tx.product.update({
              where: { id: item.product.id },
              data: { stock: { decrement: item.quantity } },
            });
          }

          await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

          return order.id;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );

      return { success: true as const, orderId };
    } catch (error) {
      const isRetryable =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2034";

      if (isRetryable && attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 50 * attempt));
        continue;
      }

      if (
        error instanceof Error &&
        error.message.startsWith("INSUFFICIENT_STOCK:")
      ) {
        const [, productName, availableStock] = error.message.split(":");
        return {
          success: false as const,
          error: `Insufficient stock for "${productName}". Only ${availableStock} available.`,
          status: 400,
        };
      }

      if (
        error instanceof Error &&
        error.message.startsWith("PRODUCT_NOT_FOUND:")
      ) {
        return {
          success: false as const,
          error: "One of the products in your cart no longer exists",
          status: 400,
        };
      }

      console.error("Error creating order:", error);
      return {
        success: false as const,
        error: "Failed to create order",
        status: 500,
      };
    }
  }

  return {
    success: false as const,
    error: "Failed to create order, please try again",
    status: 500,
  };
}

export async function getOrdersByUserId(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: orderDetailSelect,
  });

  return orders.map(serializeOrder);
}

export async function getOrderById(userId: string, orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { ...orderDetailSelect, userId: true },
  });

  if (!order || order.userId !== userId) return null;

  const { userId: _userId, ...rest } = order;
  return serializeOrder(rest);
}
