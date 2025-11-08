import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/department_game/',
  plugins: [react(), viteSingleFile()],
  build: {
    minify: true,
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    inlineDynamicImports: true,
    outDir: 'dist',
    sourcemap: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
