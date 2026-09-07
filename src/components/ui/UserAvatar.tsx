type UserAvatarProps = {
  email: string;
  size?: "sm" | "lg";
};

export function UserAvatar({ email, size = "lg" }: UserAvatarProps) {
  const initial = email.charAt(0).toUpperCase();
  const sizeClass = size === "lg" ? "size-16 text-2xl" : "size-10 text-base";

  return (
    <div
      className={`${sizeClass} rounded-full bg-neutral-900 hover:bg-primary-500 text-base-white-2 flex items-center justify-center font-semibold shrink-0`}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}
