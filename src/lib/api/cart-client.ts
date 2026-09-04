export interface CartProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
}

export interface CartItemColor {
  id: string;
  name: string;
  hexValue: string;
  stock: number;
}

export interface CartItem {
  id: string;
  quantity: number;
  note: string | null;
  product: CartProduct;
  color: CartItemColor | null;
}

export interface Cart {
  id: string | null;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  updatedAt: string | null;
}

function extractErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object" || !("error" in body)) {
    return fallback;
  }

  const error = (body as { error: unknown }).error;

  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }

  if (error && typeof error === "object" && !Array.isArray(error)) {
    const fieldErrors = error as Record<string, unknown>;
    const firstMessages = Object.values(fieldErrors).find(
      (value): value is string[] =>
        Array.isArray(value) &&
        value.length > 0 &&
        typeof value[0] === "string",
    );

    if (firstMessages) {
      return firstMessages[0];
    }
  }

  return fallback;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const fallback = "Something went wrong with the cart";

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    throw new Error(fallback);
  }

  const isSuccessFlagTrue =
    typeof body === "object" &&
    body !== null &&
    "success" in body &&
    (body as { success: unknown }).success === true;

  if (!res.ok || !isSuccessFlagTrue) {
    throw new Error(extractErrorMessage(body, fallback));
  }

  return (body as { data: T }).data;
}

export async function fetchCart(): Promise<Cart> {
  const res = await fetch("/api/cart");
  return handleResponse<Cart>(res);
}

export async function addToCart(
  productId: string,
  quantity: number = 1,
  colorId?: string | null,
): Promise<Cart> {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, quantity, colorId }),
  });
  return handleResponse<Cart>(res);
}

export async function updateCartItem(
  itemId: string,
  updates: { quantity?: number; note?: string },
): Promise<Cart> {
  const res = await fetch(`/api/cart/${itemId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return handleResponse<Cart>(res);
}

export async function removeCartItem(itemId: string): Promise<Cart> {
  const res = await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
  return handleResponse<Cart>(res);
}

export async function removeCartItems(itemIds: string[]): Promise<Cart> {
  const res = await fetch("/api/cart", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemIds }),
  });
  return handleResponse<Cart>(res);
}
