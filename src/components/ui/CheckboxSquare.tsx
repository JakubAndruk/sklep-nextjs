type CheckboxSquareProps = {
  checked: boolean;
  onChange: () => void;
  label?: string;
  ariaLabel?: string;
};

export function CheckboxSquare({
  checked,
  onChange,
  label,
  ariaLabel,
}: CheckboxSquareProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      aria-label={ariaLabel ?? label}
      className="flex justify-start items-center gap-4"
    >
      {checked ? (
        <span className="size-6 p-[3px] bg-primary-500 rounded-md flex justify-center items-center shrink-0">
          <svg viewBox="0 0 16 16" fill="none" className="size-4">
            <path
              d="M3 8.5L6.5 12L13 4"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : (
        <span className="size-6 bg-gray-50 rounded-md border border-gray-400 shrink-0" />
      )}
      {label && (
        <span className="text-neutral-900 text-base font-medium leading-6">
          {label}
        </span>
      )}
    </button>
  );
}
