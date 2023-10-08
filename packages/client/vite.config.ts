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
  // base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
});
