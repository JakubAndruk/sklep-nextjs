"use client";

import type { ReactNode } from "react";

import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import { useOverflowCheck } from "@/hooks/useOverflowCheck";

type RevealRowProps = {
  children: ReactNode;
  name: string;
};

export function RevealRow({ children, name }: RevealRowProps) {
  const { ref, hasOverflow, atStart, atEnd, scrollByStep } =
    useOverflowCheck<HTMLDivElement>();

  return (
    <div className="self-stretch flex flex-col justify-start items-start min-w-0 gap-8 ">
      <div className="self-stretch flex justify-between">
        <div className="text-neutral-900 text-3xl font-medium leading-10">
          {name}
        </div>
        {hasOverflow && (
          <div className="self-end flex justify-center items-center gap-3.5">
            <button
              type="button"
              onClick={() => scrollByStep("prev")}
              disabled={atStart}
              aria-label="Show previous"
              className="rounded-md flex justify-center items-center gap-3.5 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-80 transition-opacity"
            >
              <ChevronRightIcon className="size-4 text-primary-500 rotate-180" />
            </button>

            <button
              type="button"
              onClick={() => scrollByStep("next")}
              disabled={atEnd}
              aria-label="See all"
              className="rounded-md flex justify-center items-center gap-3.5 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-80 transition-opacity"
            >
              <span className="text-primary-500 text-base font-medium leading-6">
                See All
              </span>
              <ChevronRightIcon className="size-4 text-primary-500" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={ref}
        className="self-stretch flex flex-nowrap justify-start items-start gap-8 overflow-x-auto pb-2 -mx-10 px-10 min-w-0 scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </div>
  );
}
