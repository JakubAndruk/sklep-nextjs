"use client";

import type { CartItem } from "@/lib/api/cart-client";
import { useCart } from "@/context/CartContext";
import { CheckboxSquare } from "@/components/ui/CheckboxSquare";
import { CartItemDetails } from "./CartItemDetails";

type CartItemRowProps = {
  item: CartItem;
  isSelected: boolean;
  onToggleSelect: () => void;
};

export function CartItemRow({
  item,
  isSelected,
  onToggleSelect,
}: CartItemRowProps) {
  const { updateItemQuantity, updateItemNote, removeItem } = useCart();

  return (
    <div className="self-stretch flex justify-start items-center gap-6">
      <CheckboxSquare
        checked={isSelected}
        onChange={onToggleSelect}
        ariaLabel={`Select ${item.product.name}`}
      />

      <div className="flex-1">
        <CartItemDetails
          item={item}
          onChangeQuantity={updateItemQuantity}
          onSaveNote={updateItemNote}
          onRemove={removeItem}
          allowNotes
          showProductProtection={false}
        />
      </div>
    </div>
  );
}
