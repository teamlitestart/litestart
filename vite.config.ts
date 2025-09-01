import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Changed to root for custom domain
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/health': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-${Math.random().toString(36).substr(2, 9)}.js`,
        chunkFileNames: `assets/[name]-${Math.random().toString(36).substr(2, 9)}.js`,
        assetFileNames: `assets/[name]-[hash].[ext]`
      }
    }
  }
});
