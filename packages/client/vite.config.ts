import { defineConfig } from "vite";
import path from 'path';

export default defineConfig({
  server: {
    port: 3000,
    fs: {
      strict: false,
    },
  },
  build: {
    target: "es2022",
    minify: true,
    sourcemap: true,
  },
  alias: {
    '@/avatar': path.resolve(__dirname, './src/assets/avatar'),
    '@/': path.resolve(__dirname, './src'),
    '~': path.resolve(__dirname, './src'),
  },
});
