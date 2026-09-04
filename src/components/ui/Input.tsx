import { useState, type InputHTMLAttributes } from "react";

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
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="size-6"
          >
            <path
              d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.5 5.3A9.6 9.6 0 0112 5c5 0 8.5 3.5 10 7-.6 1.4-1.5 2.7-2.6 3.8M6.1 6.1C4.2 7.5 2.8 9.5 2 12c1.5 3.5 5 7 10 7 1.1 0 2.1-.2 3.1-.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="size-6"
          >
            <path
              d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="12"
              cy="12"
              r="3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
