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

      <div className="flex-1 p-6 bg-base-white rounded-md outline-1 outline-offset-[-1px] outline-gray-200 flex flex-col justify-center items-start gap-8">
        <div className="self-stretch flex justify-start items-center gap-8">
          <div className="w-44 h-36 p-3 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 flex flex-col justify-start items-start gap-2.5">
            <img
              className="self-stretch flex-1 rounded-md object-cover"
              src={item.product.imageUrl}
              alt={item.product.name}
            />
          </div>

          <CartItemDetails
            item={item}
            onChangeQuantity={updateItemQuantity}
            onSaveNote={updateItemNote}
            onRemove={removeItem}
            allowNotes
          />
        </div>
      </div>
    </div>
  );
}
