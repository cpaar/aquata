import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const api = `http://127.0.0.1:${process.env.API_PORT ?? 3101}`;

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: Number(process.env.WEB_PORT ?? 3102),
    strictPort: true,
    proxy: { '/api': api, '/ws': { target: api.replace('http', 'ws'), ws: true } },
  },
});
