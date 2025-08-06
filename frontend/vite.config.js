// FILE: frontend/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This is the proxy configuration
    proxy: {
      // Any request starting with "/api" will be forwarded
      '/api': {
        // to our backend server running on port 5000
        target: 'http://localhost:5000',
        // Important for virtual hosts
        changeOrigin: true,
      }
    }
  }
})