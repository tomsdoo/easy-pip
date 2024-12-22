import { defineConfig } from "vitest/config";
import * as path from "path";

export default defineConfig({
  test: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

