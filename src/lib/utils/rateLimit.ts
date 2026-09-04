type RateLimitEntry = {
  count: number;
  resetTime: number;
};

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 5;

export function checkRateLimit(key: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetTime) {
    const resetTime = now + WINDOW_MS;
    store.set(key, { count: 1, resetTime });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetTime };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - entry.count,
    resetTime: entry.resetTime,
  };
}

export function resetRateLimit(key: string): void {
  store.delete(key);
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetTime) store.delete(key);
  }
}, WINDOW_MS);
