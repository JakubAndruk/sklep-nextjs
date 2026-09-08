"use client";

import { use, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  ProductCard,
  type ProductCardData,
} from "@/components/products/ProductCard";
import { CategoryFilter } from "@/components/filters/CategoryFilter";
import { PriceFilter } from "@/components/filters/PriceFilter";
import { SortAndShow } from "@/components/filters/SortAndShow";
import { Pagination } from "@/components/filters/Pagination";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type ProductsPageClientProps = {
  categories: Category[];
  initialProducts: ProductCardData[];
  initialPagination: PaginationMeta;
};

export function ProductsPageClient({
  categories,
  initialProducts,
  initialPagination,
}: ProductsPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category");

  const activeCategorySlugs = categoryParam
    ? categoryParam.split(",").filter(Boolean)
    : [];
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const sort = searchParams.get("sort") ?? "newest";
  const limit = searchParams.get("limit") ?? "9";

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      if (!("page" in updates)) {
        params.delete("page");
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname],
  );

  const handleCategoryChange = useCallback(
    (slugs: string[]) => {
      updateParams({ category: slugs.length > 0 ? slugs.join(",") : null });
    },
    [updateParams],
  );

  return (
    <div className="w-full flex flex-wrap justify-start items-start gap-0.5">
      <aside className="max-w-96 min-w-50 p-2 xs:p-10 flex flex-col flex-wrap justify-start items-center gap-12 shrink-0 md:sticky md:top-0 md:self-start">
        <CategoryFilter
          categories={categories}
          activeSlugs={activeCategorySlugs}
          onChange={handleCategoryChange}
        />

        <PriceFilter
          minPrice={minPrice}
          maxPrice={maxPrice}
          onApply={(min, max) =>
            updateParams({ minPrice: min || null, maxPrice: max || null })
          }
        />
      </aside>

      <div className="w-px self-stretch outline-1 outline-offset-[-0.5px] outline-gray-200" />

      <div className="flex-1 p-2 xs:p-10 flex flex-col justify-start items-start gap-12">
        <div className="self-stretch flex flex-col justify-start items-start gap-10">
          <SortAndShow
            sort={sort}
            limit={limit}
            onSortChange={(value) => updateParams({ sort: value })}
            onLimitChange={(value) => updateParams({ limit: value })}
          />

          {initialProducts.length === 0 ? (
            <div className="self-stretch flex justify-center items-center py-20">
              <span className="text-neutral-500 text-base">
                No products found.
              </span>
            </div>
          ) : (
            <div className="self-stretch flex justify-start items-center gap-12 flex-wrap content-center">
              {initialProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        <Pagination
          page={initialPagination.page}
          totalPages={initialPagination.totalPages}
          onPageChange={(newPage) => updateParams({ page: String(newPage) })}
        />
      </div>
    </div>
  );
}
