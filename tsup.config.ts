import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  target: "es2022",
  format: ["iife"],
  sourcemap: false,
  clean: true,
  dts: false,
  minify: true,
});
