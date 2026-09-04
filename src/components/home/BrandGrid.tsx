import Link from "next/link";
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
    <div className="self-stretch flex flex-col justify-start items-start gap-8">
      <div className="text-neutral-900 text-3xl font-medium leading-10">
        Brand
      </div>

      <RevealRow>
        {brands.map((brand) => (
          <div
            key={brand.id}
            draggable={false}
            className="w-56 h-48 p-3 shrink-0 bg-base-white rounded-md outline-1 outline-offset-[-1px] outline-gray-400 flex flex-col justify-center items-center gap-7 hover:outline-primary-500 transition-colors"
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
