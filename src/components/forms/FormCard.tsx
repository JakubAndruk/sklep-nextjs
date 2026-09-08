import type { ReactNode } from "react";

type FormCardProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function FormCard({ title, children, className = "" }: FormCardProps) {
  return (
    <div
      className={`bg-base-white rounded-md outline-1 outline-gray-200 flex flex-col justify-start items-start gap-8 ${className}`}
    >
      <div className="self-stretch flex flex-col justify-start items-start gap-5">
        <div className="self-stretch text-neutral-900 text-2xl font-medium leading-9">
          {title}
        </div>
        <div className="self-stretch h-0 outline-1 outline-offset-[-0.5px] outline-gray-200" />
      </div>
      {children}
    </div>
  );
}
