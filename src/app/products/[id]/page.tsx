import { notFound } from "next/navigation";
import { getProductById } from "@/lib/db/products";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ExpandableDescription } from "@/components/products/ExpandableDescription";
import { ShippingInfo } from "@/components/products/ShippingInfo";
import { ProductPurchasePanel } from "@/components/products/ProductPurchasePanel";
import { ProductCaregoryBadge } from "@/components/ui/ProductCategoryBadge";

type ProductDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { id } = await params;

  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Products", href: "/products" },
    { label: product.name },
  ];

  return (
    <div className="w-full flex flex-col justify-start items-start gap-2">
      <Breadcrumb items={breadcrumbItems} />

      <div className="w-full px-2 xxs:px-10 py-10 flex flex-wrap justify-start items-start gap-8">
        <div className="flex-1 flex flex-col  justify-start items-end gap-12">
          <div className="self-stretch flex flex-wrap justify-start items-start gap-10">
            <ProductGallery
              imageUrl={product.imageUrl}
              images={product.images}
              name={product.name}
            />

            <div className="flex-1 flex flex-col justify-start items-start gap-8">
              <div className="self-stretch flex flex-col justify-start items-start gap-5">
                <div className="self-stretch text-neutral-900 text-3xl font-medium leading-10">
                  {product.name}
                </div>
                <ProductCaregoryBadge name={product.category.name} />
              </div>

              <div className="text-neutral-900 text-3xl font-medium leading-10">
                ${product.price.toFixed(2)}
              </div>

              <ExpandableDescription text={product.description} />

              <ShippingInfo estimatedDelivery={product.estimatedDelivery} />
            </div>
          </div>

          <div className="self-stretch h-0 outline-1 outline-offset-[-0.5px] outline-gray-200" />
        </div>

        <ProductPurchasePanel
          productId={product.id}
          price={product.price}
          stock={product.stock}
          colors={product.colors}
        />
      </div>
    </div>
  );
}
