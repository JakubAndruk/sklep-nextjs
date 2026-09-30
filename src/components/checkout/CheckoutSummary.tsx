"use client";

import { formatPrice } from "@/lib/utils/format";
import { Button } from "../ui/Button";

type CheckoutSummaryProps = {
  itemCount: number;
  productsAmount: number;
  productProtection: number;
  shippingPrice: number;
  shippingInsurance: number;
  serviceFee: number;
  totalAmount: number;
  onPayNow: () => void;
  isSubmitting: boolean;
  disabled: boolean;
};

export function CheckoutSummary({
  itemCount,
  productsAmount,
  productProtection,
  shippingPrice,
  shippingInsurance,
  serviceFee,
  totalAmount,
  onPayNow,
  isSubmitting,
  disabled,
}: CheckoutSummaryProps) {
  return (
    <div className="w-96 p-6 bg-base-white rounded-md outline-1 -outline-offset-1 outline-gray-200 flex flex-col justify-center items-center gap-6">
      <div className="self-stretch flex flex-col justify-start items-start gap-4">
        <div className="text-neutral-900 text-lg font-medium leading-7">
          Total Product
        </div>
        <div className="self-stretch flex justify-between items-center">
          <span className="text-neutral-600 text-base font-medium leading-6">
            Total Product Price ({itemCount} Item{itemCount === 1 ? "" : "s"})
          </span>
          <span className="text-neutral-900 text-lg font-medium leading-7">
            {formatPrice(productsAmount)}
          </span>
        </div>
        <div className="self-stretch flex justify-between items-center">
          <span className="text-neutral-600 text-base font-medium leading-6">
            Total Product Protection
          </span>
          <span className="text-neutral-900 text-lg font-medium leading-7">
            {formatPrice(productProtection)}
          </span>
        </div>
        <div className="self-stretch flex justify-between items-center">
          <span className="text-neutral-600 text-base font-medium leading-6">
            Total Shipping Price
          </span>
          <span className="text-neutral-900 text-lg font-medium leading-7">
            {formatPrice(shippingPrice)}
          </span>
        </div>
        <div className="self-stretch flex justify-between items-center">
          <span className="text-neutral-600 text-base font-medium leading-6">
            Shipping Insurance
          </span>
          <span className="text-neutral-900 text-lg font-medium leading-7">
            {formatPrice(shippingInsurance)}
          </span>
        </div>
      </div>

      <div className="self-stretch h-0 outline-1 outline-offset-[-0.5px] outline-gray-200" />

      <div className="self-stretch flex flex-col justify-start items-start gap-4">
        <div className="text-neutral-900 text-lg font-medium leading-7">
          Transaction Fees
        </div>
        <div className="self-stretch flex justify-between items-center">
          <span className="text-neutral-600 text-base font-medium leading-6">
            Service Fees
          </span>
          <span className="text-neutral-900 text-lg font-medium leading-7">
            {formatPrice(serviceFee)}
          </span>
        </div>
      </div>

      <div className="self-stretch h-0 outline-1 outline-offset-[-0.5px] outline-gray-200" />

      <div className="self-stretch flex flex-col justify-start items-start gap-8">
        <div className="self-stretch flex justify-between items-center">
          <span className="text-neutral-900 text-lg font-medium leading-7">
            Grand total
          </span>
          <span className="text-neutral-900 text-3xl font-medium leading-10">
            {formatPrice(totalAmount)}
          </span>
        </div>

        <Button onClick={onPayNow} disabled={disabled || isSubmitting}>
          {isSubmitting ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </div>
  );
}
