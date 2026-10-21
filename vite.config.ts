import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins:[react()],
  base:'./',
  resolve:{dedupe:['react','react-dom','three']},
  build:{chunkSizeWarningLimit:800,rollupOptions:{output:{manualChunks:{
    'three-engine':['three'],
    'motion':['framer-motion'],
    'three-viewer':['@react-three/fiber','@react-three/drei'],
  }}}},
});
