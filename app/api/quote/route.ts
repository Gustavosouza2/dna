import { NextResponse, type NextRequest } from "next/server"

import { quoteSchema, type QuoteInput } from "@/lib/schemas/quote"
import { sendNotificationEmail } from "@/lib/data/email"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { isTrustedOrigin } from "@/lib/security"
import { escapeHtml } from "@/lib/utils"

const TRANSPORT_TYPE_LABEL: Record<QuoteInput["transportType"], string> = {
  air: "Aéreo",
  road: "Rodoviário",
  river: "Fluvial",
}

/**
 * Route Handler as BFF (ADR 0015, replaces the Server Action from ADR
 * 0006): explicit POST endpoint, validated with the same Zod schema
 * used on the client. Thin layer — the business rule (sending via
 * Resend) stays in the DAL (lib/data/email.ts, ADR 0013).
 */
export async function POST(request: NextRequest) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: "Origem não permitida." }, { status: 403 })
  }

  const ip = getClientIp(request.headers)
  const { limited } = checkRateLimit("quote", ip)
  if (limited) {
    return NextResponse.json(
      { error: "Muitas solicitações. Tente novamente em alguns minutos." },
      { status: 429 }
    )
  }

  const body = await request.json().catch(() => null)
  const parsed = quoteSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 })
  }

  const { name, email, phone, origin, destination, transportType, cargoType, weightVolume } =
    parsed.data

  const { success } = await sendNotificationEmail({
    subject: `Novo pedido de orçamento — ${escapeHtml(name)}`,
    replyTo: email,
    html: `
      <h2>Novo pedido de orçamento</h2>
      <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
      <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
      <p><strong>Telefone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Origem:</strong> ${escapeHtml(origin)}</p>
      <p><strong>Destino:</strong> ${escapeHtml(destination)}</p>
      <p><strong>Tipo de transporte:</strong> ${TRANSPORT_TYPE_LABEL[transportType]}</p>
      <p><strong>Tipo de carga:</strong> ${escapeHtml(cargoType)}</p>
      <p><strong>Peso/volume:</strong> ${escapeHtml(weightVolume)}</p>
    `,
  })

  if (!success) {
    return NextResponse.json(
      { error: "Não foi possível enviar sua solicitação. Tente novamente." },
      { status: 502 }
    )
  }

  return NextResponse.json({ success: true })
}
