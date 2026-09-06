import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    // Proxy /api/* requests to the Express backend during dev.
    // This avoids CORS issues — the browser sees everything on port 5173.
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        // If the backend is down, log a warning instead of crashing the dev server.
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.warn('[vite proxy] Backend unreachable — API calls will fail.', err.message);
          });
        },
      },
    },
  },
})
