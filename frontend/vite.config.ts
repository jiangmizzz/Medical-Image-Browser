import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import watchFolderPlugin from "./vite-plugin-watch-folder";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    watchFolderPlugin("path/to/watched-folder"), // TODO:替换为你要监听的文件夹路径
  ],
});
