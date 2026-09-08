import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { CartPageClient } from "@/components/cart/CartPageClient";

const breadcrumbItems: BreadcrumbItem[] = [
  { label: "Home", href: "/" },
  { label: "Cart" },
];

export default function Cart() {
  return (
    <div className="w-full flex flex-col justify-start items-start gap-2">
      <Breadcrumb items={breadcrumbItems} />
      <CartPageClient />
    </div>
  );
}
