import { ShieledCrossIcon } from "../icons/ShieledCross";

type ShippingInfoProps = {
  estimatedDelivery: string;
};

function formatDeliveryDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

export function ShippingInfo({ estimatedDelivery }: ShippingInfoProps) {
  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-3.5">
      <div className="text-neutral-500 text-lg font-medium leading-7">
        Shipping Available
      </div>
      <div className="w-80 p-4 rounded-md outline-1 outline-offset-[-1px] outline-neutral-900 flex justify-start items-start gap-2">
        <ShieledCrossIcon className="size-6" />
        <div className="flex-1 flex flex-col justify-start items-start gap-1">
          <div className="self-stretch text-neutral-900 text-base font-medium leading-6">
            NexusHub Courier
          </div>
          <div className="self-stretch text-neutral-600 text-base font-normal leading-6">
            Estimated arrival by {formatDeliveryDate(estimatedDelivery)}
          </div>
        </div>
      </div>
    </div>
  );
}
