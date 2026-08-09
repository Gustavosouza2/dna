import { describe, expect, it } from "vitest"

import { quoteSchema } from "./quote"

function omit<T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  const copy: Partial<T> = { ...obj }
  delete copy[key]
  return copy as Omit<T, K>
}

const VALID = {
  name: "Maria Silva",
  email: "maria@example.com",
  phone: "11999999999",
  origin: "São Paulo/SP",
  destination: "Rio de Janeiro/RJ",
  transportType: "air" as const,
  cargoType: "eletrônicos",
  weightVolume: "10kg",
  consent: true as const,
}

describe("quoteSchema", () => {
  it("accepts a valid payload", () => {
    expect(quoteSchema.safeParse(VALID).success).toBe(true)
  })

  it("rejects a name that's too short", () => {
    const result = quoteSchema.safeParse({ ...VALID, name: "A" })
    expect(result.success).toBe(false)
  })

  it("rejects an invalid email", () => {
    const result = quoteSchema.safeParse({ ...VALID, email: "não-é-email" })
    expect(result.success).toBe(false)
  })

  it("rejects a phone that's too short", () => {
    const result = quoteSchema.safeParse({ ...VALID, phone: "123" })
    expect(result.success).toBe(false)
  })

  it("rejects transportType outside the enum", () => {
    const result = quoteSchema.safeParse({ ...VALID, transportType: "trem" })
    expect(result.success).toBe(false)
  })

  it("rejects a missing consent", () => {
    const result = quoteSchema.safeParse(omit(VALID, "consent"))
    expect(result.success).toBe(false)
  })

  it("rejects consent set to false", () => {
    const result = quoteSchema.safeParse({ ...VALID, consent: false })
    expect(result.success).toBe(false)
  })

  it("rejects missing required fields (origin/destination/cargoType/weightVolume)", () => {
    for (const field of ["origin", "destination", "cargoType", "weightVolume"] as const) {
      const result = quoteSchema.safeParse(omit(VALID, field))
      expect(result.success, `expected failure without "${field}"`).toBe(false)
    }
  })
})
