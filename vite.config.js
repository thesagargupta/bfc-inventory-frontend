import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // enables LAN access (e.g. from mobile)
    port: 5173, // optional, change if needed
    proxy: {
      '/send-email': {
        target: 'https://bfc-inventory-backend.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
