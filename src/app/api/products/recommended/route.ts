import { apiError, apiSuccess } from "@/lib/utils/response";
import { getRecommendedProducts } from "@/lib/db/products";

export async function GET() {
  try {
    const products = await getRecommendedProducts();

    return apiSuccess(products);
  } catch (error) {
    console.error("Error fetching products", error);
    return apiError("Failed to fetch products", 500);
  }
}
