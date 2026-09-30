"use client";

import { ChevronRightIcon } from "../icons/ChevronRightIcon";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function getPageItems(page: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items = new Set<number>([1, 2, totalPages - 1, totalPages]);
  for (let p = page - 1; p <= page + 1; p++) {
    if (p >= 1 && p <= totalPages) items.add(p);
  }

  const sorted = Array.from(items).sort((a, b) => a - b);
  const result: (number | "...")[] = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push("...");
    }
    result.push(sorted[i]);
  }

  return result;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const items = getPageItems(page, totalPages);

  return (
    <div className="self-stretch flex flex-wrap justify-between items-center">
      <div className="flex justify-start items-center gap-2">
        {items.map((item, index) =>
          item === "..." ? (
            <div
              key={`ellipsis-${index}`}
              className="size-11 p-3 rounded-md flex flex-col justify-center items-center"
            >
              <span className="text-neutral-500 text-base font-medium leading-6">
                ...
              </span>
            </div>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              className={`size-11 p-3 rounded-md flex flex-col justify-center items-center transition-colors ${
                item === page ? "bg-primary-500" : "hover:bg-gray-50"
              }`}
            >
              <span
                className={`text-base font-medium leading-6 ${
                  item === page ? "text-base-white" : "text-neutral-500"
                }`}
              >
                {item}
              </span>
            </button>
          ),
        )}
      </div>

      <div className="flex justify-start items-center gap-8">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="px-5 py-2.5 rounded-md outline-1 -outline-offset-1 outline-neutral-900 flex justify-center items-center gap-3.5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          <ChevronRightIcon className="size-5 text-neutral-900 rotate-180" />

          <span className="text-neutral-900 text-sm font-medium leading-6">
            Previous
          </span>
        </button>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-5 py-2.5 rounded-md outline-1 -outline-offset-1 outline-neutral-900 flex justify-center items-center gap-3.5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          <span className="text-neutral-900 text-sm font-medium leading-6">
            Next
          </span>
          <ChevronRightIcon className="size-5 text-neutral-900 " />
        </button>
      </div>
    </div>
  );
}
