import { auth } from "@/auth";
import { apiError, apiSuccess } from "@/lib/utils/response";
import {
  addProductToCart,
  getCartByUserId,
  removeCartItems,
} from "@/lib/db/cart";
import {
  validateAddToCartInput,
  validateRemoveCartItemsInput,
} from "@/lib/validators/cart";
import { NextRequest } from "next/server";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return apiError("Unauthorized", 401);

  try {
    const cart = await getCartByUserId(userId);
    return apiSuccess(cart);
  } catch (error) {
    console.error("Error fetching carts", error);
    return apiError("Failed to fetch carts", 500);
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return apiError("Unauthorized", 401);

  try {
    const body = await request.json();
    const validation = validateAddToCartInput(body);

    if (!validation.success)
      return apiError(validation.error, validation.status);

    const result = await addProductToCart(
      userId,
      validation.data.productId,
      validation.data.quantity,
      validation.data.colorId,
    );

    if (!result.success) return apiError(result.error, result.status);

    return apiSuccess(result.cart);
  } catch (error) {
    console.error("Error adding product to cart", error);
    return apiError("Failed to add product to cart", 500);
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return apiError("Unauthorized", 401);

  try {
    const body = await request.json();
    const validation = validateRemoveCartItemsInput(body);

    if (!validation.success)
      return apiError(validation.error, validation.status);

    const result = await removeCartItems(userId, validation.data.itemIds);

    if (!result.success) return apiError(result.error, result.status);

    return apiSuccess(result.cart, { message: "Cart items removed" });
  } catch (error) {
    console.error("Error removing cart items", error);
    return apiError("Failed to remove cart items", 500);
  }
}
