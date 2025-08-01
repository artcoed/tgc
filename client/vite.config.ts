import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from '@svgr/rollup';

export default defineConfig({
  server: {
    allowedHosts: ['e05d92661de9d3.lhr.life'],
  },
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@server': path.resolve(__dirname, '../server/src'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase', // Ensures class names match (e.g., navElement)
      generateScopedName: '[name]__[local]__[hash:base64:5]', // Scoped naming
    },
  },
});