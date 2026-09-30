import Link from "next/link";
import { OrderIcon } from "../icons/OrderIcon";
import { formatDateTime } from "@/lib/utils/format";

export type OrderHistoryItem = {
  id: string;
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  items: {
    id: string;
    product: { name: string };
  }[];
};

type TransactionListProps = {
  orders: OrderHistoryItem[];
};

export function TransactionList({ orders }: TransactionListProps) {
  if (orders.length === 0) {
    return (
      <div className="self-stretch p-4 bg-base-white rounded-md outline-1 outline-offset-[-1px] outline-gray-200 flex justify-center items-center">
        <p className="text-neutral-600 text-base font-normal">
          You don&rsquo;t have any orders yet.
        </p>
      </div>
    );
  }

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-4">
      {orders.map((order) => {
        const firstItemName = order.items[0]?.product.name ?? "Order item";
        const extraCount = order.items.length - 1;

        return (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="self-stretch p-4 bg-base-white rounded-md outline-1 outline-offset-[-1px] outline-gray-200 flex justify-start items-start gap-4 hover:bg-gray-50 transition-colors"
          >
            <OrderIcon className="size-6 text-primary-500 shrink-0" />

            <div className="flex-1 flex flex-col justify-center items-start gap-3.5">
              <div className="self-stretch flex justify-start items-center gap-4">
                <span className="flex-1 text-neutral-600 text-base font-normal leading-6">
                  {formatDateTime(order.createdAt)}
                </span>
              </div>
              <div className="self-stretch flex flex-col justify-center items-start gap-1">
                <span className="self-stretch text-neutral-900 text-lg font-medium leading-7 break-all">
                  Your order nr {order.id}
                </span>
                <span className="self-stretch text-neutral-900 text-lg font-medium leading-7">
                  {firstItemName}
                  {extraCount > 0 &&
                    ` +${extraCount} more item${extraCount === 1 ? "" : "s"}`}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
