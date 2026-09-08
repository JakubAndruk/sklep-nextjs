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
    <div className="self-stretch min-w-0 flex flex-col justify-start items-start">
      <RevealRow name="Recommendation">
        {products.map((product) => (
          <div key={product.id} className="shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </RevealRow>
    </div>
  );
}
