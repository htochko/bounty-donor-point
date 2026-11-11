import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  base: '/bounty-donor-point/',
  publicDir: 'public',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});