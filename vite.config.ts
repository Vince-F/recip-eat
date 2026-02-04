import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      injectRegister: "auto",
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,woff,woff2,svg}"],
      },
      manifest: {
        name: "Recip'eat",
        short_name: "Recip'eat",
        description: "A recipe management application",
        display: "standalone",
        start_url: "https://vince-f.github.io/recip-eat/",
        theme_color: "#ffffff" /* TODO: Update theme color */,
        icons: [
          {
            src: "./logos/512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "./logos/192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "./logos/512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "./logos/512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "./screenshots/desktop.png",
            sizes: "1520x955",
            type: "image/png",
            form_factor: "wide",
            label: "Home screen showing receipes (desktop view)",
          },
          {
            src: "./screenshots/mobile.png",
            sizes: "400x871",
            type: "image/png",
            label: "Home screen showing receipes (mobile view)",
          },
        ],
      },
    }),
  ],
  base: "./",
  server: {
    host: true,
    open: "/recip-eat/",
  },
});
