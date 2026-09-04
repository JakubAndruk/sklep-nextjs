import type { CartItem } from "@/lib/api/cart-client";
import { CartItemDetails } from "@/components/cart/CartItemDetails";

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

type CheckoutOrderItemsProps = {
  items: CartItem[];
  productProtectionTotal: number;
  withProductProtection: boolean;
  onToggleProductProtection: () => void;
  onChangeQuantity: (itemId: string, quantity: number) => Promise<void>;
  onSaveNote: (itemId: string, note: string) => Promise<void>;
};

export function CheckoutOrderItems({
  items,
  productProtectionTotal,
  withProductProtection,
  onToggleProductProtection,
  onChangeQuantity,
  onSaveNote,
}: CheckoutOrderItemsProps) {
  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-4">
      <div className="text-neutral-900 text-2xl font-medium leading-9">
        Your Order
      </div>

      <div className="self-stretch flex flex-col justify-start items-start gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="self-stretch p-6 bg-base-white rounded-md outline-1 outline-offset-[-1px] outline-gray-200 flex flex-col justify-center items-start gap-6"
          >
            <div className="self-stretch flex justify-start items-center gap-8">
              <div className="w-44 h-36 p-3 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 flex flex-col justify-start items-start gap-2.5">
                <img
                  className="self-stretch flex-1 rounded-md object-cover"
                  src={item.product.imageUrl}
                  alt={item.product.name}
                />
              </div>

              <CartItemDetails
                item={item}
                onChangeQuantity={onChangeQuantity}
                onSaveNote={onSaveNote}
                allowNotes
              />
            </div>
          </div>
        ))}

        <div className="self-stretch p-6 bg-base-white rounded-md outline-1 outline-offset-[-1px] outline-gray-200 flex flex-col justify-center items-start gap-1">
          <div className="self-stretch flex justify-between items-center">
            <button
              type="button"
              onClick={onToggleProductProtection}
              aria-pressed={withProductProtection}
              className="flex justify-start items-center gap-4"
            >
              {withProductProtection ? (
                <span className="size-6 p-[3px] bg-primary-500 rounded-md flex justify-center items-center shrink-0">
                  <svg viewBox="0 0 16 16" fill="none" className="size-4">
                    <path
                      d="M3 8.5L6.5 12L13 4"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              ) : (
                <span className="size-6 bg-gray-50 rounded-md border border-gray-400 shrink-0" />
              )}
              <span className="text-neutral-900 text-base font-medium leading-6">
                Product Protection
              </span>
            </button>
            <div className="text-neutral-900 text-lg font-medium leading-7">
              {formatPrice(productProtectionTotal)}
            </div>
          </div>
          <div className="self-stretch px-10 flex flex-col justify-center items-start">
            <p className="text-neutral-600 text-sm font-normal leading-6">
              The claim process is easy and instant, valid for 6 months
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
