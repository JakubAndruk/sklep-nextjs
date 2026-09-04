"use client";

import { useState, useRef, useEffect } from "react";

type Option = { value: string; label: string };

type DropdownProps = {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  widthClass?: string;
};

function Dropdown({
  label,
  value,
  options,
  onChange,
  widthClass = "w-32",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-start items-center gap-4">
      <span className="text-neutral-900 text-xl font-semibold leading-8">
        {label}
      </span>
      <div ref={ref} className={`relative ${widthClass}`}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full px-4 py-2.5 bg-base-white rounded-md outline-1 outline-offset-[-1px] outline-gray-400 flex justify-between items-center"
        >
          <span className="text-neutral-900 text-sm font-normal leading-6">
            {current?.label ?? value}
          </span>
          <svg
            viewBox="0 0 14 8"
            fill="none"
            className={`size-3.5 text-neutral-900 transition-transform ${open ? "rotate-180" : ""}`}
          >
            <path
              d="M1 1l6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {open && (
          <div className="absolute left-0 top-full mt-1 w-full bg-base-white rounded-md outline-1 outline-gray-200 shadow-md z-10 overflow-hidden">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm leading-6 hover:bg-gray-50 transition-colors ${
                  option.value === value
                    ? "text-primary-500 font-medium"
                    : "text-neutral-900 font-normal"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const SORT_OPTIONS: Option[] = [
  { value: "newest", label: "Latest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

const SHOW_OPTIONS: Option[] = [
  { value: "9", label: "9" },
  { value: "18", label: "18" },
  { value: "27", label: "27" },
];

type SortAndShowProps = {
  sort: string;
  limit: string;
  onSortChange: (value: string) => void;
  onLimitChange: (value: string) => void;
};

export function SortAndShow({
  sort,
  limit,
  onSortChange,
  onLimitChange,
}: SortAndShowProps) {
  return (
    <div className="self-stretch flex justify-start items-start gap-14">
      <Dropdown
        label="Sort by"
        value={sort}
        options={SORT_OPTIONS}
        onChange={onSortChange}
        widthClass="w-44"
      />
      <Dropdown
        label="Show"
        value={limit}
        options={SHOW_OPTIONS}
        onChange={onLimitChange}
        widthClass="w-24"
      />
    </div>
  );
}
