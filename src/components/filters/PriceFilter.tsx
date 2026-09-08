"use client";

import { useState, useEffect } from "react";
import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

type PriceFilterProps = {
  minPrice: string;
  maxPrice: string;
  onApply: (minPrice: string, maxPrice: string) => void;
};

function PriceInput({
  value,
  placeholder,
  hasError,
  onChange,
}: {
  value: string;
  placeholder: string;
  hasError: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="self-stretch flex justify-start items-start">
      <div
        className={`flex-1 px-0 xs:px-4 py-3.5 bg-base-white rounded-tl-md rounded-bl-md outline-1 outline-offset-[-0.5px] flex justify-start items-center gap-2.5 ${
          hasError ? "outline-danger-300" : "outline-gray-400"
        }`}
      >
        <span className="text-neutral-900 text-base font-normal leading-6">
          $
        </span>
        <input
          type="number"
          min={0}
          inputMode="decimal"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 bg-transparent text-neutral-900 text-base font-normal leading-6 placeholder:text-neutral-500 outline-none"
        />
      </div>
      <div
        className={`self-stretch px-4 py-3.5 bg-base-white rounded-tr-md rounded-br-md outline-1 outline-offset-[-0.5px] flex justify-center items-center gap-3 overflow-hidden ${
          hasError ? "outline-danger-300" : "outline-gray-400"
        }`}
      >
        <span className="text-neutral-900 text-base font-medium leading-6">
          USD
        </span>
      </div>
    </div>
  );
}

const DEBOUNCE_MS = 500;

export function PriceFilter({ minPrice, maxPrice, onApply }: PriceFilterProps) {
  const [open, setOpen] = useState(true);
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  useEffect(() => {
    setLocalMin(minPrice);
    setLocalMax(maxPrice);
  }, [minPrice, maxPrice]);

  const isRangeInvalid =
    localMin !== "" && localMax !== "" && Number(localMin) > Number(localMax);

  const debouncedApply = useDebouncedCallback((min: string, max: string) => {
    if (min !== "" && max !== "" && Number(min) > Number(max)) return;
    onApply(min, max);
  }, DEBOUNCE_MS);

  const handleMinChange = (value: string) => {
    setLocalMin(value);
    debouncedApply(value, localMax);
  };

  const handleMaxChange = (value: string) => {
    setLocalMax(value);
    debouncedApply(localMin, value);
  };

  return (
    <div className="self-stretch px-2.5 flex flex-col justify-start items-start gap-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="self-stretch py-2 flex justify-between items-center"
      >
        <span className="text-neutral-900 text-xl font-semibold leading-8">
          Price
        </span>
        <ChevronDownIcon
          className={`size-4 text-neutral-900 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <PriceInput
              value={localMin}
              placeholder="Min Price"
              hasError={isRangeInvalid}
              onChange={handleMinChange}
            />
            <PriceInput
              value={localMax}
              placeholder="Max Price"
              hasError={isRangeInvalid}
              onChange={handleMaxChange}
            />
          </div>
          {isRangeInvalid && (
            <p
              role="alert"
              className="self-stretch text-danger-500 text-sm font-normal leading-6"
            >
              Minimum price cannot be greater than maximum price.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
