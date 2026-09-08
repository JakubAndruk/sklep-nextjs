import { Logo } from "@/components/ui/Logo";
import { InactiveClassName } from "@/components/ui/NavLink";
import Link from "next/link";
import { PaymentMethodIcon } from "../ui/PaymentMethodIcon";
import { paymentMethods } from "@/lib/constants/paymentMethods";

type FooterLink = {
  label: string;
  href: string;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

const footerSections: FooterSection[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "" },
      { label: "Contact", href: "" },
      { label: "Partner", href: "" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "Instagram", href: "https://www.instagram.com/" },
      { label: "X", href: "https://x.com/" },
      { label: "Facebook", href: "https://www.facebook.com/" },
      { label: "LinkedIn", href: "https://www.linkedin.com/" },
    ],
  },
  {
    title: "FAQ",
    links: [
      { label: "Account", href: "" },
      { label: "Deliveries", href: "" },
      { label: "Orders", href: "" },
      { label: "Payments", href: "" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "E-books", href: "" },
      { label: "Tutorials", href: "" },
      { label: "Course", href: "" },
      { label: "Blog", href: "" },
    ],
  },
];

function isExternalLink(href: string) {
  return href.startsWith("http");
}

function FooterColumn({ title, links }: FooterSection) {
  return (
    <div className="w-48 flex flex-col justify-start items-start gap-8">
      <div className="self-stretch text-neutral-900 text-xl font-semibold leading-8">
        {title}
      </div>
      <div className="self-stretch flex flex-col justify-start items-start gap-4">
        {links.map(({ label, href }) =>
          isExternalLink(href) ? (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={InactiveClassName}
            >
              {label}
            </Link>
          ) : (
            <Link key={label} href={href} className={InactiveClassName}>
              {label}
            </Link>
          ),
        )}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer
      data-screen="Website"
      className="w-full max-w-360 mx-auto px-2 xxs:px-10 xs:px-15 py-35 bg-gray-50 flex flex-wrap justify-between items-start gap-12"
    >
      <div className="flex-1 min-w-70 self-stretch flex flex-col justify-start items-start gap-6">
        <Logo />

        <div className="w-56 text-neutral-600 text-base font-medium font-['Inter'] leading-6">
          © 2026 DevstockHub. <br />
          All rights reserved.
        </div>

        <div className="w-72 flex justify-start items-start gap-3 flex-wrap content-start">
          {paymentMethods.map((method) => (
            <PaymentMethodIcon
              key={method.name}
              name={method.name}
              Icon={method.Icon}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-start items-start gap-8">
        {footerSections.map((section) => (
          <FooterColumn key={section.title} {...section} />
        ))}
      </div>
    </footer>
  );
}
