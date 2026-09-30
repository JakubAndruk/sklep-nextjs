"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function isPathActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

type NavLinkProps = {
  href: string;
  children: ReactNode;
};
export const ActiveClassName =
  "text-primary-500 text-base font-semibold font-['Inter'] leading-6";
export const InactiveClassName =
  "text-neutral-500 text-base font-medium font-['Inter'] leading-6 hover:text-primary-500 transition-colors";

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = isPathActive(pathname, href);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={isActive ? ActiveClassName : InactiveClassName}
    >
      {children}
    </Link>
  );
}
