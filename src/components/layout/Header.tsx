"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Logo } from "@/components/ui/Logo";
import { NavLink } from "@/components/ui/NavLink";
import { useCart } from "@/context/CartContext";

function CartIcon() {
  return (
    <svg
      className="size-6 text-neutral-900"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function Nav() {
  const pathname = usePathname();

  return (
    <nav className="self-stretch flex justify-start items-center gap-10">
      <div className="flex justify-start items-start gap-12">
        <NavLink
          href="/"
          activeClassName="text-primary-500 text-base font-semibold font-['Inter'] leading-6"
          inactiveClassName="text-neutral-500 text-base font-medium font-['Inter'] leading-6 hover:text-neutral-900 transition-colors"
        >
          Home
        </NavLink>

        <NavLink
          href="/products"
          activeClassName="text-primary-500 text-base font-semibold font-['Inter'] leading-6"
          inactiveClassName="text-neutral-500 text-base font-medium font-['Inter'] leading-6 hover:text-neutral-900 transition-colors"
        >
          Product
        </NavLink>

        {pathname === "/" && (
          <NavLink
            href="/contact"
            activeClassName="text-primary-500 text-base font-semibold font-['Inter'] leading-6"
            inactiveClassName="text-neutral-500 text-base font-medium font-['Inter'] leading-6 hover:text-neutral-900 transition-colors"
          >
            Contact
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default function Header() {
  const { status } = useSession();
  const { itemCount } = useCart();
  const isAuthenticated = status === "authenticated";

  return (
    <header className="w-full max-w-[1440px] mx-auto px-6 md:px-10 py-6 md:py-8 bg-base-white-2 flex flex-col justify-center items-start gap-6 md:gap-10">
      <div className="self-stretch flex justify-between items-center">
        <Logo />

        <div className="flex justify-end items-center gap-5 md:gap-7">
          {status === "loading" ? (
            <div className="h-10 w-24 bg-neutral-200 animate-pulse rounded-md" />
          ) : isAuthenticated ? (
            <>
              <Link
                href="/cart"
                aria-label="Koszyk"
                className="relative p-2 rounded-full hover:bg-neutral-100 transition-colors"
              >
                <CartIcon />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 bg-primary-500 text-white text-xs font-bold rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>

              <Link
                href="/profile"
                aria-label="Profil użytkownika"
                className="hover:opacity-90 transition-opacity"
              >
                <Image
                  className="size-10 rounded-full border border-neutral-200 object-cover"
                  src="/icons/globe.svg"
                  alt="Avatar użytkownika"
                  width={40}
                  height={40}
                />
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="px-6 py-2.5 bg-primary-500 text-base-white text-base font-medium rounded-lg hover:bg-primary-600 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {isAuthenticated && <Nav />}

      <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.5px] outline-gray-200" />
    </header>
  );
}
