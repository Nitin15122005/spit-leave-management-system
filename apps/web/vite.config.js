import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // ── MUST be first and enforce:'pre' ─────────────────────────────────────
    // Vite's import-analysis plugin runs before normal user plugins and chokes
    // on JSX syntax in .js files. This plugin runs even earlier (pre-enforce)
    // and converts JSX → JS via esbuild before import-analysis ever sees it.
    {
      name: 'treat-js-files-as-jsx',
      enforce: 'pre',
      async transform(code, id) {
        // Only touch .js files inside our src/ tree
        if (!id.match(/\/src\/.*\.js$/) || id.includes('node_modules')) {
          return null;
        }
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic', // React 17+ new JSX transform — no `import React` needed
        });
      },
    },
    react(),
  ],

  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL
          ? process.env.VITE_API_URL.replace('/api', '')
          : 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },

  build: {
    outDir: 'build',
    sourcemap: false,
  },

  // Handle JSX in .js files during dependency pre-bundling too
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
});
