import { notFound } from "next/navigation";
import { getProductById } from "@/lib/db/products";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ExpandableDescription } from "@/components/products/ExpandableDescription";
import { ShippingInfo } from "@/components/products/ShippingInfo";
import { ProductPurchasePanel } from "@/components/products/ProductPurchasePanel";

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

      <div className="w-full p-10 flex justify-start items-start gap-8">
        <div className="flex-1 flex flex-col justify-start items-end gap-12">
          <div className="self-stretch flex justify-start items-start gap-10">
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
                <div className="flex justify-start items-start gap-2.5 flex-wrap content-start">
                  <div className="px-2.5 py-1.5 bg-orange-50 rounded-md flex justify-center items-center gap-2.5">
                    <div className="text-primary-800 text-sm font-medium leading-6">
                      {product.category.name}
                    </div>
                  </div>
                </div>
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
