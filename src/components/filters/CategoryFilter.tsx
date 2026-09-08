"use client";

import { useState } from "react";
import { ApproveIcon } from "../icons/ApproveIcon";
import { ChevronDownIcon } from "../icons/ChevronDownIcon";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type CategoryFilterProps = {
  categories: Category[];
  activeSlugs: string[];
  onChange: (slugs: string[]) => void;
};

const VISIBLE_COUNT = 4;

function CheckboxRow({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex justify-start items-center gap-4"
    >
      {checked ? (
        <span className="size-6 p-0.75 bg-primary-500 rounded-md flex justify-center items-center">
          <ApproveIcon className="size-4 text-neutral-900" />
        </span>
      ) : (
        <span className="size-6 bg-gray-50 rounded-md border border-gray-400" />
      )}
      <span className="text-neutral-900 text-base font-medium leading-6">
        {label}
      </span>
    </button>
  );
}

export function CategoryFilter({
  categories,
  activeSlugs,
  onChange,
}: CategoryFilterProps) {
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(true);

  const visibleCategories = expanded
    ? categories
    : categories.slice(0, VISIBLE_COUNT);
  const hasMore = categories.length > VISIBLE_COUNT;

  const isAllSelected = activeSlugs.length === 0;

  const handleToggleCategory = (slug: string) => {
    const isSelected = activeSlugs.includes(slug);
    const next = isSelected
      ? activeSlugs.filter((s) => s !== slug)
      : [...activeSlugs, slug];
    onChange(next);
  };

  return (
    <div className="self-stretch px-2.5 flex flex-col justify-start items-start gap-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="self-stretch py-2 flex justify-between items-center"
      >
        <span className="text-neutral-900 text-xl font-semibold leading-8">
          Category
        </span>
        <ChevronDownIcon
          className={`size-4 text-neutral-900 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="self-stretch px-2 flex flex-col justify-start items-start gap-5">
          <CheckboxRow
            label="All"
            checked={isAllSelected}
            onClick={() => onChange([])}
          />
          {visibleCategories.map((category) => (
            <CheckboxRow
              key={category.id}
              label={category.name}
              checked={activeSlugs.includes(category.slug)}
              onClick={() => handleToggleCategory(category.slug)}
            />
          ))}

          {hasMore && !expanded && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="rounded-md flex justify-center items-center gap-3.5"
            >
              <span className="text-neutral-600 text-base font-medium leading-6">
                Load More
              </span>
              <ChevronDownIcon
                className={`size-4 text-neutral-900 transition-transform ${open ? "" : "rotate-180"}`}
              />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
