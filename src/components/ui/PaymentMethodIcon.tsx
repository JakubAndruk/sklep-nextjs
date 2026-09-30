import { IconProps } from "@/types/icons";
import { ComponentType } from "react";

export function PaymentMethodIcon({
  name,
  Icon,
}: {
  name: string;
  Icon: ComponentType<IconProps>;
}) {
  return (
    <div className="w-12 h-8 relative rounded-md border border-gray-200 flex items-center justify-center shadow-sm overflow-hidden">
      <Icon className="w-full h-full object-cover" />
    </div>
  );
}
