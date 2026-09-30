import { apiError, apiSuccess } from "@/lib/utils/response";
import { getProducts } from "@/lib/db/products";
import { validateProductQuery } from "@/lib/validators/products";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const params: Record<string, string> = Object.fromEntries(
      searchParams.entries(),
    );

    const validation = validateProductQuery(params);

    if (!validation.success)
      return apiError(validation.error, validation.status);

    const result = await getProducts(validation.data);
    return apiSuccess(result.products, result.pagination);
  } catch (error) {
    console.error("Error fetching products", error);
    return apiError("Failed to fetch products", 500);
  }
}
