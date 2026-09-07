"use client";

import { useState, useRef, useEffect } from "react";
import { Select } from "../ui/Select";

type Option = { value: string; label: string };

type DropdownProps = {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  widthClass?: string;
};

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
    <div className="self-stretch flex flex-wrap justify-start items-start gap-14">
      <div className="flex justify-start items-center gap-4">
        <span className="text-neutral-900 text-xl font-semibold leading-8">
          Sort by
        </span>
        <div className="w-44">
          <Select
            value={sort}
            onChange={onSortChange}
            options={SORT_OPTIONS}
            className="text-sm py-2.5"
          />
        </div>
      </div>

      <div className="flex justify-start items-center gap-4">
        <span className="text-neutral-900 text-xl font-semibold leading-8">
          Show
        </span>
        <div className="w-24">
          <Select
            value={limit}
            onChange={onLimitChange}
            options={SHOW_OPTIONS}
            className="text-sm py-2.5"
          />
        </div>
      </div>
    </div>
  );
}
