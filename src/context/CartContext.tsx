"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import {
  fetchCart,
  addToCart as addToCartApi,
  updateCartItem as updateCartItemApi,
  removeCartItem as removeCartItemApi,
  removeCartItems as removeCartItemsApi,
  Cart,
} from "@/lib/api/cart-client";
import { useNotification } from "./NotificationContext";

const EMPTY_CART: Cart = {
  id: null,
  userId: "",
  items: [],
  totalAmount: 0,
  updatedAt: null,
};

interface CartContextValue {
  cart: Cart;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
  addItem: (
    productId: string,
    quantity?: number,
    colorId?: string | null,
  ) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  updateItemNote: (itemId: string, note: string) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  keepOnlySelected: (selectedItemIds: string[]) => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { showNotification } = useNotification();
  const { status, data: session } = useSession();
  const isAuthenticated = status === "authenticated";
  const userId = session?.user?.id;

  const [cartState, setCartState] = useState<Cart>(EMPTY_CART);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      return;
    }

    let isMounted = true;

    fetchCart()
      .then((freshCart) => {
        if (isMounted) {
          setCartState(freshCart);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load cart");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, userId]);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);
    try {
      const freshCart = await fetchCart();
      setCartState(freshCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load cart");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const addItem = useCallback(
    async (productId: string, quantity = 1, colorId?: string | null) => {
      if (!isAuthenticated) return;

      setError(null);
      try {
        const updatedCart = await addToCartApi(productId, quantity, colorId);
        setCartState(updatedCart);
        showNotification("success", "Product Successfully Added");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to add item to cart";
        setError(message);
        showNotification("error", message);
        throw new Error(message);
      }
    },
    [showNotification, isAuthenticated],
  );

  const updateItemQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (!isAuthenticated) return;
      setError(null);
      try {
        const updatedCart = await updateCartItemApi(itemId, { quantity });
        setCartState(updatedCart);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update item";
        setError(message);
        throw new Error(message);
      }
    },
    [isAuthenticated],
  );

  const updateItemNote = useCallback(
    async (itemId: string, note: string) => {
      if (!isAuthenticated) return;
      setError(null);
      try {
        const updatedCart = await updateCartItemApi(itemId, { note });
        setCartState(updatedCart);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update note";
        setError(message);
        throw new Error(message);
      }
    },
    [isAuthenticated],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      if (!isAuthenticated) return;
      setError(null);
      try {
        const updatedCart = await removeCartItemApi(itemId);
        setCartState(updatedCart);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to remove item";
        setError(message);
        throw new Error(message);
      }
    },
    [isAuthenticated],
  );

  const keepOnlySelected = useCallback(
    async (selectedItemIds: string[]) => {
      if (!isAuthenticated) return;

      const selectedSet = new Set(selectedItemIds);
      const idsToRemove = cartState.items
        .map((item) => item.id)
        .filter((id) => !selectedSet.has(id));

      if (idsToRemove.length === 0) return;

      setError(null);
      try {
        const updatedCart = await removeCartItemsApi(idsToRemove);
        setCartState(updatedCart);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to update cart before checkout";
        setError(message);
        showNotification("error", message);
        throw new Error(message);
      }
    },
    [isAuthenticated, cartState.items, showNotification],
  );

  const activeCart = isAuthenticated ? cartState : EMPTY_CART;
  const itemCount = activeCart.items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart: activeCart,
        itemCount,
        isLoading,
        error,
        refreshCart,
        addItem,
        updateItemQuantity,
        updateItemNote,
        removeItem,
        keepOnlySelected,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
