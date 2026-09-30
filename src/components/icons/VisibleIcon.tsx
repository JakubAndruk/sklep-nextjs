import { IconProps } from "@/types/icons";

export function VisibleIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.5 5.3A9.6 9.6 0 0112 5c5 0 8.5 3.5 10 7-.6 1.4-1.5 2.7-2.6 3.8M6.1 6.1C4.2 7.5 2.8 9.5 2 12c1.5 3.5 5 7 10 7 1.1 0 2.1-.2 3.1-.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
