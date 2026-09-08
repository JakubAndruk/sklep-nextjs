import { IconProps } from "@/types/icons";

export function ChevronLeftIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 8 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M7 1L1 8l6 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
