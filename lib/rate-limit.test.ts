import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { checkRateLimit } from "./rate-limit"

// Each test uses its own IP so it doesn't collide with the module-level
// buckets Map (module state, not reset between tests).
let ipCounter = 0
function freshIp() {
  ipCounter += 1
  return `10.0.0.${ipCounter}`
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe("checkRateLimit", () => {
  it("doesn't block the first 3 requests in the window", () => {
    const ip = freshIp()
    expect(checkRateLimit("quote", ip).limited).toBe(false)
    expect(checkRateLimit("quote", ip).limited).toBe(false)
    expect(checkRateLimit("quote", ip).limited).toBe(false)
  })

  it("blocks starting from the 4th request in the same window", () => {
    const ip = freshIp()
    checkRateLimit("quote", ip)
    checkRateLimit("quote", ip)
    checkRateLimit("quote", ip)
    expect(checkRateLimit("quote", ip).limited).toBe(true)
  })

  it("counters for different forms don't share a quota", () => {
    const ip = freshIp()
    checkRateLimit("quote", ip)
    checkRateLimit("quote", ip)
    checkRateLimit("quote", ip)
    expect(checkRateLimit("quote", ip).limited).toBe(true)
    // same IP, different form: should not be blocked
    expect(checkRateLimit("contact", ip).limited).toBe(false)
  })

  it("resets the counter once the window expires", () => {
    const ip = freshIp()
    checkRateLimit("quote", ip)
    checkRateLimit("quote", ip)
    checkRateLimit("quote", ip)
    expect(checkRateLimit("quote", ip).limited).toBe(true)

    vi.advanceTimersByTime(10 * 60 * 1000 + 1)

    expect(checkRateLimit("quote", ip).limited).toBe(false)
  })
})
