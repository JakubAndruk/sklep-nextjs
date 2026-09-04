"use client";

import { useState, useCallback, MouseEvent } from "react";
import { useCart } from "@/context/CartContext";
import { CartIcon } from "../icons/CartIcon";

type AddToCartButtonProps = {
  productId: string;
  quantity?: number;
  variant?: "icon" | "full";
  className?: string;
};

export function AddToCartButton({
  productId,
  quantity = 1,
  variant = "icon",
  className = "",
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(
    async (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (isLoading) return;

      setIsLoading(true);
      try {
        await addItem(productId, quantity);
      } catch {
      } finally {
        setIsLoading(false);
      }
    },
    [addItem, productId, quantity, isLoading],
  );

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className={`w-full px-4 py-3 bg-primary-500 text-base-white rounded-md text-base font-semibold flex justify-center items-center gap-2 hover:opacity-90 transition-colors disabled:opacity-60 ${className}`}
      >
        {isLoading ? "Adding..." : "Add to cart"}
        <CartIcon className="size-6" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      aria-label="Add to cart"
      className={`p-1 bg-base-white rounded-md flex justify-center items-center cursor-pointer hover:bg-base-white-2 transition-colors disabled:opacity-60 ${className}`}
    >
      <CartIcon className="size-6 text-neutral-900" />
    </button>
  );
}
