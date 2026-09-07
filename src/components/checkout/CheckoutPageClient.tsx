"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { CartItem } from "@/lib/api/cart-client";
import { updateCartItem } from "@/lib/api/cart-client";
import { createOrderClient } from "@/lib/api/orders-client";
import { useNotification } from "@/context/NotificationContext";
import { useCart } from "@/context/CartContext";
import { CheckoutOrderItems } from "./CheckoutOrderItems";
import { AddressSelector } from "./AddressSelector";
import { ShippingCard } from "./ShippingCard";
import { PaymentMethodCard } from "./PaymentMethodCard";
import { CheckoutSummary } from "./CheckoutSummary";
import { Address } from "@/lib/api/addresses-client";

type PricingConfig = {
  shippingPrice: number;
  serviceFee: number;
  productProtectionPerUnit: number;
  shippingInsuranceRate: number;
};

type CheckoutPageClientProps = {
  items: CartItem[];
  addresses: Address[];
  pricing: PricingConfig;
};

export function CheckoutPageClient({
  items: initialItems,
  addresses: initialAddresses,
  pricing,
}: CheckoutPageClientProps) {
  const router = useRouter();
  const { showNotification } = useNotification();
  const { refreshCart } = useCart();

  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    initialAddresses.find((a) => a.isDefault)?.id ??
      initialAddresses[0]?.id ??
      null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddressCreated = useCallback((address: Address) => {
    setAddresses((prev) => {
      const next = address.isDefault
        ? prev.map((a) => ({ ...a, isDefault: false }))
        : prev;
      return [address, ...next];
    });
  }, []);

  const handleChangeQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      try {
        const updatedCart = await updateCartItem(itemId, { quantity });
        setItems(updatedCart.items);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update item";
        showNotification("error", message);
        throw err;
      }
    },
    [showNotification],
  );

  const handleSaveNote = useCallback(
    async (itemId: string, note: string) => {
      try {
        const updatedCart = await updateCartItem(itemId, { note });
        setItems(updatedCart.items);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update note";
        showNotification("error", message);
        throw err;
      }
    },
    [showNotification],
  );

  const handleToggleProductProtection = useCallback(
    async (itemId: string, selected: boolean) => {
      try {
        const updatedCart = await updateCartItem(itemId, {
          productProtectionSelected: selected,
        });
        setItems(updatedCart.items);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to update product protection";
        showNotification("error", message);
        throw err;
      }
    },
    [showNotification],
  );

  const totals = useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const productsAmount = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    const productProtection = items.reduce((sum, item) => {
      if (!item.productProtectionSelected) return sum;
      return sum + pricing.productProtectionPerUnit * item.quantity;
    }, 0);
    const shippingInsurance = productsAmount * pricing.shippingInsuranceRate;
    const totalAmount =
      productsAmount +
      productProtection +
      pricing.shippingPrice +
      shippingInsurance +
      pricing.serviceFee;

    return {
      itemCount,
      productsAmount,
      productProtection,
      shippingInsurance,
      totalAmount,
    };
  }, [items, pricing]);

  const handlePayNow = useCallback(async () => {
    if (!selectedAddressId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { orderId } = await createOrderClient({
        type: "existing",
        addressId: selectedAddressId,
      });

      await refreshCart();
      router.push(`/orders/${orderId}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to place order.";
      showNotification("error", message);
      setIsSubmitting(false);
    }
  }, [selectedAddressId, isSubmitting, router, showNotification, refreshCart]);

  if (items.length === 0) {
    return (
      <div className="w-full p-10 flex flex-col justify-center items-center gap-4">
        <p className="text-neutral-600 text-lg font-medium">
          There are no items to check out.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full p-2 xs:p-10 flex  flex-wrap justify-start items-start gap-12">
      <div className="flex-1 flex flex-col justify-start items-start gap-10">
        <CheckoutOrderItems
          items={items}
          productProtectionUnitPrice={pricing.productProtectionPerUnit}
          onChangeQuantity={handleChangeQuantity}
          onSaveNote={handleSaveNote}
          onToggleProductProtection={handleToggleProductProtection}
        />

        <AddressSelector
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          onSelectAddress={setSelectedAddressId}
          onAddressCreated={handleAddressCreated}
        />

        <ShippingCard />

        <PaymentMethodCard />
      </div>

      <CheckoutSummary
        itemCount={totals.itemCount}
        productsAmount={totals.productsAmount}
        productProtection={totals.productProtection}
        shippingPrice={pricing.shippingPrice}
        shippingInsurance={totals.shippingInsurance}
        serviceFee={pricing.serviceFee}
        totalAmount={totals.totalAmount}
        onPayNow={handlePayNow}
        isSubmitting={isSubmitting}
        disabled={!selectedAddressId}
      />
    </div>
  );
}
