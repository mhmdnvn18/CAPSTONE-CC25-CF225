import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname
    }
  },
  base: '', // ensure relative paths for assets
  publicDir: 'public', // ensure public assets are served
  server: {
    port: 3000
  }
})
