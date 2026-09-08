export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function formatDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  const datePart = date.toLocaleDateString("en-CA");
  const timePart = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datePart} ${timePart}`;
}
