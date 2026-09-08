import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getCartByUserId } from "@/lib/db/cart";
import { getAddressesByUserId } from "@/lib/db/addresses";
import { getPricingConfig } from "@/lib/db/pricing";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { CheckoutPageClient } from "@/components/checkout/CheckoutPageClient";

const breadcrumbItems: BreadcrumbItem[] = [
  { label: "Home", href: "/" },
  { label: "Cart", href: "/cart" },
  { label: "Checkout" },
];

export default async function CheckoutPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const [cart, addresses, pricingConfig] = await Promise.all([
    getCartByUserId(userId),
    getAddressesByUserId(userId),
    getPricingConfig(),
  ]);

  const pricing = {
    shippingPrice: Number(pricingConfig.shippingPrice),
    serviceFee: Number(pricingConfig.serviceFee),
    productProtectionPerUnit: Number(pricingConfig.productProtectionPerUnit),
    shippingInsuranceRate: Number(pricingConfig.shippingInsuranceRate),
  };

  return (
    <div className="w-full flex flex-col justify-start items-start gap-2">
      <Breadcrumb items={breadcrumbItems} />
      <CheckoutPageClient
        items={cart.items}
        addresses={addresses}
        pricing={pricing}
      />
    </div>
  );
}
