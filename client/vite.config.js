// client/vite.config.js
// Configuración de Vite: plugin de React + proxy al backend de FastAPI.
// Durante desarrollo, las peticiones a /api/* se redirigen a localhost:8000.

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    jsxRuntime: 'automatic',
  })],
  server: {
    proxy: {
      '/api': 'http://localhost:8001',
    },
  },
})
