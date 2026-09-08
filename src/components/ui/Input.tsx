import { useState, type InputHTMLAttributes } from "react";
import { VisibleIcon } from "../icons/VisibleIcon";
import { NonVisibleIcon } from "../icons/NonVisibleIcon";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full px-4 py-3 bg-base-white rounded-md outline-1 outline-gray-400 text-neutral-900 text-base font-medium placeholder:text-neutral-500 focus:outline-2 focus:outline-primary-500 transition-colors ${className}`}
      {...props}
    />
  );
}

type PasswordInputProps = Omit<InputProps, "type">;

export function PasswordInput({
  className = "",
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative w-full">
      <Input
        type={visible ? "text" : "password"}
        className={`pr-12 ${className}`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        tabIndex={-1}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors"
      >
        {visible ? (
          <VisibleIcon className="size-6" />
        ) : (
          <NonVisibleIcon className="size-6" />
        )}
      </button>
    </div>
  );
}
