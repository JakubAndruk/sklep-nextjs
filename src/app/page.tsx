import { getCategories } from "@/lib/db/categories";
import { getRecommendedProducts } from "@/lib/db/products";
import { getBrands } from "@/lib/db/brands";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { RecommendationSection } from "@/components/home/RecommendationSection";
import { BrandGrid } from "@/components/home/BrandGrid";

export default async function Home() {
  const [categories, recommendedProducts, brands] = await Promise.all([
    getCategories(),
    getRecommendedProducts(),
    getBrands(),
  ]);
  return (
    <div className="w-full px-2 xs:px-4 sm:px-10 pb-20 flex flex-col justify-start items-start gap-24">
      <HeroSection categories={categories} />

      <CategoryGrid categories={categories} />
      <RecommendationSection products={recommendedProducts} />
      <BrandGrid brands={brands} />
    </div>
  );
}
