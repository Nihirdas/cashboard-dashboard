import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served from a project Pages path: https://<user>.github.io/cashboard-dashboard/
export default defineConfig({
  base: "/cashboard-dashboard/",
  plugins: [react()],
});
