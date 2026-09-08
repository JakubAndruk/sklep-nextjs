import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ButtonVariant, getButtonClasses } from "@/components/ui/buttonStyles";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  icon?: ReactNode;
  fullWidth?: boolean;
};

export function Button({
  variant = "primary",
  fullWidth = true,
  icon,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={getButtonClasses(variant, fullWidth, className)}
      {...props}
    >
      <span className="text-base font-medium leading-6">{children}</span>
      {icon}
    </button>
  );
}
