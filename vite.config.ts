import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import AutoImport from "unplugin-auto-import/vite";
 
const base = process.env.BASE_PATH || "/";
const isPreview = process.env.IS_PREVIEW ? true : false;
 
export default defineConfig({
  define: {
    __BASE_PATH__: JSON.stringify(base),
    __IS_PREVIEW__: JSON.stringify(isPreview),
  },
  plugins: [
    react(),
    AutoImport({ imports: [{ react: ["useState", "useEffect"] }, { "react-router-dom": ["useNavigate"] }], dts: true }),
  ],
  base,
  resolve: { alias: { "@": resolve(__dirname, "./src") } },
  server: { port: 3000, host: "0.0.0.0" },
});