import "server-only"

/**
 * Origin check (ADR 0015) — Route Handlers don't get, by default, the
 * CSRF verification that Next.js Server Actions do automatically
 * (comparing Origin to Host). Reimplemented here manually so that
 * protection isn't lost in the Server Action -> Route Handler switch.
 */
export function isTrustedOrigin(request: Request) {
  const origin = request.headers.get("origin")
  if (!origin) return false

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host")
  if (!host) return false

  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}
