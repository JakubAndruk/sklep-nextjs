import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getOrdersByUserId } from "@/lib/db/orders";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { TransactionList } from "@/components/profile/TransactionList";

const breadcrumbItems: BreadcrumbItem[] = [
  { label: "Home", href: "/" },
  { label: "Profile" },
];

export default async function ProfilePage() {
  const session = await auth();
  const email = session?.user?.email;
  const userId = session?.user?.id;

  if (!userId || !email) {
    redirect("/login");
  }

  const orders = await getOrdersByUserId(userId);

  return (
    <div className="w-full flex flex-col justify-start items-start gap-2">
      <Breadcrumb items={breadcrumbItems} />

      <div className="self-stretch px-2 xxs:px-4 py-10 flex flex-wrap justify-start items-start gap-12">
        <ProfileSidebar email={email} />

        <div className="flex-1 flex flex-col justify-start items-start gap-8">
          <div className="min-w-72.5 max-w-117.5 flex justify-start items-start">
            <div className="flex-1 flex flex-col justify-center items-center gap-3">
              <span className="text-primary-500 text-lg font-semibold leading-7">
                Transactions
              </span>
              <div className="self-stretch h-0 outline-2 -outline-offset-1 outline-primary-500" />
            </div>
          </div>

          <TransactionList orders={orders} />
        </div>
      </div>
    </div>
  );
}
