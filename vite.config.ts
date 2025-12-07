/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom'
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:65501',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
      },
      '/download-proxy': {
        target: 'http://localhost:65501', // Target the Xibo CMS root for file downloads
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/download-proxy/, ''),
      },
    },
    cors: true,
  },
})
