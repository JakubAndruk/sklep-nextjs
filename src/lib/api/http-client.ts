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

async function parseResponse<T>(res: Response, fallback: string): Promise<T> {
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

type ApiFetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  body?: unknown;
  fallbackMessage?: string;
};

export async function apiFetch<T>(
  url: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    fallbackMessage = "Something went wrong. Please try again.",
  } = options;

  const res = await fetch(url, {
    method,
    headers:
      body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  return parseResponse<T>(res, fallbackMessage);
}
