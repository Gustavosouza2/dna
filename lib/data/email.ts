import "server-only"
import { Resend } from "resend"

/**
 * Single place that calls the Resend API (ADR 0013/0015) — reused by
 * both the quote and contact Route Handlers, no duplicated client/
 * error-handling/dry-run logic between them.
 *
 * Dry-run mode (ADR 0011): in tests, logs instead of actually sending,
 * so no automated test fires a real email. Double-check E2E_TEST_MODE
 * is explicitly off in production.
 *
 * Resend client instantiated on demand (not at module top level):
 * `new Resend(undefined)` throws immediately — instantiating it eagerly
 * breaks the module's build/import in any environment without
 * RESEND_API_KEY set (including dry-run, which doesn't even need a
 * real key).
 */
function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY)
}

/**
 * Notification recipient — deliberately its own env var, decoupled
 * from `CONTACT.email` (lib/constants.ts). `CONTACT.email` is the
 * public-facing address shown on the site (footer, /contact,
 * mailto: links); this is where form submissions actually land, which
 * during development/staging is a test inbox, not the public address.
 *
 * No hardcoded fallback on purpose: a default developer address would
 * silently route real production leads to the wrong inbox if the env
 * var were forgotten. Missing var = `not_configured`, which the Route
 * Handlers surface as "temporarily unavailable" plus a server log.
 */
const NOTIFICATION_TO_EMAIL = process.env.RESEND_TO_EMAIL

/**
 * Resend's sandbox mode (no verified sending domain) only allows
 * `onboarding@resend.dev` as the `from` address, and only delivers to
 * the Resend account owner's email. Falling back to it when
 * RESEND_SENDING_DOMAIN isn't set avoids silently sending from
 * `site@undefined`, which the API rejects.
 */
const FROM_ADDRESS = process.env.RESEND_SENDING_DOMAIN
  ? `Site Dna Air Cargo <site@${process.env.RESEND_SENDING_DOMAIN}>`
  : "Site Dna Air Cargo <onboarding@resend.dev>"

export type NotificationEmailInput = {
  subject: string
  html: string
  replyTo?: string
}

export type SendNotificationEmailResult =
  | { success: true }
  | { success: false; reason: "not_configured" | "send_failed" }

export async function sendNotificationEmail({
  subject,
  html,
  replyTo,
}: NotificationEmailInput): Promise<SendNotificationEmailResult> {
  // Dry-run is ignored in production even if E2E_TEST_MODE leaks into
  // the server env: there the form would "succeed" while no lead ever
  // reached the inbox — the worst possible failure for this site.
  if (process.env.E2E_TEST_MODE === "true") {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "sendNotificationEmail: E2E_TEST_MODE=true ignorado em produção — remova a variável do ambiente do servidor."
      )
    } else {
      console.log("[dry-run] sendNotificationEmail:", { subject, html, replyTo })
      return { success: true }
    }
  }

  if (!process.env.RESEND_API_KEY) {
    console.error(
      "sendNotificationEmail: RESEND_API_KEY não configurada. Defina a variável de ambiente (.env.local em dev, painel/ecosystem da Hostinger em produção) com uma chave válida da Resend."
    )
    return { success: false, reason: "not_configured" }
  }

  if (!NOTIFICATION_TO_EMAIL) {
    console.error(
      "sendNotificationEmail: RESEND_TO_EMAIL não configurada. Defina o e-mail que recebe as notificações de contato/orçamento."
    )
    return { success: false, reason: "not_configured" }
  }

  // try/catch around everything, not just the send call: the Resend
  // constructor throws synchronously if RESEND_API_KEY is missing/
  // invalid, and that can't become an unhandled 500 in the Route
  // Handler that calls this function.
  try {
    const { error } = await getResendClient().emails.send({
      from: FROM_ADDRESS,
      to: NOTIFICATION_TO_EMAIL,
      subject,
      html,
      replyTo,
    })

    // The Resend SDK does NOT throw on API errors — it resolves with
    // `{ data: null, error }`. Only checking try/catch here would let
    // failures (invalid domain, rate limit, etc.) pass through as
    // silent "successes".
    if (error) {
      console.error("Falha ao enviar e-mail via Resend:", error)
      return { success: false, reason: "send_failed" }
    }

    return { success: true }
  } catch (err) {
    console.error("Erro inesperado ao enviar e-mail via Resend:", err)
    return { success: false, reason: "send_failed" }
  }
}
