import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/vendas_marykay/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    watch: {
      ignored: ['**/server/data/**', '**/db.json', '**/*.json']
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
