import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Load environment variables
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    define: {
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'http://localhost:5000')
    }
  }
})