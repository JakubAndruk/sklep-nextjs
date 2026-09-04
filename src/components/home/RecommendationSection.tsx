import { ProductCard, type ProductCardData } from "../products/ProductCard";
import { RevealRow } from "@/components/ui/RevealRow";

type RecommendationSectionProps = {
  products: ProductCardData[];
};

export function RecommendationSection({
  products,
}: RecommendationSectionProps) {
  if (products.length === 0) return null;

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-8">
      <div className="text-neutral-900 text-3xl font-medium leading-10">
        Recommendation
      </div>

      <RevealRow>
        {products.map((product) => (
          <div key={product.id} className="shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </RevealRow>
    </div>
  );
}
