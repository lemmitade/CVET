// Lightweight in-memory sliding window rate limiter
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up old entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      record.timestamps = record.timestamps.filter(t => now - t < 300000);
      if (record.timestamps.length === 0) {
        rateLimitMap.delete(key);
      }
    }
  }, 300000);
}

export function checkRateLimit(
  identifier: string,
  limit: number = 20,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; retryAfterSec?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier) || { timestamps: [] };

  // Filter timestamps within window
  record.timestamps = record.timestamps.filter(t => now - t < windowMs);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const retryAfterSec = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: retryAfterSec > 0 ? retryAfterSec : 1,
    };
  }

  record.timestamps.push(now);
  rateLimitMap.set(identifier, record);

  return {
    allowed: true,
    remaining: limit - record.timestamps.length,
  };
}
