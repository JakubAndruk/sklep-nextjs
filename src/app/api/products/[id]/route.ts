import { apiError, apiSuccess } from "@/lib/utils/response";
import { getProductById } from "@/lib/db/products";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const product = await getProductById(id);

    if (!product) return apiError("Product not found", 404);

    return apiSuccess(product);
  } catch (error) {
    console.error(`Error fetching product ${id}`, error);
    return apiError(`Failed to fetch product ${id}`, 500);
  }
}
