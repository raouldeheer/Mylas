import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["ts/index.ts", "ts/register.ts", "ts/worker.ts"],
  outDir: "build",
  format: "cjs",
  minify: true,
  splitting: true,
  clean: true,
})