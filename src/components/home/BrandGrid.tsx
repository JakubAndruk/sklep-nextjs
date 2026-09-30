import { RevealRow } from "@/components/ui/RevealRow";
import Image from "next/image";

type Brand = {
  id: string;
  name: string;
  logoUrl: string;
};

type BrandGridProps = {
  brands: Brand[];
};

export function BrandGrid({ brands }: BrandGridProps) {
  if (brands.length === 0) return null;

  return (
    <div className="self-stretch min-w-0 flex flex-col justify-start items-start">
      <RevealRow name="Brand">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="w-56 h-48 p-3 shrink-0 bg-base-white rounded-md outline-1 -outline-offset-1 outline-gray-400 flex flex-col justify-center items-center gap-7 hover:outline-primary-500 transition-colors"
          >
            <Image
              width={80}
              height={44}
              className="w-20 h-11 object-contain pointer-events-none"
              src={brand.logoUrl}
              alt={brand.name}
              draggable={false}
            />
            <div className="text-neutral-900 text-xl font-medium leading-8">
              {brand.name}
            </div>
          </div>
        ))}
      </RevealRow>
    </div>
  );
}
