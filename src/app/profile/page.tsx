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

      <div className="self-stretch p-10 flex justify-start items-start gap-12">
        <ProfileSidebar email={email} />

        <div className="flex-1 flex flex-col justify-start items-start gap-8">
          <div className="w-full max-w-[470px] flex justify-start items-start">
            <div className="flex-1 flex flex-col justify-center items-center gap-3">
              <span className="text-primary-500 text-lg font-semibold leading-7">
                Transaction
              </span>
              <div className="self-stretch h-0 outline-2 outline-offset-[-1px] outline-primary-500" />
            </div>
          </div>

          <TransactionList orders={orders} />
        </div>
      </div>
    </div>
  );
}
