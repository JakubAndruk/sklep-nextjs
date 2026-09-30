import { IconProps } from "@/types/icons";

export function MinusIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 2"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path d="M0 1h16" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
