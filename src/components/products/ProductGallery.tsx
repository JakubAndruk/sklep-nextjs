"use client";

import Image from "next/image";
import { useState, useMemo } from "react";

type ProductGalleryProps = {
  imageUrl: string;
  images?: { url: string }[];
  name: string;
};

export function ProductGallery({
  imageUrl,
  images = [],
  name,
}: ProductGalleryProps) {
  const gallery = useMemo(() => {
    const urls = [imageUrl, ...images.map((img) => img.url)];
    return Array.from(new Set(urls));
  }, [imageUrl, images]);

  const [activeImage, setActiveImage] = useState(gallery[0]);

  return (
    <div className="flex flex-col justify-start items-start gap-8">
      <div className="w-[clamp(280px,90vw,422px)] h-74 p-3 bg-base-white rounded-md outline-1 -outline-offset-1 outline-gray-200 flex flex-col justify-start items-start gap-2.5">
        <Image
          width={360}
          height={296}
          className="w-full h-full rounded-md object-contain bg-neutral-900"
          src={activeImage}
          alt={name}
        />
      </div>
      {gallery.length > 1 && (
        <div className="flex flex-wrap justify-start items-start gap-4">
          {gallery.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setActiveImage(url)}
              aria-label={`View image ${index + 1} of ${name}`}
              aria-pressed={activeImage === url}
              className={`w-32 h-24 rounded-md overflow-hidden ${
                activeImage === url
                  ? "border-2 border-primary-500 bg-neutral-900 "
                  : "border-2 border-transparent bg-neutral-500"
              }`}
            >
              <Image
                width={124}
                height={92}
                className="w-full h-full object-cover"
                src={url}
                alt={`${name} thumbnail ${index + 1}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
