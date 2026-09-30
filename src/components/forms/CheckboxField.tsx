import type { InputHTMLAttributes, ReactNode } from "react";
import { ApproveIcon } from "../icons/ApproveIcon";

type CheckboxFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode;
  error?: string;
  wrapperClassName?: string;
};

export function CheckboxField({
  label,
  error,
  className = "",
  wrapperClassName = "",
  ...props
}: CheckboxFieldProps) {
  return (
    <div
      className={`self-stretch flex flex-col justify-start items-start gap-2 ${wrapperClassName}`}
    >
      <label
        className={`flex justify-start items-center gap-4 cursor-pointer ${className}`}
      >
        <span className="relative inline-flex shrink-0">
          <input
            type="checkbox"
            aria-invalid={!!error}
            className="peer size-6 appearance-none rounded-md border-2 border-gray-300 bg-white checked:bg-primary-500 checked:border-primary-500 cursor-pointer transition-colors"
            {...props}
          />
          <ApproveIcon className="absolute inset-0 m-auto size-4 text-base-white-2 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
        </span>
        <span className="flex-1 text-neutral-600 text-base font-normal">
          {label}
        </span>
      </label>
      {error && (
        <p
          role="alert"
          className="self-stretch text-danger-500 text-sm font-normal leading-6"
        >
          {error}
        </p>
      )}
    </div>
  );
}
