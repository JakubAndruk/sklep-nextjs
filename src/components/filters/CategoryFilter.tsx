"use client";

import { useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type CategoryFilterProps = {
  categories: Category[];
  activeSlug: string | null;
  onChange: (slug: string | null) => void;
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
        <span className="size-6 p-[3px] bg-primary-500 rounded-md flex justify-center items-center">
          <svg viewBox="0 0 16 16" fill="none" className="size-4">
            <path
              d="M3 8.5L6.5 12L13 4"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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
  activeSlug,
  onChange,
}: CategoryFilterProps) {
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(true);

  const visibleCategories = expanded
    ? categories
    : categories.slice(0, VISIBLE_COUNT);
  const hasMore = categories.length > VISIBLE_COUNT;

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
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className={`size-4 text-neutral-900 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M2 5l6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="self-stretch px-2 flex flex-col justify-start items-start gap-5">
          <CheckboxRow
            label="All"
            checked={activeSlug === null}
            onClick={() => onChange(null)}
          />
          {visibleCategories.map((category) => (
            <CheckboxRow
              key={category.id}
              label={category.name}
              checked={activeSlug === category.slug}
              onClick={() => onChange(category.slug)}
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
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="size-2.5 text-neutral-600"
              >
                <path
                  d="M2 5l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
