export function CheckmarkBadge() {
  return (
    <div className="size-20 relative flex items-center justify-center">
      <svg viewBox="0 0 24 24" fill="none" className="size-14 text-success-500">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M8 12.5l2.5 2.5L16 9.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
