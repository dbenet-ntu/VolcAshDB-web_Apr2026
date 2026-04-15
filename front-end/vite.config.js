import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    viteTsconfigPaths, // Directly use vite-tsconfig-paths
  ],
  esbuild: {
    loader: 'jsx', // Ensure JSX is handled in .js files
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    reporters: ['verbose']
  },
  server: {    
    open: true, // Ensures the browser opens upon server start
    port: 5002,  // Sets a default port to 5002
  },
  build: {
    outDir: 'build',
    assetsDir: 'assets',
    emptyOutDir: true, // Clean output directory before build
  },
  preview: {
    host: true, // or '0.0.0.0' to allow external access
    port: 5002,
    allowedHosts: ['volcashdb.ipgp.fr']
  }
});