import type { CartItem } from "@/lib/api/cart-client";
import { CartItemDetails } from "@/components/cart/CartItemDetails";

type CheckoutOrderItemsProps = {
  items: CartItem[];
  productProtectionUnitPrice: number;
  onChangeQuantity: (itemId: string, quantity: number) => Promise<void>;
  onSaveNote: (itemId: string, note: string) => Promise<void>;
  onToggleProductProtection: (
    itemId: string,
    selected: boolean,
  ) => Promise<void>;
};

export function CheckoutOrderItems({
  items,
  productProtectionUnitPrice,
  onChangeQuantity,
  onSaveNote,
  onToggleProductProtection,
}: CheckoutOrderItemsProps) {
  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-4">
      <div className="text-neutral-900 text-2xl font-medium leading-9">
        Your Order
      </div>

      <div className="self-stretch flex flex-col justify-start items-start gap-6">
        {items.map((item) => (
          <CartItemDetails
            key={item.id}
            item={item}
            onChangeQuantity={onChangeQuantity}
            onSaveNote={onSaveNote}
            allowNotes
            showProductProtection
            productProtectionPrice={productProtectionUnitPrice * item.quantity}
            onToggleProductProtection={onToggleProductProtection}
          />
        ))}
      </div>
    </div>
  );
}
