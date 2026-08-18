import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

// `sendMock` is what the real `resend` SDK's `emails.send` would be —
// mocked so no test ever makes a real network call / needs a real API
// key. Declared via vi.hoisted because vi.mock(...) factories are
// hoisted above imports/const declarations.
const { sendMock, ResendMock } = vi.hoisted(() => {
  const sendMock = vi.fn()
  // `new Resend(...)` is invoked with `new`, so the mock implementation
  // must be constructor-shaped (a `function`), not an arrow function.
  const ResendMock = vi.fn().mockImplementation(function (this: unknown, apiKey?: string) {
    return { apiKey, emails: { send: sendMock } }
  })
  return { sendMock, ResendMock }
})

vi.mock("resend", () => ({
  Resend: ResendMock,
}))

const ENV_KEYS = [
  "E2E_TEST_MODE",
  "RESEND_API_KEY",
  "RESEND_SENDING_DOMAIN",
  "RESEND_TO_EMAIL",
] as const

let savedEnv: Record<string, string | undefined>

beforeEach(() => {
  savedEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]))
  for (const key of ENV_KEYS) delete process.env[key]
  // Recipient is mandatory (no hardcoded fallback), so every test that
  // exercises an actual send needs it; the tests that assert the
  // missing-recipient behaviour delete it again explicitly.
  process.env.RESEND_TO_EMAIL = "destino@example.com"
  sendMock.mockReset()
  ResendMock.mockClear()
})

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (savedEnv[key] === undefined) delete process.env[key]
    else process.env[key] = savedEnv[key]
  }
})

/**
 * `FROM_ADDRESS` / `NOTIFICATION_TO_EMAIL` in lib/data/email.ts are
 * computed once at module top level from process.env — so each test
 * that needs different env vars must reset the module registry and
 * re-import fresh.
 */
async function loadEmailModule() {
  vi.resetModules()
  return import("./email")
}

const INPUT = { subject: "Assunto", html: "<p>corpo</p>", replyTo: "cliente@example.com" }

describe("sendNotificationEmail", () => {
  it("returns not_configured and never calls Resend when RESEND_API_KEY is missing", async () => {
    process.env.E2E_TEST_MODE = "false"
    const { sendNotificationEmail } = await loadEmailModule()

    const result = await sendNotificationEmail(INPUT)

    expect(result).toEqual({ success: false, reason: "not_configured" })
    expect(ResendMock).not.toHaveBeenCalled()
    expect(sendMock).not.toHaveBeenCalled()
  })

  it("returns send_failed (not a thrown error) when Resend resolves with { data: null, error }", async () => {
    process.env.E2E_TEST_MODE = "false"
    process.env.RESEND_API_KEY = "re_test_key"
    sendMock.mockResolvedValueOnce({
      data: null,
      error: { name: "validation_error", message: "Invalid `to` field" },
    })
    const { sendNotificationEmail } = await loadEmailModule()

    const result = await sendNotificationEmail(INPUT)

    // Critical case: the Resend SDK does NOT throw on API errors, it
    // resolves — the caller must check `error` explicitly, not rely on
    // try/catch alone.
    expect(result).toEqual({ success: false, reason: "send_failed" })
    // The internal SDK error object must never leak to the caller.
    expect(result).not.toHaveProperty("error")
    expect(JSON.stringify(result)).not.toContain("Invalid `to` field")
  })

  it("catches a thrown exception from Resend and returns send_failed without leaking it", async () => {
    process.env.E2E_TEST_MODE = "false"
    process.env.RESEND_API_KEY = "re_test_key"
    sendMock.mockRejectedValueOnce(new Error("ECONNRESET: secret-internal-detail"))
    const { sendNotificationEmail } = await loadEmailModule()

    await expect(sendNotificationEmail(INPUT)).resolves.toEqual({
      success: false,
      reason: "send_failed",
    })
  })

  it("returns success: true on the happy path", async () => {
    process.env.E2E_TEST_MODE = "false"
    process.env.RESEND_API_KEY = "re_test_key"
    sendMock.mockResolvedValueOnce({ data: { id: "email_123" }, error: null })
    const { sendNotificationEmail } = await loadEmailModule()

    await expect(sendNotificationEmail(INPUT)).resolves.toEqual({ success: true })
    expect(sendMock).toHaveBeenCalledTimes(1)
  })

  it("short-circuits in dry-run mode (E2E_TEST_MODE=true) without touching Resend", async () => {
    process.env.E2E_TEST_MODE = "true"
    // Deliberately no RESEND_API_KEY — dry-run must not require one.
    const { sendNotificationEmail } = await loadEmailModule()

    await expect(sendNotificationEmail(INPUT)).resolves.toEqual({ success: true })
    expect(ResendMock).not.toHaveBeenCalled()
    expect(sendMock).not.toHaveBeenCalled()
  })

  it("ignores dry-run in production and really sends", async () => {
    process.env.E2E_TEST_MODE = "true"
    process.env.RESEND_API_KEY = "re_test_key"
    // A leaked E2E_TEST_MODE in production would make the form report
    // success while no lead ever reached the inbox.
    vi.stubEnv("NODE_ENV", "production")
    sendMock.mockResolvedValueOnce({ data: { id: "email_1" }, error: null })
    const { sendNotificationEmail } = await loadEmailModule()

    try {
      await expect(sendNotificationEmail(INPUT)).resolves.toEqual({ success: true })
      expect(sendMock).toHaveBeenCalledTimes(1)
    } finally {
      vi.unstubAllEnvs()
    }
  })

  it("falls back `from` to onboarding@resend.dev when RESEND_SENDING_DOMAIN is unset", async () => {
    process.env.E2E_TEST_MODE = "false"
    process.env.RESEND_API_KEY = "re_test_key"
    sendMock.mockResolvedValueOnce({ data: { id: "email_1" }, error: null })
    const { sendNotificationEmail } = await loadEmailModule()

    await sendNotificationEmail(INPUT)

    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({ from: "Site Dna Air Cargo <onboarding@resend.dev>" })
    )
  })

  it("uses the configured sending domain in `from` when RESEND_SENDING_DOMAIN is set", async () => {
    process.env.E2E_TEST_MODE = "false"
    process.env.RESEND_API_KEY = "re_test_key"
    process.env.RESEND_SENDING_DOMAIN = "dnaaircargo.com.br"
    sendMock.mockResolvedValueOnce({ data: { id: "email_1" }, error: null })
    const { sendNotificationEmail } = await loadEmailModule()

    await sendNotificationEmail(INPUT)

    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({ from: "Site Dna Air Cargo <site@dnaaircargo.com.br>" })
    )
  })

  it("returns not_configured instead of falling back to a hardcoded inbox when RESEND_TO_EMAIL is unset", async () => {
    process.env.E2E_TEST_MODE = "false"
    process.env.RESEND_API_KEY = "re_test_key"
    delete process.env.RESEND_TO_EMAIL
    const { sendNotificationEmail } = await loadEmailModule()

    // Regression guard: a default recipient would silently route real
    // production leads to a developer's inbox.
    await expect(sendNotificationEmail(INPUT)).resolves.toEqual({
      success: false,
      reason: "not_configured",
    })
    expect(sendMock).not.toHaveBeenCalled()
  })

  it("respects RESEND_TO_EMAIL when set", async () => {
    process.env.E2E_TEST_MODE = "false"
    process.env.RESEND_API_KEY = "re_test_key"
    process.env.RESEND_TO_EMAIL = "vendas@dnaaircargo.com.br"
    sendMock.mockResolvedValueOnce({ data: { id: "email_1" }, error: null })
    const { sendNotificationEmail } = await loadEmailModule()

    await sendNotificationEmail(INPUT)

    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: "vendas@dnaaircargo.com.br" })
    )
  })

  it("passes subject/html/replyTo through untouched", async () => {
    process.env.E2E_TEST_MODE = "false"
    process.env.RESEND_API_KEY = "re_test_key"
    sendMock.mockResolvedValueOnce({ data: { id: "email_1" }, error: null })
    const { sendNotificationEmail } = await loadEmailModule()

    await sendNotificationEmail(INPUT)

    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: INPUT.subject,
        html: INPUT.html,
        replyTo: INPUT.replyTo,
      })
    )
  })
})
