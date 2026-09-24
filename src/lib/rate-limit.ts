/**
 * In-memory fixed-window rate limiter. Deliberately simple: no Redis
 * dependency, suitable for a single-region low-to-moderate-traffic
 * deployment. It resets on every cold start and doesn't share state across
 * serverless instances, so it's a soft speed bump against casual abuse
 * (webhook floods, credential-stuffing on auth routes) — not a hard
 * guarantee under multi-instance production load. Swap for Upstash Redis's
 * `@upstash/ratelimit` if traffic grows enough that that gap matters.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  return bucket.count > limit;
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}
