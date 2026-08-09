import "server-only"

/**
 * In-memory rate limit (ADR 0007) — adequate because the deploy runs
 * as a single Node process on Hostinger, not serverless/multi-instance.
 * If that changes, revisit the ADR (shared store like Redis).
 *
 * Counters are separated per form (ADR 0013): the key includes the
 * form name, so abuse on one doesn't eat into the other's quota.
 */

const WINDOW_MS = 10 * 60 * 1000 // 10 minutos
const MAX_REQUESTS = 3

type Bucket = { count: number; windowStart: number }

const buckets = new Map<string, Bucket>()

export function checkRateLimit(formName: string, ip: string) {
  const key = `${formName}:${ip}`
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now - bucket.windowStart > WINDOW_MS) {
    buckets.set(key, { count: 1, windowStart: now })
    return { limited: false }
  }

  if (bucket.count >= MAX_REQUESTS) {
    return { limited: true }
  }

  bucket.count += 1
  return { limited: false }
}

/** Requester's IP, accounting for Hostinger's proxy in front. */
export function getClientIp(headers: Headers) {
  const forwardedFor = headers.get("x-forwarded-for")
  if (forwardedFor) return forwardedFor.split(",")[0].trim()
  return headers.get("x-real-ip") ?? "unknown"
}
