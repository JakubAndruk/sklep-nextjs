import { auth } from "@/auth";
import { apiError, apiSuccess } from "@/lib/utils/response";
import { getOrderById } from "@/lib/db/orders";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return apiError("Unauthorized", 401);

  try {
    const { id } = await params;
    const order = await getOrderById(userId, id);

    if (!order) return apiError("Order not found", 404);

    return apiSuccess(order);
  } catch (error) {
    console.error("Error fetching order", error);
    return apiError("Failed to fetch order", 500);
  }
}
