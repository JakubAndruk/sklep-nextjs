"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CartItemRow } from "./CartItemRow";
import { CartSummary } from "./CartSummary";
import { CheckboxSquare } from "@/components/ui/CheckboxSquare";

export function CartPageClient() {
  const router = useRouter();
  const { cart, keepOnlySelected } = useCart();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current && cart.items.length > 0) {
      setSelectedIds(new Set(cart.items.map((item) => item.id)));
      hasInitialized.current = true;
      return;
    }

    setSelectedIds((prev) => {
      const validIds = new Set(cart.items.map((item) => item.id));
      const next = new Set<string>();
      prev.forEach((id) => {
        if (validIds.has(id)) next.add(id);
      });
      return next;
    });
  }, [cart.items]);

  const allSelected =
    cart.items.length > 0 && selectedIds.size === cart.items.length;

  const toggleSelectAll = useCallback(() => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(cart.items.map((item) => item.id)));
    }
  }, [allSelected, cart.items]);

  const toggleSelectItem = useCallback((itemId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  const selectedTotal = useMemo(() => {
    return cart.items
      .filter((item) => selectedIds.has(item.id))
      .reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart.items, selectedIds]);

  const handleCheckout = useCallback(async () => {
    if (selectedIds.size === 0 || isCheckingOut) return;
    setIsCheckingOut(true);
    try {
      await keepOnlySelected(Array.from(selectedIds));
      router.push("/checkout");
    } catch {
      setIsCheckingOut(false);
    }
  }, [selectedIds, isCheckingOut, keepOnlySelected, router]);

  if (cart.items.length === 0) {
    return (
      <div className="w-full p-10 flex flex-col  justify-center items-center gap-4">
        <p className="text-neutral-600 text-lg font-medium">
          Your cart is empty.
        </p>
        <Link
          href="/products"
          className="text-primary-500 text-base font-semibold hover:underline"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="self-stretch px-2 xs-px-10 py-10 flex flex-wrap justify-start items-start gap-12">
      <div className="flex-1 flex flex-col  justify-start items-start gap-8">
        <CheckboxSquare
          checked={allSelected}
          onChange={toggleSelectAll}
          label="Select All"
        />

        <div className="self-stretch flex flex-col flex-wrap justify-start items-start gap-6">
          {cart.items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              isSelected={selectedIds.has(item.id)}
              onToggleSelect={() => toggleSelectItem(item.id)}
            />
          ))}
        </div>
      </div>

      <CartSummary
        selectedCount={cart.items
          .filter((item) => selectedIds.has(item.id))
          .reduce((sum, item) => sum + item.quantity, 0)}
        selectedTotal={selectedTotal}
        onCheckout={handleCheckout}
        isCheckingOut={isCheckingOut}
        disabled={selectedIds.size === 0}
      />
    </div>
  );
}
