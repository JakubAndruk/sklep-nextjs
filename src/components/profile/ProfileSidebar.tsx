"use client";

import { useCallback, useState } from "react";
import { signOut } from "next-auth/react";
import { UserAvatar } from "@/components/ui/UserAvatar";

type ProfileSidebarProps = {
  email: string;
};

function getDisplayName(email: string) {
  return email.split("@")[0];
}

export function ProfileSidebar({ email }: ProfileSidebarProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleLogout = useCallback(async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    await signOut({ callbackUrl: "/login" });
  }, [isSigningOut]);

  return (
    <div className="min-w-70 max-w-80 p-6 bg-base-white rounded-md outline-1 outline-offset-[-1px] outline-gray-200 flex flex-col justify-center items-start gap-6 shrink-0">
      <div className="self-stretch flex justify-start items-center gap-6">
        <UserAvatar email={email} size="lg" />
        <div className="flex-1 flex flex-col justify-center items-start gap-1">
          <div className="self-stretch text-neutral-900 text-base font-medium leading-6">
            {getDisplayName(email)}
          </div>
          <div className="self-stretch text-neutral-600 text-sm font-normal leading-6">
            {email}
          </div>
        </div>
      </div>

      <div className="self-stretch h-0 outline-1 outline-offset-[-0.5px] outline-gray-200" />

      <button
        type="button"
        onClick={handleLogout}
        disabled={isSigningOut}
        className="self-stretch text-left text-neutral-600 text-base font-medium leading-6 hover:text-neutral-900 transition-colors disabled:opacity-50"
      >
        {isSigningOut ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}
