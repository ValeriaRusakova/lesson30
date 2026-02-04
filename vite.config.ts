import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy timezone requests in development to avoid CORS and rate-limit issues
      '/api/timezone': {
        target: 'https://worldtimeapi.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/timezone/, '/api/timezone'),
      },
    },
  },
})
