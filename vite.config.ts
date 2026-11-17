import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The three.js viewer is code-split and lazy-loaded, so its chunk is
// expected to exceed Vite's default 500 kB warning threshold.
const LAZY_VIEWER_CHUNK_WARNING_LIMIT_KB = 1400;

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: LAZY_VIEWER_CHUNK_WARNING_LIMIT_KB,
  },
});
