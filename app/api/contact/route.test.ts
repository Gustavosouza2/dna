import { NextRequest } from "next/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { POST } from "./route"
import { sendNotificationEmail } from "@/lib/data/email"

vi.mock("@/lib/data/email", () => ({
  sendNotificationEmail: vi.fn(),
}))

const sendNotificationEmailMock = vi.mocked(sendNotificationEmail)

// Each test that goes through the rate limiter needs its own IP so it
// doesn't collide with the module-level bucket Map shared across tests
// (see lib/rate-limit.test.ts for the same pattern).
let ipCounter = 0
function freshIp() {
  ipCounter += 1
  return `10.1.0.${ipCounter}`
}

const VALID_BODY = {
  name: "João Souza",
  email: "joao@example.com",
  phone: "",
  subject: "",
  message: "Preciso de mais informações sobre transporte fluvial.",
  consent: true,
}

function makeRequest(
  body: unknown,
  { origin = "https://dnaaircargo.com.br", host = "dnaaircargo.com.br", ip = freshIp() } = {}
) {
  const headers: Record<string, string> = { "content-type": "application/json" }
  if (origin) headers.origin = origin
  if (host) headers.host = host
  if (ip) headers["x-forwarded-for"] = ip

  return new NextRequest("https://dnaaircargo.com.br/api/contact", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  sendNotificationEmailMock.mockReset()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe("POST /api/contact", () => {
  it("rejects requests from an untrusted Origin with 403, without sending email", async () => {
    const request = makeRequest(VALID_BODY, { origin: "https://evil.example.com" })

    const response = await POST(request)

    expect(response.status).toBe(403)
    const json = await response.json()
    expect(json).toEqual({ error: "Origem não permitida." })
    expect(sendNotificationEmailMock).not.toHaveBeenCalled()
  })

  it("rejects a request with no Origin header", async () => {
    const request = makeRequest(VALID_BODY, { origin: "" })

    const response = await POST(request)

    expect(response.status).toBe(403)
    expect(sendNotificationEmailMock).not.toHaveBeenCalled()
  })

  it("rate limits after 3 requests from the same IP", async () => {
    const ip = freshIp()
    sendNotificationEmailMock.mockResolvedValue({ success: true })

    await POST(makeRequest(VALID_BODY, { ip }))
    await POST(makeRequest(VALID_BODY, { ip }))
    await POST(makeRequest(VALID_BODY, { ip }))
    const response = await POST(makeRequest(VALID_BODY, { ip }))

    expect(response.status).toBe(429)
    const json = await response.json()
    expect(json).toEqual({ error: "Muitas solicitações. Tente novamente em alguns minutos." })
  })

  it("returns 400 on an invalid payload and never attempts to send an email", async () => {
    const request = makeRequest({ ...VALID_BODY, email: "não-é-email" })

    const response = await POST(request)

    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json).toEqual({ error: "Dados inválidos." })
    expect(sendNotificationEmailMock).not.toHaveBeenCalled()
  })

  it("returns 400 when consent is false (LGPD)", async () => {
    const request = makeRequest({ ...VALID_BODY, consent: false })

    const response = await POST(request)

    expect(response.status).toBe(400)
    expect(sendNotificationEmailMock).not.toHaveBeenCalled()
  })

  it("returns 200 { success: true } on a valid payload, and forwards the right fields to the DAL", async () => {
    sendNotificationEmailMock.mockResolvedValue({ success: true })
    const request = makeRequest(VALID_BODY)

    const response = await POST(request)

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ success: true })
    expect(sendNotificationEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        replyTo: VALID_BODY.email,
        subject: expect.stringContaining(VALID_BODY.name),
        html: expect.stringContaining(VALID_BODY.name),
      })
    )
  })

  it("escapes HTML in user-supplied fields (XSS in the notification email)", async () => {
    sendNotificationEmailMock.mockResolvedValue({ success: true })
    const request = makeRequest({
      ...VALID_BODY,
      name: '<img src=x onerror="alert(1)">',
    })

    await POST(request)

    const { html } = sendNotificationEmailMock.mock.calls[0][0]
    expect(html).not.toContain("<img src=x onerror=")
  })

  it("returns 502 with an availability message when email is not_configured, without leaking the reason", async () => {
    sendNotificationEmailMock.mockResolvedValue({ success: false, reason: "not_configured" })
    const request = makeRequest(VALID_BODY)

    const response = await POST(request)

    expect(response.status).toBe(502)
    const json = await response.json()
    expect(json).toEqual({
      error:
        "Formulário de contato temporariamente indisponível. Tente novamente mais tarde ou fale conosco pelo telefone/WhatsApp.",
    })
    expect(JSON.stringify(json)).not.toContain("not_configured")
  })

  it("returns 502 with a generic retry message when email send_failed", async () => {
    sendNotificationEmailMock.mockResolvedValue({ success: false, reason: "send_failed" })
    const request = makeRequest(VALID_BODY)

    const response = await POST(request)

    expect(response.status).toBe(502)
    const json = await response.json()
    expect(json).toEqual({ error: "Não foi possível enviar sua mensagem. Tente novamente." })
    expect(JSON.stringify(json)).not.toContain("send_failed")
  })

  it("returns 400 without throwing when the request body isn't valid JSON", async () => {
    const request = new NextRequest("https://dnaaircargo.com.br/api/contact", {
      method: "POST",
      headers: {
        origin: "https://dnaaircargo.com.br",
        host: "dnaaircargo.com.br",
        "x-forwarded-for": freshIp(),
        "content-type": "application/json",
      },
      body: "{ not valid json",
    })

    const response = await POST(request)

    expect(response.status).toBe(400)
  })
})
