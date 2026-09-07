import prisma from "@/lib/db/prisma";

export async function getCartByUserId(userId: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    select: {
      id: true,
      updatedAt: true,
      items: {
        select: {
          id: true,
          quantity: true,
          note: true,
          productProtectionSelected: true,
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              stock: true,
              imageUrl: true,
            },
          },
          color: {
            select: {
              id: true,
              name: true,
              hexValue: true,
              stock: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    return {
      id: null,
      userId,
      items: [],
      totalAmount: 0,
      updatedAt: null,
    };
  }

  const items = cart.items.map((item) => ({
    ...item,
    product: {
      ...item.product,
      price: Number(item.product.price),
    },
  }));

  const totalAmount =
    Math.round(
      items.reduce((acc, item) => {
        return acc + item.product.price * item.quantity;
      }, 0) * 100,
    ) / 100;

  return {
    id: cart.id,
    userId: userId,
    items: items,
    totalAmount: totalAmount,
    updatedAt: cart.updatedAt,
  };
}

async function resolveColorAndStock(
  productId: string,
  colorId?: string | null,
) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      stock: true,
      colors: {
        select: { id: true, stock: true, isDefault: true },
      },
    },
  });

  if (!product) {
    return { found: false as const };
  }

  const hasColors = product.colors.length > 0;

  if (hasColors) {
    const targetColorId =
      colorId ??
      product.colors.find((c) => c.isDefault)?.id ??
      product.colors[0].id;

    const color = product.colors.find((c) => c.id === targetColorId);

    if (!color) {
      return { found: false as const };
    }

    return {
      found: true as const,
      colorId: color.id,
      availableStock: color.stock,
    };
  }

  return { found: true as const, colorId: null, availableStock: product.stock };
}

export async function addProductToCart(
  userId: string,
  productId: string,
  quantity: number,
  requestedColorId?: string | null,
) {
  try {
    await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
        select: {
          stock: true,
          colors: { select: { id: true, stock: true, isDefault: true } },
        },
      });

      if (!product) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      const hasColors = product.colors.length > 0;
      let colorId: string | null = null;
      let availableStock = product.stock;

      if (hasColors) {
        const targetColorId =
          requestedColorId ??
          product.colors.find((c) => c.isDefault)?.id ??
          product.colors[0].id;

        const color = product.colors.find((c) => c.id === targetColorId);
        if (!color) throw new Error("COLOR_NOT_FOUND");

        colorId = color.id;
        availableStock = color.stock;
      }

      const cart = await tx.cart.upsert({
        where: { userId },
        create: { userId },
        update: {},
      });

      const existingItem = await tx.cartItem.findFirst({
        where: { cartId: cart.id, productId, colorId },
        select: { id: true, quantity: true },
      });

      const totalRequestedQuantity = (existingItem?.quantity ?? 0) + quantity;

      if (totalRequestedQuantity > availableStock) {
        throw new Error(`INSUFFICIENT_STOCK:${availableStock}`);
      }

      if (existingItem) {
        await tx.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: { increment: quantity } },
        });
      } else {
        await tx.cartItem.create({
          data: { cartId: cart.id, productId, colorId, quantity },
        });
      }
    });

    const updatedCart = await getCartByUserId(userId);
    return { success: true as const, cart: updatedCart };
  } catch (error) {
    if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
      return {
        success: false as const,
        error: "Product not found",
        status: 404,
      };
    }
    if (error instanceof Error && error.message === "COLOR_NOT_FOUND") {
      return { success: false as const, error: "Color not found", status: 404 };
    }
    if (
      error instanceof Error &&
      error.message.startsWith("INSUFFICIENT_STOCK:")
    ) {
      const stock = error.message.split(":")[1];
      return {
        success: false as const,
        error: `Only ${stock} item(s) available`,
        status: 400,
      };
    }
    throw error;
  }
}

export async function updateCartItem(
  userId: string,
  itemId: string,
  updates: {
    quantity?: number;
    note?: string;
    productProtectionSelected?: boolean;
  },
) {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    select: {
      id: true,
      cart: { select: { userId: true } },
      product: { select: { stock: true } },
      color: { select: { stock: true } },
    },
  });

  if (!item) {
    return {
      success: false as const,
      error: "Cart item not found",
      status: 404,
    };
  }

  if (item.cart.userId !== userId) {
    return {
      success: false as const,
      error: "Cart item not found",
      status: 404,
    };
  }

  if (updates.quantity !== undefined) {
    const availableStock = item.color ? item.color.stock : item.product.stock;

    if (updates.quantity > availableStock) {
      return {
        success: false as const,
        error: `Only ${availableStock} item(s) available`,
        status: 400,
      };
    }
  }

  await prisma.cartItem.update({
    where: { id: itemId },
    data: {
      ...(updates.quantity !== undefined && { quantity: updates.quantity }),
      ...(updates.note !== undefined && { note: updates.note }),
      ...(updates.productProtectionSelected !== undefined && {
        productProtectionSelected: updates.productProtectionSelected,
      }),
    },
  });

  const updatedCart = await getCartByUserId(userId);
  return { success: true as const, cart: updatedCart };
}

export async function removeCartItem(userId: string, itemId: string) {
  return removeCartItems(userId, [itemId]);
}

export async function removeCartItems(userId: string, itemIds: string[]) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!cart) {
    return { success: false as const, error: "Cart not found", status: 404 };
  }

  await prisma.cartItem.deleteMany({
    where: {
      id: { in: itemIds },
      cartId: cart.id,
    },
  });

  const updatedCart = await getCartByUserId(userId);
  return { success: true as const, cart: updatedCart };
}
