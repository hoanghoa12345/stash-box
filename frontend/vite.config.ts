/// <reference types="vitest" />
import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react-swc"
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config https://vitest.dev/config
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  return {
    base: env.VITE_BASE_URL || "",
    plugins: [react(), tsconfigPaths()],
    test: {
      globals: true,
      environment: "happy-dom",
      setupFiles: ".vitest/setup",
      include: ["**/*.spec.{ts,tsx}"]
    }
  }
})
