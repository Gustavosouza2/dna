import "@testing-library/jest-dom/vitest"

// jsdom doesn't implement IntersectionObserver — global no-op stub so
// any component that renders <Reveal> (motion/reveal.tsx, framer-motion's
// whileInView uses it internally) doesn't crash in tests that aren't
// testing the scroll-reveal itself. Tests that need to simulate the
// observer firing override this locally with vi.stubGlobal.
class NoopIntersectionObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
}
// @ts-expect-error -- simplified stub, doesn't implement the full interface
globalThis.IntersectionObserver = NoopIntersectionObserver
