interface RateLimitOptions {
  limit?: number;
  window?: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (in production, use Redis)
const store = new Map<string, RateLimitEntry>();

export async function rateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): Promise<void> {
  const { limit = 100, window = 900000 } = options; // Default: 100 requests per 15 minutes
  
  const now = Date.now();
  const key = `rate_limit:${identifier}`;
  
  const current = store.get(key);
  
  if (!current || now > current.resetTime) {
    // Reset or initialize
    store.set(key, {
      count: 1,
      resetTime: now + window,
    });
    return;
  }
  
  if (current.count >= limit) {
    throw new Error('Rate limit exceeded');
  }
  
  current.count++;
  store.set(key, current);
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetTime) {
      store.delete(key);
    }
  }
}, 300000); // Clean up every 5 minutes

export default rateLimit;
