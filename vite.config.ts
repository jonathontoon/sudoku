import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@utilities": resolve(__dirname, "./src/utilities.ts"),
      "@sudoku": resolve(__dirname, "./src/sudoku.ts"),
      "@puzzles": resolve(__dirname, "./puzzles"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, "src/index.ts"),
      },
      external: ["fs", "path"],
      output: {
        entryFileNames: "[name].js",
        format: "es",
      },
    },
  },
}); 