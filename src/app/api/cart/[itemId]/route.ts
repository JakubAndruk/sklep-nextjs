import { auth } from "@/auth";
import { apiError, apiSuccess } from "@/lib/utils/response";
import { removeCartItem, updateCartItem } from "@/lib/db/cart";
import { validateUpdateCartItemInput } from "@/lib/validators/cart";
import { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> },
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return apiError("Unauthorized", 401);

  try {
    const { itemId } = await params;
    const body = await request.json();
    const validation = validateUpdateCartItemInput(body);

    if (!validation.success)
      return apiError(validation.error, validation.status);

    const result = await updateCartItem(userId, itemId, validation.data);

    if (!result.success) return apiError(result.error, result.status);

    return apiSuccess(result.cart, { message: "Cart item updated" });
  } catch (error) {
    console.error("Error updating cart item", error);
    return apiError("Failed to update cart item", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> },
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return apiError("Unauthorized", 401);

  try {
    const { itemId } = await params;

    const result = await removeCartItem(userId, itemId);

    if (!result.success) return apiError(result.error, result.status);

    return apiSuccess(result.cart, { message: "Cart item removed" }, 200);
  } catch (error) {
    console.error("Error removing cart item", error);
    return apiError("Failed to remove cart item", 500);
  }
}
