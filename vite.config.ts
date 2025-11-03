import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use base path for GitHub Pages only
  // Set VITE_DEPLOY_TARGET=netlify for Netlify deployments
  base: process.env.VITE_DEPLOY_TARGET === 'netlify' ? '/' : (process.env.NODE_ENV === 'production' ? '/mithuug-website/' : '/'),
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
