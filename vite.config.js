import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  base: '', // ensure relative paths for assets
  publicDir: 'public', // ensure public assets are served
  server: {
    port: 3000
  }
})
