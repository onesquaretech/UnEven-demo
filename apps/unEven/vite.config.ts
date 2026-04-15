import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  resolve: {
    alias: {
      react: fileURLToPath(new URL("./node_modules/react", import.meta.url)),
      "react/jsx-runtime": fileURLToPath(new URL("./node_modules/react/jsx-runtime.js", import.meta.url)),
      "react-dom": fileURLToPath(new URL("./node_modules/react-dom", import.meta.url))
    }
  },
  server: {
    fs: {
      allow: [
        new URL(".", import.meta.url).pathname,
        new URL("../../packages/ui/src", import.meta.url).pathname
      ]
    }
  }
});
