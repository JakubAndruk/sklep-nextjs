"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
};

export function Select({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = "Select",
  className = "",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((option) => option.value === value);

  return (
    <div ref={containerRef} className="relative w-full">
      <input type="hidden" name={name} value={value} />
      <button
        id={id}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`w-full px-4 py-3.5 bg-base-white rounded-md outline-1 outline-gray-400 flex justify-between items-center text-base font-normal transition-colors ${
          selected ? "text-neutral-900" : "text-neutral-500"
        } ${className}`}
      >
        <span className="truncate">
          {selected ? selected.label : placeholder}
        </span>
        <Image
          src="/icons/chevron-down.svg"
          alt=""
          width={24}
          height={24}
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-10 top-full left-0 mt-1 w-full max-h-60 overflow-y-auto bg-base-white rounded-md outline-1 outline-gray-200 shadow-md"
        >
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
            >
              <button
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-base hover:bg-gray-50 transition-colors ${
                  option.value === value
                    ? "text-primary-500 font-medium"
                    : "text-neutral-900 font-normal"
                }`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
