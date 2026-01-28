import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
    cssCodeSplit: false,
    minify: 'esbuild', // Use esbuild instead (faster)
  },
  esbuild: {
    drop: ['console', 'debugger'], // Remove console and debugger statements
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
})