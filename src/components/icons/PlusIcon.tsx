import { IconProps } from "@/types/icons";

export function PlusIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 0v16M0 8h16" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
