import Link from "next/link";

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

function formatDateTime(iso: string) {
  const date = new Date(iso);
  const datePart = date.toLocaleDateString("en-CA");
  const timePart = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datePart} ${timePart}`;
}

function ReceiptIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 8h6M9 12h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
            <ReceiptIcon className="size-6 text-primary-500 shrink-0" />

            <div className="flex-1 flex flex-col justify-center items-start gap-3.5">
              <div className="self-stretch flex justify-start items-center gap-4">
                <span className="flex-1 text-neutral-600 text-base font-normal leading-6">
                  {formatDateTime(order.createdAt)}
                </span>
              </div>
              <div className="self-stretch flex flex-col justify-center items-start gap-1">
                <span className="self-stretch text-neutral-900 text-lg font-medium leading-7">
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
