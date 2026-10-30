import { defineConfig } from "vite";

// Relative asset paths so the build works under https://<user>.github.io/<repo>/
export default defineConfig({
  base: "./",
});
