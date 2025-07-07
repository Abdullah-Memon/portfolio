/**
 * Simple in-memory rate limiter for development
 * For production, consider using Redis or another persistent store
 */

const cache = new Map();

const defaultOptions = {
  limit: 100, // number of requests
  window: 900000, // 15 minutes in milliseconds
};

export async function rateLimit(
  identifier,
  options = defaultOptions
) {
  const { limit, window } = { ...defaultOptions, ...options };
  const key = `rate_limit_${identifier}`;
  const now = Date.now();
  
  // Get current data for this identifier
  const current = cache.get(key) || { count: 0, resetTime: now + window };
  
  // Reset if window has expired
  if (now > current.resetTime) {
    current.count = 0;
    current.resetTime = now + window;
  }
  
  // Check if limit exceeded
  if (current.count >= limit) {
    throw new Error('Rate limit exceeded');
  }
  
  // Increment counter
  current.count++;
  cache.set(key, current);
  
  // Clean up expired entries periodically
  if (Math.random() < 0.01) { // 1% chance to clean up
    for (const [k, v] of cache.entries()) {
      if (now > v.resetTime) {
        cache.delete(k);
      }
    }
  }
  
  return {
    count: current.count,
    remaining: limit - current.count,
    resetTime: current.resetTime,
  };
}

export default rateLimit;
