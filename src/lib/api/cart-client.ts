import { apiFetch } from "./http-client";

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
  productProtectionSelected: boolean;
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

const FALLBACK = "Something went wrong with the cart";

export function fetchCart(): Promise<Cart> {
  return apiFetch<Cart>("/api/cart", { fallbackMessage: FALLBACK });
}

export function addToCart(
  productId: string,
  quantity: number = 1,
  colorId?: string | null,
): Promise<Cart> {
  return apiFetch<Cart>("/api/cart", {
    method: "POST",
    body: { productId, quantity, colorId },
    fallbackMessage: FALLBACK,
  });
}

export function updateCartItem(
  itemId: string,
  updates: {
    quantity?: number;
    note?: string;
    productProtectionSelected?: boolean;
  },
): Promise<Cart> {
  return apiFetch<Cart>(`/api/cart/${itemId}`, {
    method: "PATCH",
    body: updates,
    fallbackMessage: FALLBACK,
  });
}

export function removeCartItem(itemId: string): Promise<Cart> {
  return apiFetch<Cart>(`/api/cart/${itemId}`, {
    method: "DELETE",
    fallbackMessage: FALLBACK,
  });
}

export function removeCartItems(itemIds: string[]): Promise<Cart> {
  return apiFetch<Cart>("/api/cart", {
    method: "DELETE",
    body: { itemIds },
    fallbackMessage: FALLBACK,
  });
}
