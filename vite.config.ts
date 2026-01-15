import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    define: {
      'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(process.env.VITE_GOOGLE_CLIENT_ID || env.VITE_GOOGLE_CLIENT_ID),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(process.env.VITE_GEMINI_API_KEY || env.VITE_GEMINI_API_KEY),
      'import.meta.env.VITE_GOOGLE_CLIENT_SECRET': JSON.stringify(process.env.VITE_GOOGLE_CLIENT_SECRET || env.VITE_GOOGLE_CLIENT_SECRET),
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
