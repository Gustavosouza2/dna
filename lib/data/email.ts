import "server-only"
import { Resend } from "resend"

import { CONTACT } from "@/lib/constants"

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

export type NotificationEmailInput = {
  subject: string
  html: string
  replyTo?: string
}

export async function sendNotificationEmail({
  subject,
  html,
  replyTo,
}: NotificationEmailInput) {
  if (process.env.E2E_TEST_MODE === "true") {
    console.log("[dry-run] sendNotificationEmail:", { subject, html, replyTo })
    return { success: true as const }
  }

  // try/catch around everything, not just the send call: the Resend
  // constructor throws synchronously if RESEND_API_KEY is missing/
  // invalid, and that can't become an unhandled 500 in the Route
  // Handler that calls this function.
  try {
    const { error } = await getResendClient().emails.send({
      from: `Site Dna Air Cargo <site@${process.env.RESEND_SENDING_DOMAIN}>`,
      to: CONTACT.email,
      subject,
      html,
      replyTo,
    })

    if (error) {
      console.error("Falha ao enviar e-mail via Resend:", error)
      return { success: false as const }
    }

    return { success: true as const }
  } catch (err) {
    console.error("Erro inesperado ao enviar e-mail via Resend:", err)
    return { success: false as const }
  }
}
