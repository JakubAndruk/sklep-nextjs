import { apiError, apiSuccess } from "@/lib/utils/response";
import { getCategories } from "@/lib/db/categories";

export async function GET() {
  try {
    const categories = await getCategories();
    return apiSuccess(categories);
  } catch (error) {
    console.error("Error fetching categories", error);
    return apiError("Failed to fetch categories", 500);
  }
}
