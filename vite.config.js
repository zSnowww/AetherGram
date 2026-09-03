import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Incluimos todos los módulos necesarios para GramJS (criptografía MTProto, streams y buffers)
      include: [
        'buffer',
        'crypto',
        'stream',
        'util',
        'events',
        'process',
        'path',
        'os',
        'fs',
        'net',
        'tls',
        'assert',
        'string_decoder',
        'constants',
      ],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  define: {
    // Evita fallos de dependencias esperando process.env y process.version
    'process.env': {},
    'process.version': JSON.stringify('v18.0.0'),
    'process.versions.node': JSON.stringify('18.0.0'),
  },
  optimizeDeps: {
    include: [
      'telegram',
      'telegram/sessions',
      'qrcode',
      'lucide-react',
      'clsx',
      'tailwind-merge',
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      target: 'esnext',
    },
  },
  build: {
    target: 'esnext',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
