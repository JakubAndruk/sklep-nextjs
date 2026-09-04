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
  activeClassName: string;
  inactiveClassName: string;
};

export function NavLink({
  href,
  children,
  activeClassName,
  inactiveClassName,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = isPathActive(pathname, href);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={isActive ? activeClassName : inactiveClassName}
    >
      {children}
    </Link>
  );
}
