import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use base path for GitHub Pages only, not for Netlify
  // Netlify sets NETLIFY environment variable during builds
  base: process.env.NETLIFY ? '/' : (process.env.NODE_ENV === 'production' ? '/mithuug-website/' : '/'),
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
