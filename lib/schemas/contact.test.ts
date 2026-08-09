import { describe, expect, it } from "vitest"

import { contactSchema } from "./contact"

function omit<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  const copy: Partial<T> = { ...obj }
  for (const key of keys) delete copy[key]
  return copy as Omit<T, K>
}

const VALID = {
  name: "João Souza",
  email: "joao@example.com",
  phone: "",
  subject: "",
  message: "Preciso de mais informações sobre transporte fluvial.",
  consent: true as const,
}

describe("contactSchema", () => {
  it("accepts a valid payload with empty phone/subject (optional)", () => {
    expect(contactSchema.safeParse(VALID).success).toBe(true)
  })

  it("accepts phone/subject missing from the payload", () => {
    expect(contactSchema.safeParse(omit(VALID, "phone", "subject")).success).toBe(true)
  })

  it("rejects a name that's too short", () => {
    expect(contactSchema.safeParse({ ...VALID, name: "A" }).success).toBe(false)
  })

  it("rejects an invalid email", () => {
    expect(contactSchema.safeParse({ ...VALID, email: "não-é-email" }).success).toBe(false)
  })

  it("rejects a message that's too short", () => {
    expect(contactSchema.safeParse({ ...VALID, message: "oi" }).success).toBe(false)
  })

  it("rejects a missing consent", () => {
    expect(contactSchema.safeParse(omit(VALID, "consent")).success).toBe(false)
  })

  it("rejects consent set to false", () => {
    expect(contactSchema.safeParse({ ...VALID, consent: false }).success).toBe(false)
  })
})
