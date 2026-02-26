import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import { resolve, dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: 'preview',
  resolve: {
    alias: [
      // Redirect chrome.storage calls to localStorage mock in preview mode.
      { find: /^@\/shared\/storage$/, replacement: resolve(__dirname, 'preview/storage-mock.ts') },
      { find: '@', replacement: resolve(__dirname, 'src') },
    ],
  },
  server: {
    port: 3000,
  },
})
