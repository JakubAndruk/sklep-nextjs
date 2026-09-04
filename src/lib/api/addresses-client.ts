export type Address = {
  id: string;
  name: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export type NewAddressPayload = {
  name: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  setAsDefault?: boolean;
};

function extractErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object" || !("error" in body)) return fallback;
  const error = (body as { error: unknown }).error;

  if (typeof error === "string" && error.trim().length > 0) return error;

  if (error && typeof error === "object" && !Array.isArray(error)) {
    const fieldErrors = error as Record<string, unknown>;
    const firstMessages = Object.values(fieldErrors).find(
      (value): value is string[] =>
        Array.isArray(value) &&
        value.length > 0 &&
        typeof value[0] === "string",
    );
    if (firstMessages) return firstMessages[0];
  }

  return fallback;
}

async function handleResponse<T>(res: Response, fallback: string): Promise<T> {
  let body: unknown;
  try {
    body = await res.json();
  } catch {
    throw new Error(fallback);
  }

  const isSuccessFlagTrue =
    typeof body === "object" &&
    body !== null &&
    "success" in body &&
    (body as { success: unknown }).success === true;

  if (!res.ok || !isSuccessFlagTrue) {
    throw new Error(extractErrorMessage(body, fallback));
  }

  return (body as { data: T }).data;
}

export async function createAddress(
  payload: NewAddressPayload,
): Promise<Address> {
  const res = await fetch("/api/addresses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Address>(
    res,
    "Failed to save address. Please try again.",
  );
}
