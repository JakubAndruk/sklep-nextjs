import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { getOrderById } from "@/lib/db/orders";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { OrderSummaryCard } from "@/components/orders/OrderSummaryCard";

type OrderConfirmationPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const { id } = await params;
  const order = await getOrderById(userId, id);

  if (!order) {
    notFound();
  }

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Cart", href: "/cart" },
    { label: "Order Confirmation" },
  ];

  return (
    <div className="w-full flex flex-col justify-start items-center gap-2">
      <Breadcrumb items={breadcrumbItems} />
      <div className="w-full flex justify-center items-start p-10">
        <OrderSummaryCard order={order} />
      </div>
    </div>
  );
}
