"use client";

import { useState } from "react";

type ExpandableDescriptionProps = {
  text: string;
  collapsedChars?: number;
};

export function ExpandableDescription({
  text,
  collapsedChars = 140,
}: ExpandableDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const isTruncatable = text.length > collapsedChars;
  const displayText =
    expanded || !isTruncatable
      ? text
      : `${text.slice(0, collapsedChars).trimEnd()}...`;

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-1">
      <p className="self-stretch text-neutral-900 text-base font-normal leading-6">
        {displayText}
      </p>
      {isTruncatable && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="rounded-md flex justify-center items-center gap-3.5 hover:opacity-80 transition-opacity"
        >
          <span className="text-primary-500 text-base font-medium leading-6">
            {expanded ? "View Less" : "View More"}
          </span>
        </button>
      )}
    </div>
  );
}
