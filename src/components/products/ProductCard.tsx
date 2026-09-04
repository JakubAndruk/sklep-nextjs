"use client";

import Link from "next/link";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import Image from "next/image";

export type ProductCardData = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
};

type ProductCardProps = {
  product: ProductCardData;
};

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="min-w-72 w-72 px-4 pt-4 pb-5 bg-base-white rounded-md outline-1 outline-offset-[-1px] outline-gray-200 flex flex-col justify-start items-start gap-4 hover:outline-primary-500 transition-colors">
      <div className="self-stretch relative flex flex-col justify-start items-start gap-2.5">
        <Link
          href={`/products/${product.id}`}
          className="self-stretch relative h-52"
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="288px"
            className="rounded-md object-cover"
          />
        </Link>

        <AddToCartButton
          productId={product.id}
          className="left-4 top-4 absolute"
        />
      </div>

      <div className="self-stretch flex flex-col justify-start items-start gap-4">
        <div className="self-stretch flex justify-start items-start gap-2.5 flex-wrap content-start">
          <div className="px-2.5 py-1.5 bg-orange-50 rounded-md flex justify-center items-center gap-2.5">
            <div className="text-primary-800 text-sm font-medium leading-6">
              {product.category.name}
            </div>
          </div>
        </div>

        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <Link
            href={`/products/${product.id}`}
            className="self-stretch text-neutral-900 text-lg font-normal leading-7 hover:underline"
          >
            {product.name}
          </Link>
          <div className="self-stretch flex justify-start items-center gap-2.5 flex-wrap content-center">
            <div className="text-neutral-900 text-3xl font-semibold leading-10">
              {formatPrice(product.price)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
