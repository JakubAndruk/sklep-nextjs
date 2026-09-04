import Image from "next/image";

export function PaymentMethodIcon({
  name,
  src,
}: {
  name: string;
  src: string;
}) {
  return (
    <div className="w-12 h-8 relative rounded-md border border-gray-200 flex items-center justify-center shadow-sm overflow-hidden">
      <Image src={src} alt={name} fill className="w-full h-full object-cover" />
    </div>
  );
}
