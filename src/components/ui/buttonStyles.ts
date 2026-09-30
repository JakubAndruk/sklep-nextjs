export type ButtonVariant = "primary" | "outline";

export const buttonBaseClasses =
  "self-stretch px-5 py-3.5 rounded-md flex justify-center items-center gap-3.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

export const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary-500 text-base-white hover:opacity-90",
  outline:
    "outline outline-1 outline-offset-[-1px] outline-primary-500 text-primary-500 hover:bg-primary-50",
};

export function getButtonClasses(
  variant: ButtonVariant,
  fullWidth: boolean,
  className = "",
) {
  const layout = fullWidth ? "self-stretch flex" : "inline-flex";

  return `${layout} px-5 py-3.5 rounded-md justify-center items-center gap-3.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${buttonVariantClasses[variant]} ${className}`;
}
