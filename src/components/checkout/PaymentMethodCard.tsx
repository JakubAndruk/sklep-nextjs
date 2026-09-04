export function PaymentMethodCard() {
  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-4">
      <div className="text-neutral-900 text-2xl font-medium leading-9">
        Payment Method
      </div>

      <div className="self-stretch p-6 bg-base-white rounded-md outline-1 outline-offset-[-1px] outline-gray-200 flex justify-start items-center gap-8">
        <div className="flex justify-start items-center gap-6">
          <div className="w-11 h-7 relative bg-white rounded-md shadow-sm outline-1 outline-gray-200 flex items-center justify-center">
            <span className="text-neutral-900 text-xs font-semibold"></span>
          </div>
          <span className="text-neutral-900 text-lg font-medium leading-7">
            Apple Pay
          </span>
        </div>
      </div>
    </div>
  );
}
