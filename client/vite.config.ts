import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/interpolate': 'http://localhost:8001',
      '/wave': 'http://localhost:8001',
    },
  },
})
