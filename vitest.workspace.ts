import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    extends: "./vitest.config.ts",
    test: {
      include: ["**/*.browser.test.{ts,js}"],
      name: "browser",
      browser: {
        provider: "playwright",
        enabled: true,
        name: "chromium",
        headless: true,
      },
    },
  },
  {
    extends: "./vitest.config.ts",
    test: {
      include: ["**/*.node.test.{ts,js}"],
      name: "unit",
      environment: "node",
    },
  },
]);


