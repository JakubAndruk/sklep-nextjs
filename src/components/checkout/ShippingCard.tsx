import { ApproveIcon } from "../icons/ApproveIcon";

export function ShippingCard() {
  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-4">
      <div className="text-neutral-900 text-2xl font-medium leading-9">
        Shipping
      </div>

      <div className="self-stretch p-6 bg-base-white rounded-md outline-1 -outline-offset-1 outline-gray-200 flex justify-between items-center">
        <div className="flex justify-start items-center gap-4">
          <ApproveIcon className="size-6 text-success-500" />

          <span className="text-neutral-900 text-lg font-medium leading-7">
            NexusHub Courier
          </span>
        </div>
      </div>
    </div>
  );
}
