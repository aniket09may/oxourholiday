interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

const globalRateLimit = globalThis as typeof globalThis & {
  oxourRateLimits?: Map<string, RateLimitEntry>;
};

const rateLimits = globalRateLimit.oxourRateLimits ?? new Map<string, RateLimitEntry>();
globalRateLimit.oxourRateLimits = rateLimits;

export function checkRateLimit(key: string, options: RateLimitOptions) {
  const now = Date.now();

  if (rateLimits.size > 1_000) {
    for (const [entryKey, entry] of rateLimits) {
      if (entry.resetAt <= now) rateLimits.delete(entryKey);
    }
  }

  const current = rateLimits.get(key);

  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= options.limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  rateLimits.set(key, current);
  return { allowed: true, retryAfterSeconds: 0 };
}

export function getClientIp(headersList: Headers) {
  const forwardedFor = headersList.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || headersList.get("x-real-ip") || "unknown";
}
