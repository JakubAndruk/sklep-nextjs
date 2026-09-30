"use client";

import { useState, useCallback } from "react";
import type { CartItem } from "@/lib/api/cart-client";
import { TrashIcon } from "@/components/icons/TrashIcon";
import { MinusIcon } from "@/components/icons/MinusIcon";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { NoteEditor } from "./NoteEditor";
import Image from "next/image";
import { formatPrice } from "@/lib/utils/format";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { ApproveIcon } from "../icons/ApproveIcon";

type CartItemDetailsProps = {
  item: CartItem;
  onChangeQuantity: (itemId: string, quantity: number) => Promise<void>;
  onSaveNote: (itemId: string, note: string) => Promise<void>;
  onRemove?: (itemId: string) => Promise<void>;
  allowNotes?: boolean;
  showProductProtection?: boolean;
  productProtectionPrice?: number;
  onToggleProductProtection?: (
    itemId: string,
    selected: boolean,
  ) => Promise<void>;
};

export function CartItemDetails({
  item,
  onChangeQuantity,
  onSaveNote,
  onRemove,
  allowNotes = true,
  showProductProtection = false,
  productProtectionPrice = 0,
  onToggleProductProtection,
}: CartItemDetailsProps) {
  const [isEditingNote, setIsEditingNote] = useState(Boolean(item.note));
  const availableStock = item.color ? item.color.stock : item.product.stock;

  const { run: runChangeQuantity, isLoading: isUpdating } = useAsyncAction(
    (qty: number) => onChangeQuantity(item.id, qty),
  );
  const { run: runRemove, isLoading: isRemoving } = useAsyncAction(() =>
    onRemove ? onRemove(item.id) : Promise.resolve(),
  );
  const { run: runToggleProtection, isLoading: isTogglingProtection } =
    useAsyncAction((selected: boolean) =>
      onToggleProductProtection
        ? onToggleProductProtection(item.id, selected)
        : Promise.resolve(),
    );

  const handleDecrease = useCallback(() => {
    if (item.quantity <= 1) return;
    runChangeQuantity(item.quantity - 1).catch(() => {});
  }, [item.quantity, runChangeQuantity]);

  const handleIncrease = useCallback(() => {
    if (item.quantity >= availableStock) return;
    runChangeQuantity(item.quantity + 1).catch(() => {});
  }, [item.quantity, availableStock, runChangeQuantity]);

  const handleRemove = useCallback(() => {
    if (!onRemove) return;
    runRemove().catch(() => {});
  }, [onRemove, runRemove]);

  const handleToggleProtection = useCallback(() => {
    if (!onToggleProductProtection) return;
    runToggleProtection(!item.productProtectionSelected).catch(() => {});
  }, [
    onToggleProductProtection,
    item.productProtectionSelected,
    runToggleProtection,
  ]);

  return (
    <div className="self-stretch p-2 xs:p-6 bg-base-white rounded-md outline-1 -outline-offset-1 outline-gray-200 flex flex-col justify-center items-start gap-6">
      <div className="self-stretch flex flex-wrap justify-start items-center gap-8">
        <div className="relative w-44 h-36 p-3 rounded-md outline-1 -outline-offset-1 outline-gray-200 flex flex-col justify-start items-start gap-2.5">
          <Image
            fill
            sizes="176px"
            className=" rounded-md object-contain bg-neutral-900"
            src={item.product.imageUrl}
            alt={item.product.name}
          />
        </div>

        <div className="flex-1 flex flex-col justify-start items-start gap-4">
          <div className="self-stretch flex  flex-col justify-start items-start gap-3">
            <div className="self-stretch flex  justify-between items-start">
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
                  className="size-5 rounded-full outline-1 -outline-offset-1 outline-gray-200"
                  style={{ backgroundColor: item.color.hexValue }}
                  aria-hidden="true"
                />
                <span className="text-neutral-600 text-sm font-normal leading-6">
                  {item.color.name}
                </span>
              </div>
            )}
          </div>

          <div className="self-stretch flex flex-wrap justify-between items-center">
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

              <div className="w-32 px-5 py-2.5 rounded-md outline-1 -outline-offset-1 outline-neutral-900 flex justify-center items-center gap-3.5">
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
      </div>

      {showProductProtection && (
        <>
          <div className="self-stretch h-0 outline-1 outline-offset-[-0.5px] outline-gray-200" />

          <div className="self-stretch flex flex-col justify-center items-start gap-1">
            <div className="self-stretch flex justify-between items-center">
              <button
                type="button"
                onClick={handleToggleProtection}
                disabled={isTogglingProtection}
                aria-pressed={item.productProtectionSelected}
                className="flex justify-start items-center gap-4 disabled:opacity-60"
              >
                {item.productProtectionSelected ? (
                  <span className="size-6 p-0.75 bg-primary-500 rounded-md flex justify-center items-center shrink-0">
                    <ApproveIcon className="text-base-white-2" />
                  </span>
                ) : (
                  <span className="size-6 bg-gray-50 rounded-md border border-gray-400 shrink-0" />
                )}
                <span className="text-neutral-900 text-base font-medium leading-6">
                  Product Protection
                </span>
              </button>
              <div className="text-neutral-900 text-lg font-medium leading-7">
                {formatPrice(productProtectionPrice)}
              </div>
            </div>
            <div className="self-stretch px-10 flex flex-col justify-center items-start gap-2.5">
              <p className="text-neutral-600 text-sm font-normal leading-6">
                The claim process is easy and instant, valid for 6 months
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
