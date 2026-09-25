import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

// JSON-импорт типизирован по самому файлу, без приведения типа из any
import pkg from './package.json' with { type: 'json' };

export default defineConfig({
  plugins: [react()],
  define: {
    // Версия из package.json попадает в бандл и показывается в шапке layout
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // Порт переопределяется флагом --port (так делает Conductor)
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
});
