import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "/ilf/frontend/",
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
        target: "https://superfinelabels.in/ilf",
        changeOrigin: true,
        rewrite: (p) => p,
      },
      "/ecomm": {
        target: "https://superfinelabels.in/ilf",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/ecomm/, ""),
      },
      "/ilf/assets": {
        target: "https://superfinelabels.in",
        changeOrigin: true,
      },
      "/ilf/images": {
        target: "https://superfinelabels.in",
        changeOrigin: true,
      },
    },
  },
  build: {
    // CI (Netlify/Vercel): build into local dist/
    // Local: build directly into ../  (= ecomm/frontend/) which is what XAMPP serves
    outDir: process.env.CI ? "dist" : "../",
    emptyOutDir: false, // don't wipe amercereactjs/ source when building into parent
  },
});
