import { ApproveIcon } from "../icons/ApproveIcon";

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
        <span className="size-6 p-0.75 bg-primary-500 rounded-md flex justify-center items-center shrink-0">
          <ApproveIcon className="size-4 text-base-white-2" />
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
