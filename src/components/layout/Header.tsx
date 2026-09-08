"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Logo } from "@/components/ui/Logo";
import { NavLink } from "@/components/ui/NavLink";
import { useCart } from "@/context/CartContext";
import { CartIcon } from "@/components/icons/CartIcon";
import { UserAvatar } from "../ui/UserAvatar";
import { ErrorCircleIcon } from "../icons/ErrorCircleIcon";

function Nav() {
  const pathname = usePathname();

  return (
    <nav className="self-stretch flex justify-start items-center gap-10">
      <div className="flex justify-start items-start gap-12">
        <NavLink href="/">Home</NavLink>

        <NavLink href="/products">Product</NavLink>

        {pathname === "/" && <NavLink href="/contact">Contact</NavLink>}
      </div>
    </nav>
  );
}

export default function Header() {
  const { status, data: session } = useSession();
  const { itemCount } = useCart();
  const isAuthenticated = status === "authenticated";
  const userEmail = session?.user?.email;

  return (
    <header className="w-full max-w-360 mx-auto px-2 xs:px-10 py-8 bg-base-white-2 flex flex-col justify-center items-start gap-6 md:gap-10">
      <div className="self-stretch flex justify-between items-center">
        <Logo />

        <div className="flex justify-end items-center gap-5 md:gap-7">
          {status === "loading" ? (
            <div className="h-10 w-24 bg-neutral-200 animate-pulse rounded-md" />
          ) : isAuthenticated ? (
            <>
              <Link
                href="/cart"
                aria-label="Cart"
                className="relative p-2 rounded-full hover:bg-primary-500 transition-colors"
              >
                <CartIcon className="size-6 text-neutral-900" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 bg-primary-500 text-white text-xs font-bold rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>

              <Link
                href="/profile"
                aria-label="User profile"
                className="hover:opacity-90 transition-opacity"
              >
                {userEmail ? (
                  <UserAvatar email={userEmail} size="sm" />
                ) : (
                  <ErrorCircleIcon className="size-10 rounded-full border object-cover" />
                )}
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              aria-label="Login"
              className="px-6 py-2.5 bg-primary-500 text-base-white text-base font-medium rounded-lg hover:bg-primary-600 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {isAuthenticated && <Nav />}

      <div className="self-stretch h-0 outline outline-offset-[-0.5px] outline-gray-200" />
    </header>
  );
}
