"use client";

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

type CartSummaryProps = {
  selectedCount: number;
  selectedTotal: number;
  onCheckout: () => void;
  isCheckingOut: boolean;
  disabled: boolean;
};

export function CartSummary({
  selectedCount,
  selectedTotal,
  onCheckout,
  isCheckingOut,
  disabled,
}: CartSummaryProps) {
  return (
    <div className="w-96 p-6 bg-base-white rounded-md outline-1 outline-offset-[-1px] outline-gray-200 flex flex-col justify-center items-center gap-6">
      <div className="self-stretch flex flex-col justify-start items-start gap-4">
        <div className="text-neutral-900 text-lg font-medium leading-7">
          Total Product
        </div>
        <div className="self-stretch flex justify-between items-center">
          <div className="text-neutral-600 text-base font-medium leading-6">
            Total Product Price ({selectedCount} Item
            {selectedCount === 1 ? "" : "s"})
          </div>
          <div className="text-neutral-900 text-lg font-medium leading-7">
            {formatPrice(selectedTotal)}
          </div>
        </div>
      </div>

      <div className="self-stretch h-0 outline-1 outline-offset-[-0.5px] outline-gray-200" />

      <div className="self-stretch flex flex-col justify-start items-start gap-8">
        <div className="self-stretch flex justify-between items-center">
          <div className="text-neutral-900 text-lg font-medium leading-7">
            Subtotal
          </div>
          <div className="text-neutral-900 text-3xl font-medium leading-10">
            {formatPrice(selectedTotal)}
          </div>
        </div>

        <div className="self-stretch flex flex-col justify-start items-start gap-4">
          <button
            type="button"
            onClick={onCheckout}
            disabled={disabled || isCheckingOut}
            className="self-stretch px-5 py-3.5 bg-primary-500 rounded-md flex justify-center items-center gap-3.5 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-base-white text-base font-medium leading-6">
              {isCheckingOut ? "Updating cart..." : "Checkout"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
