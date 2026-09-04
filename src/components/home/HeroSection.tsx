"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import Image from "next/image";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  exploreInfo: string | null;
};

type HeroSectionProps = {
  categories: Category[];
};

export function HeroSection({ categories }: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (categories.length === 0) return null;

  const active = categories[activeIndex];

  return (
    <div className="self-stretch flex flex-col justify-start items-center gap-6">
      <div className="self-stretch h-[452px] px-28 py-20 relative bg-gray-50 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 flex flex-col justify-end items-start gap-2.5 overflow-hidden">
        <div className="flex flex-col justify-start items-start gap-10">
          <div className="flex flex-col justify-start items-start gap-6">
            <div className="text-neutral-900 text-3xl font-medium leading-10">
              {active.name}
            </div>
            <div className="w-96 text-neutral-600 text-base font-normal leading-6">
              {active.description}
            </div>
          </div>

          <Link
            href={`/products?category=${active.slug}`}
            className="px-5 py-3.5 rounded-md outline-1 outline-offset-[-1px] outline-primary-500 inline-flex justify-center items-center gap-3.5 hover:bg-primary-50 transition-colors"
          >
            <span className="text-primary-500 text-base font-medium leading-6">
              Explore Category
            </span>
            <ChevronRightIcon className="size-4 text-primary-500" />
          </Link>
        </div>

        <Image
          width={384}
          height={853}
          className="w-96 h-[853px] absolute right-[-140px] top-[-59px] origin-top-left rotate-[-34.55deg] object-contain"
          src={active.image}
          alt={active.name}
        />

        <button
          type="button"
          onClick={() =>
            setActiveIndex(
              (i) => (i - 1 + categories.length) % categories.length,
            )
          }
          aria-label="Previous category"
          className="w-11 h-20 px-1.5 py-1 left-0 top-1/2 -translate-y-1/2 absolute bg-primary-500 rounded-tr-md rounded-br-md flex justify-center items-center hover:opacity-90 transition-opacity"
        >
          <ChevronLeftIcon className="w-2 h-4 text-base-white" />
        </button>

        <button
          type="button"
          onClick={() => setActiveIndex((i) => (i + 1) % categories.length)}
          aria-label="Next category"
          className="w-11 h-20 px-1.5 py-1 right-0 top-1/2 -translate-y-1/2 absolute bg-primary-500 rounded-tl-md rounded-bl-md flex justify-center items-center hover:opacity-90 transition-opacity"
        >
          <ChevronLeftIcon className="w-2 h-4 text-base-white rotate-180" />
        </button>
      </div>

      <div className="flex justify-start items-start gap-4">
        {categories.map((category, index) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Show ${category.name}`}
            aria-current={index === activeIndex}
            className={`size-3 rounded-full transition-colors ${
              index === activeIndex ? "bg-primary-500" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
