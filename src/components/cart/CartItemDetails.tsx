"use client";

import { useState, useCallback } from "react";
import type { CartItem } from "@/lib/api/cart-client";
import { TrashIcon } from "@/components/icons/TrashIcon";
import { MinusIcon } from "@/components/icons/MinusIcon";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { NoteEditor } from "./NoteEditor";

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

type CartItemDetailsProps = {
  item: CartItem;
  onChangeQuantity: (itemId: string, quantity: number) => Promise<void>;
  onSaveNote: (itemId: string, note: string) => Promise<void>;

  onRemove?: (itemId: string) => Promise<void>;
  allowNotes?: boolean;
};

export function CartItemDetails({
  item,
  onChangeQuantity,
  onSaveNote,
  onRemove,
  allowNotes = true,
}: CartItemDetailsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(Boolean(item.note));

  const availableStock = item.color ? item.color.stock : item.product.stock;

  const handleDecrease = useCallback(async () => {
    if (item.quantity <= 1 || isUpdating) return;
    setIsUpdating(true);
    try {
      await onChangeQuantity(item.id, item.quantity - 1);
    } catch {
    } finally {
      setIsUpdating(false);
    }
  }, [item.id, item.quantity, isUpdating, onChangeQuantity]);

  const handleIncrease = useCallback(async () => {
    if (item.quantity >= availableStock || isUpdating) return;
    setIsUpdating(true);
    try {
      await onChangeQuantity(item.id, item.quantity + 1);
    } catch {
    } finally {
      setIsUpdating(false);
    }
  }, [item.id, item.quantity, availableStock, isUpdating, onChangeQuantity]);

  const handleRemove = useCallback(async () => {
    if (!onRemove || isRemoving) return;
    setIsRemoving(true);
    try {
      await onRemove(item.id);
    } catch {
      setIsRemoving(false);
    }
  }, [item.id, isRemoving, onRemove]);

  return (
    <div className="flex-1 flex flex-col justify-start items-start gap-4">
      <div className="self-stretch flex flex-col justify-start items-start gap-3">
        <div className="self-stretch flex justify-between items-start">
          <div className="text-neutral-900 text-xl font-medium leading-8">
            {item.product.name}
          </div>
          {onRemove && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={isRemoving}
              aria-label={`Remove ${item.product.name} from cart`}
              className="text-danger-500 hover:opacity-70 transition-opacity disabled:opacity-40"
            >
              <TrashIcon className="size-5" />
            </button>
          )}
        </div>

        {item.color && (
          <div className="flex justify-start items-center gap-2">
            <span
              className="size-5 rounded-full outline-1 outline-offset-[-1px] outline-gray-200"
              style={{ backgroundColor: item.color.hexValue }}
              aria-hidden="true"
            />
            <span className="text-neutral-600 text-sm font-normal leading-6">
              {item.color.name}
            </span>
          </div>
        )}
      </div>

      <div className="self-stretch flex justify-between items-center">
        <div className="text-neutral-900 text-2xl font-medium leading-9">
          {formatPrice(item.product.price * item.quantity)}
        </div>

        <div className="flex justify-start items-center gap-6">
          {allowNotes && (
            <>
              <button
                type="button"
                onClick={() => setIsEditingNote((v) => !v)}
                className="rounded-md flex justify-center items-center gap-3.5 hover:opacity-80 transition-opacity"
              >
                <span className="text-primary-500 text-base font-medium leading-6">
                  {item.note ? "Edit Note" : "Write Note"}
                </span>
              </button>

              <div className="w-0 h-6 outline-1 outline-offset-[-0.5px] outline-gray-500" />
            </>
          )}

          <div className="w-32 px-5 py-2.5 rounded-md outline-1 outline-offset-[-1px] outline-neutral-900 flex justify-center items-center gap-3.5">
            <button
              type="button"
              onClick={handleDecrease}
              disabled={item.quantity <= 1 || isUpdating}
              aria-label="Decrease quantity"
              className="text-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <MinusIcon className="size-5" />
            </button>
            <span className="text-neutral-900 text-sm font-medium leading-6">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrease}
              disabled={item.quantity >= availableStock || isUpdating}
              aria-label="Increase quantity"
              className="text-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <PlusIcon className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {allowNotes && isEditingNote && (
        <NoteEditor
          key={item.id}
          itemId={item.id}
          initialNote={item.note ?? ""}
          onSave={onSaveNote}
        />
      )}
    </div>
  );
}
