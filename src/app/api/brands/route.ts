import { apiError, apiSuccess } from "@/lib/utils/response";
import { getBrands } from "@/lib/db/brands";

export async function GET() {
  try {
    const brands = await getBrands();
    return apiSuccess(brands);
  } catch (error) {
    console.error("Error fetching brands", error);
    return apiError("Failed to fetch brands", 500);
  }
}
