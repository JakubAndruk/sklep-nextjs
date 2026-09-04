"use client";

import { useState, useCallback, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { CartIcon } from "../icons/CartIcon";

export type ProductColor = {
  id: string;
  name: string;
  hexValue: string;
  stock: number;
  isDefault: boolean;
};

type ProductPurchasePanelProps = {
  productId: string;
  price: number;
  stock: number;
  colors: ProductColor[];
};

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

function getContrastColor(hex: unknown): string {
  if (typeof hex !== "string") return "#FFFFFF";

  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return "#FFFFFF";

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);

  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return "#FFFFFF";

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150 ? "#171717" : "#FFFFFF";
}

function getInitialColor(colors: ProductColor[]): ProductColor | null {
  if (colors.length === 0) return null;
  return colors.find((c) => c.isDefault) ?? colors[0];
}

export function ProductPurchasePanel({
  productId,
  price,
  stock,
  colors,
}: ProductPurchasePanelProps) {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(() =>
    getInitialColor(colors),
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const availableStock = selectedColor ? selectedColor.stock : stock;

  useEffect(() => {
    setQuantity((q) => Math.min(q, Math.max(availableStock, 1)));
  }, [availableStock]);

  const decrease = useCallback(() => {
    setQuantity((q) => Math.max(1, q - 1));
  }, []);

  const increase = useCallback(() => {
    setQuantity((q) => Math.min(availableStock, q + 1));
  }, [availableStock]);

  const handleSelectColor = useCallback((color: ProductColor) => {
    setSelectedColor(color);
  }, []);

  const handleAddToCart = useCallback(async () => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      await addItem(productId, quantity, selectedColor?.id ?? null);
    } catch {
    } finally {
      setIsAdding(false);
    }
  }, [addItem, productId, quantity, selectedColor, isAdding]);

  const subtotal = price * quantity;
  const isOutOfStock = availableStock === 0;

  return (
    <div className="w-96 p-6 bg-base-white rounded-md outline-1 outline-offset-[-1px] outline-gray-200 flex flex-col justify-start items-start gap-8">
      {colors.length > 0 && (
        <div className="w-full flex flex-col justify-start items-start gap-3.5">
          <div className="text-neutral-500 text-lg font-medium leading-7">
            Colors
          </div>
          <div className="flex flex-wrap justify-start items-center gap-4">
            {colors.map((color) => {
              const isSelected = selectedColor?.id === color.id;
              const isColorOutOfStock = color.stock === 0;

              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => handleSelectColor(color)}
                  disabled={isColorOutOfStock}
                  aria-pressed={isSelected}
                  aria-label={`Select color ${color.name}${
                    isColorOutOfStock ? " (out of stock)" : ""
                  }`}
                  style={{ backgroundColor: color.hexValue }}
                  className="relative size-14 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSelected && !isColorOutOfStock && (
                    <svg
                      viewBox="0 0 16 10"
                      fill="none"
                      className="absolute inset-0 m-auto size-4"
                    >
                      <path
                        d="M1 5l4.5 4L15 1"
                        stroke={getContrastColor(color.hexValue)}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
          {selectedColor && (
            <span className="text-neutral-600 text-sm font-normal leading-6">
              {selectedColor.name}
            </span>
          )}
        </div>
      )}

      <div className="w-60 flex flex-col justify-start items-start gap-3.5">
        <div className="text-neutral-500 text-lg font-medium leading-7">
          Quantity
        </div>
        <div className="self-stretch flex justify-start items-center gap-4">
          <div className="flex-1 px-5 py-3.5 rounded-md outline-1 outline-offset-[-1px] outline-neutral-900 flex justify-center items-center gap-3.5">
            <button
              type="button"
              onClick={decrease}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="text-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg viewBox="0 0 16 2" fill="none" className="size-4">
                <path d="M0 1h16" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            <span className="text-neutral-900 text-base font-medium leading-6">
              {quantity}
            </span>
            <button
              type="button"
              onClick={increase}
              disabled={quantity >= availableStock}
              aria-label="Increase quantity"
              className="text-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg viewBox="0 0 16 16" fill="none" className="size-4">
                <path
                  d="M8 0v16M0 8h16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
          </div>
          <span className="text-neutral-900 text-base font-medium leading-6">
            Stock : {availableStock}
          </span>
        </div>
      </div>

      <div className="self-stretch flex justify-between items-center">
        <div className="text-neutral-500 text-lg font-medium leading-7">
          Subtotal
        </div>
        <div className="text-neutral-900 text-3xl font-medium leading-10">
          {formatPrice(subtotal)}
        </div>
      </div>

      <div className="self-stretch flex flex-col justify-start items-start gap-4">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding || isOutOfStock}
          className="self-stretch px-5 py-3.5 rounded-md outline-1 outline-offset-[-1px] outline-primary-500 flex justify-center items-center gap-3.5 hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-primary-500 text-base font-medium leading-6">
            {isOutOfStock
              ? "Out of stock"
              : isAdding
                ? "Adding..."
                : "Add to Cart"}
          </span>
          {!isOutOfStock && <CartIcon className="size-5 text-primary-500" />}
        </button>
      </div>
    </div>
  );
}
