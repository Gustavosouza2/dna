import { NextResponse, type NextRequest } from "next/server"

import { contactSchema } from "@/lib/schemas/contact"
import { sendNotificationEmail } from "@/lib/data/email"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { isTrustedOrigin } from "@/lib/security"
import { escapeHtml } from "@/lib/utils"

/**
 * Route Handler (ADR 0015, replaces the Server Action from ADR
 * 0013). Reuses the same sending DAL (sendNotificationEmail) as the
 * quote endpoint.
 */
export async function POST(request: NextRequest) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: "Origem não permitida." }, { status: 403 })
  }

  const ip = getClientIp(request.headers)
  const { limited } = checkRateLimit("contact", ip)
  if (limited) {
    return NextResponse.json(
      { error: "Muitas solicitações. Tente novamente em alguns minutos." },
      { status: 429 }
    )
  }

  const body = await request.json().catch(() => null)
  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 })
  }

  const { name, email, phone, subject, message } = parsed.data

  const { success } = await sendNotificationEmail({
    subject: subject
      ? `Contato pelo site — ${escapeHtml(subject)}`
      : `Contato pelo site — ${escapeHtml(name)}`,
    replyTo: email,
    html: `
      <h2>Nova mensagem de contato</h2>
      <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
      <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
      ${phone ? `<p><strong>Telefone:</strong> ${escapeHtml(phone)}</p>` : ""}
      ${subject ? `<p><strong>Assunto:</strong> ${escapeHtml(subject)}</p>` : ""}
      <p><strong>Mensagem:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
    `,
  })

  if (!success) {
    return NextResponse.json(
      { error: "Não foi possível enviar sua mensagem. Tente novamente." },
      { status: 502 }
    )
  }

  return NextResponse.json({ success: true })
}
