import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { getButtonClasses, type ButtonVariant } from "./buttonStyles";

type LinkButtonProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  icon?: ReactNode;
  fullWidth?: boolean;
};

export function LinkButton({
  variant = "primary",
  fullWidth = true,
  icon,
  className = "",
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={getButtonClasses(variant, fullWidth, className)}
      {...props}
    >
      <span className="text-base font-medium leading-6">{children}</span>
      {icon}
    </Link>
  );
}
