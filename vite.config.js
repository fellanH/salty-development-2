import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "js/main.js",
      name: "SaltyMap",
      fileName: (format) => `salty-map.${format}.js`,
    },
    outDir: "dist",
  },
  server: {
    cors: true,
  },
});
