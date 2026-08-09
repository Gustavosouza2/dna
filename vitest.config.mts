import { fileURLToPath } from "node:url"

import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  resolve: {
    alias: {
      // "server-only" throws unconditionally outside Next's webpack
      // build (its "react-server" export condition isn't active under
      // Vitest/Node). Its own no-op ("./empty.js") isn't a declared
      // export subpath, so Vite's exports-map resolution rejects a
      // deep import of it — aliased to a local stub instead so modules
      // that import "server-only" (lib/rate-limit.ts, lib/data/email.ts)
      // are testable without pulling in the whole Next runtime.
      "server-only": fileURLToPath(new URL("./test/mocks/server-only.ts", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    exclude: ["node_modules/**", "tests/**"],
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
})
