type Entry = { count: number; reset: number };

declare global {
  var __rateLimitStore: Map<string, Entry> | undefined;
}

const store = global.__rateLimitStore ?? new Map<string, Entry>();
if (process.env.NODE_ENV !== "production") global.__rateLimitStore = store;

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.reset) {
    store.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1, reset: now + windowMs };
  }

  if (entry.count >= limit) {
    return { ok: false, remaining: 0, reset: entry.reset };
  }

  entry.count += 1;
  return { ok: true, remaining: limit - entry.count, reset: entry.reset };
}
