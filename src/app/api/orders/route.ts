import { auth } from "@/auth";
import { apiError, apiSuccess } from "@/lib/utils/response";
import { createOrder, getOrdersByUserId } from "@/lib/db/orders";
import { validateCreateOrderInput } from "@/lib/validators/orders";
import { NextRequest } from "next/server";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return apiError("Unauthorized", 401);

  try {
    const orders = await getOrdersByUserId(userId);
    return apiSuccess(orders);
  } catch (error) {
    console.error("Error fetching orders", error);
    return apiError("Failed to fetch orders", 500);
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return apiError("Unauthorized", 401);

  try {
    const body = await request.json();
    const validation = validateCreateOrderInput(body);

    if (!validation.success) {
      return apiError(validation.error, validation.status);
    }

    const result = await createOrder(userId, validation.data);

    if (!result.success) {
      return apiError(result.error, result.status);
    }

    return apiSuccess(
      { orderId: result.orderId },
      { message: "Order created successfully" },
      201,
    );
  } catch (error) {
    console.error("Error in POST /api/orders", error);
    return apiError("Failed to create order", 500);
  }
}
