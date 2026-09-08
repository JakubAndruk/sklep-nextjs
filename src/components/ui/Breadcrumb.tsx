import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import { ChevronDownIcon } from "../icons/ChevronDownIcon";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="w-full px-10 py-2.5 flex justify-start items-center gap-2"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span
            key={`${item.label}-${index}`}
            className="flex items-center gap-2"
          >
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-neutral-500 text-base font-medium leading-6 hover:text-neutral-900 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className={`text-base leading-6 ${
                  isLast
                    ? "text-neutral-900 font-medium"
                    : "text-neutral-500 font-medium"
                }`}
              >
                {item.label}
              </span>
            )}
            {!isLast && (
              <ChevronDownIcon className="size-4 text-neutral-500 rotate-270" />
            )}
          </span>
        );
      })}
    </nav>
  );
}
