import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      // Directs Node/Express requests
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // Directs Python/FastAPI requests, rewriting /api/py to /api
      '/api/py': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/py/, '/api'),
      }
    }
  }
})
