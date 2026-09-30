import type { ReactNode } from "react";

type FormFieldProps = {
  id: string;
  label?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export function FormField({
  id,
  label,
  error,
  hint,
  children,
}: FormFieldProps) {
  const describedById = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-4">
      {label && (
        <label
          htmlFor={id}
          className="text-neutral-900 text-lg font-medium leading-7"
        >
          {label}
        </label>
      )}
      <div className="self-stretch flex flex-col justify-start items-start gap-2">
        {children}
        {(error || hint) && (
          <p
            id={describedById}
            role={error ? "alert" : undefined}
            className={`self-stretch text-sm font-normal leading-6 ${
              error ? "text-danger-500" : "text-neutral-600"
            }`}
          >
            {error ?? hint}
          </p>
        )}
      </div>
    </div>
  );
}
