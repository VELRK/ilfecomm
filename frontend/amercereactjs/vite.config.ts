import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "/frontend/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/shopkart-api": {
        target: "http://localhost/deal",
        changeOrigin: true,
        rewrite: (p) => p,
      },
      "/deal": {
        target: "http://localhost",
        changeOrigin: true,
      },
    },
  },
  build: {
    // CI (Netlify/Vercel): build into local dist/
    // Local: build directly into ../  (= deal/frontend/) which is what XAMPP serves
    outDir: process.env.CI ? "dist" : "../",
    emptyOutDir: false, // don't wipe amercereactjs/ source when building into parent
  },
});
