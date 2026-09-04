import Link from "next/link";
import { CheckmarkBadge } from "@/components/ui/CheckmarkBadge";

export type OrderDetail = {
  id: string;
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  productsAmount: number;
  productProtection: number;
  productProtectionSelected: boolean;
  shippingPrice: number;
  shippingInsurance: number;
  serviceFee: number;
  totalAmount: number;
  createdAt: string;
  shippingName: string;
  shippingStreet: string;
  shippingCity: string;
  shippingProvince: string;
  shippingPostalCode: string;
  shippingCountry: string;
  items: {
    id: string;
    quantity: number;
    priceAtPurchase: number;
    product: {
      id: string;
      name: string;
      imageUrl: string;
      category: { name: string };
    };
    color: { name: string; hexValue: string } | null;
  }[];
};

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const STATUS_LABELS: Record<OrderDetail["status"], string> = {
  PENDING: "Pending",
  PAID: "Success",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const STATUS_STYLES: Record<OrderDetail["status"], string> = {
  PENDING: "bg-warning-50 text-warning-800",
  PAID: "bg-success-50 text-success-800",
  SHIPPED: "bg-primary-50 text-primary-800",
  DELIVERED: "bg-success-50 text-success-800",
  CANCELLED: "bg-danger-50 text-danger-800",
};

type OrderSummaryCardProps = {
  order: OrderDetail;
};

export function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  const totalItemCount = order.items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  return (
    <div className="w-full max-w-[640px] p-6 bg-base-white rounded-md outline-1 outline-offset-[-1px] outline-gray-200 flex flex-col justify-center items-center gap-6">
      <div className="flex flex-col justify-start items-center gap-6">
        <CheckmarkBadge />
        <div className="text-center text-neutral-900 text-3xl font-medium leading-10">
          Thanks for Your Order!
        </div>
      </div>

      <div className="self-stretch text-center text-neutral-600 text-base font-medium leading-6">
        {order.id}
      </div>

      <div className="self-stretch flex flex-col justify-center items-center gap-6">
        <div className="self-stretch flex flex-col justify-center items-center gap-4">
          <div className="text-neutral-900 text-lg font-medium leading-7">
            Transaction Date
          </div>
          <div className="text-neutral-600 text-base font-medium leading-6">
            {formatDate(order.createdAt)}
          </div>
        </div>

        <div className="self-stretch h-0 outline-1 outline-offset-[-0.5px] outline-gray-200" />

        <div className="self-stretch flex flex-col justify-center items-center gap-4">
          <div className="text-neutral-900 text-lg font-medium leading-7">
            Payment Method
          </div>
          <div className="text-neutral-600 text-base font-medium leading-6">
            Apple Pay
          </div>
        </div>

        <div className="self-stretch h-0 outline-1 outline-offset-[-0.5px] outline-gray-200" />

        <div className="self-stretch flex flex-col justify-center items-center gap-4">
          <div className="text-neutral-900 text-lg font-medium leading-7">
            Shipping Method
          </div>
          <div className="flex justify-start items-center gap-2.5">
            <span className="text-neutral-600 text-base font-medium leading-6">
              NexusHub Courier
            </span>
          </div>
        </div>

        <div className="self-stretch h-0 outline-1 outline-offset-[-0.5px] outline-gray-200" />

        <div className="self-stretch flex flex-col justify-center items-center gap-4">
          <div className="text-neutral-900 text-lg font-medium leading-7">
            Your Order
          </div>

          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="self-stretch p-4 bg-base-white rounded-md outline-1 outline-offset-[-1px] outline-gray-200 flex flex-col justify-center items-start gap-6"
              >
                <div className="self-stretch flex justify-start items-center gap-8">
                  <div className="w-44 h-36 p-3 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 flex flex-col justify-start items-start gap-2.5">
                    <img
                      className="self-stretch flex-1 rounded-md object-cover"
                      src={item.product.imageUrl}
                      alt={item.product.name}
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-start items-start gap-4">
                    <div className="self-stretch flex flex-col justify-start items-start gap-3">
                      <div className="text-neutral-900 text-xl font-medium leading-8">
                        {item.product.name}
                      </div>
                      <div className="px-2.5 py-1.5 bg-orange-50 rounded-md flex justify-center items-center gap-2.5">
                        <span className="text-primary-800 text-sm font-medium leading-6">
                          {item.product.category.name}
                        </span>
                      </div>
                      {item.color && (
                        <div className="flex justify-start items-center gap-2">
                          <span
                            className="size-4 rounded-full outline-1 outline-offset-[-1px] outline-gray-200"
                            style={{ backgroundColor: item.color.hexValue }}
                            aria-hidden="true"
                          />
                          <span className="text-neutral-600 text-sm font-normal leading-6">
                            {item.color.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="self-stretch flex justify-between items-center">
                      <div className="text-neutral-900 text-2xl font-medium leading-9">
                        {formatPrice(item.priceAtPurchase)}
                      </div>
                      <div className="text-neutral-900 text-lg font-medium leading-7">
                        x{item.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="self-stretch flex justify-between items-center">
            <span className="text-neutral-600 text-base font-medium leading-6">
              Total Product Price ({totalItemCount} Item
              {totalItemCount === 1 ? "" : "s"})
            </span>
            <span className="text-neutral-900 text-lg font-medium leading-7">
              {formatPrice(order.productsAmount)}
            </span>
          </div>
          {order.productProtectionSelected && (
            <div className="self-stretch flex justify-between items-center">
              <span className="text-neutral-600 text-base font-medium leading-6">
                Total Product Protection
              </span>
              <span className="text-neutral-900 text-lg font-medium leading-7">
                {formatPrice(order.productProtection)}
              </span>
            </div>
          )}
          <div className="self-stretch flex justify-between items-center">
            <span className="text-neutral-600 text-base font-medium leading-6">
              Total Shipping Price
            </span>
            <span className="text-neutral-900 text-lg font-medium leading-7">
              {formatPrice(order.shippingPrice)}
            </span>
          </div>
          <div className="self-stretch flex justify-between items-center">
            <span className="text-neutral-600 text-base font-medium leading-6">
              Shipping Insurance
            </span>
            <span className="text-neutral-900 text-lg font-medium leading-7">
              {formatPrice(order.shippingInsurance)}
            </span>
          </div>
        </div>

        <div className="self-stretch h-0 outline-1 outline-offset-[-0.5px] outline-gray-200" />

        <div className="self-stretch flex flex-col justify-start items-start gap-4">
          <div className="text-neutral-900 text-lg font-medium leading-7">
            Transaction Fees
          </div>
          <div className="self-stretch flex justify-between items-center">
            <span className="text-neutral-600 text-base font-medium leading-6">
              Service Fees
            </span>
            <span className="text-neutral-900 text-lg font-medium leading-7">
              {formatPrice(order.serviceFee)}
            </span>
          </div>
        </div>

        <div className="self-stretch h-0 outline-1 outline-offset-[-0.5px] outline-gray-200" />

        <div className="self-stretch flex justify-between items-center">
          <span className="text-neutral-900 text-lg font-medium leading-7">
            Grand total
          </span>
          <span className="text-neutral-900 text-3xl font-medium leading-10">
            {formatPrice(order.totalAmount)}
          </span>
        </div>

        <div className="self-stretch flex justify-between items-center">
          <span className="text-neutral-900 text-lg font-medium leading-7">
            Status
          </span>
          <div
            className={`px-2.5 py-1.5 rounded-md flex justify-center items-center gap-2.5 ${STATUS_STYLES[order.status]}`}
          >
            <span className="text-sm font-medium leading-6">
              {STATUS_LABELS[order.status]}
            </span>
          </div>
        </div>

        <div className="self-stretch flex flex-col justify-start items-start gap-6">
          <Link
            href="/products"
            className="self-stretch px-5 py-3.5 bg-primary-500 rounded-md flex justify-center items-center gap-3.5 hover:opacity-90 transition-opacity"
          >
            <span className="text-base-white text-base font-medium leading-6">
              Continue Shopping
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
