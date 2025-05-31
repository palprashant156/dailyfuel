import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    commonjsOptions: {
      include: [/axios/, /node_modules/]
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
