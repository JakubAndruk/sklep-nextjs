export type CreateOrderPayload =
  | { type: "existing"; addressId: string }
  | {
      type: "new";
      newAddress: {
        name: string;
        street: string;
        city: string;
        province: string;
        postalCode: string;
        country: string;
        setAsDefault?: boolean;
      };
    }
  | {
      withProductProtection: boolean;
    };

function extractErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object" || !("error" in body)) {
    return fallback;
  }

  const error = (body as { error: unknown }).error;

  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }

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

export async function createOrderClient(
  payload: CreateOrderPayload,
): Promise<{ orderId: string }> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<{ orderId: string }>(
    res,
    "Failed to place order. Please try again.",
  );
}
