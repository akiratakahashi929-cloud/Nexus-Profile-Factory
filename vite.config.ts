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
      // Google Cloud で発行した クライアントID
      'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify('2857768732-0211p2kcio5mscjk8aho6i0qrb6l033c.apps.googleusercontent.com'),
      // ↓↓↓ Gemini API Key をここに貼り付けてください ↓↓↓
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify('YOUR_GEMINI_API_KEY_HERE'),
      // Google Client Secret
      'import.meta.env.VITE_GOOGLE_CLIENT_SECRET': JSON.stringify('GOCSPX-HdaZnc1xkcVQpAHEH52v--aWkoV'),
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
