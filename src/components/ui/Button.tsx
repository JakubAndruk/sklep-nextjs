import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary-500 text-base-white hover:opacity-90",
  secondary:
    "bg-white text-neutral-900 outline outline-1 outline-gray-200 hover:bg-gray-50",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`w-full px-4 py-3 rounded-md text-base font-semibold transition-colors ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
