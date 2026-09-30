import { getCategories } from "@/lib/db/categories";
import { getProducts } from "@/lib/db/products";
import { validateProductQuery } from "@/lib/validators/products";
import { ProductsPageClient } from "@/components/products/ProductPageClient";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductsPage({ searchParams }: PageProps) {
  const rawParams = await searchParams;

  const validation = validateProductQuery(rawParams);
  const filters = validation.success
    ? validation.data
    : {
        category: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        sort: "newest" as const,
        page: 1,
        limit: 9,
      };

  const [categories, { products, pagination }] = await Promise.all([
    getCategories(),
    getProducts(filters),
  ]);

  return (
    <ProductsPageClient
      categories={categories}
      initialProducts={products}
      initialPagination={pagination}
    />
  );
}
