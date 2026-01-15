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
      // ↓↓↓ Google Cloud で発行した クライアントID をここに貼り付けてください ↓↓↓
      'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify('YOUR_CLIENT_ID_HERE'),
      // Gemini API Key
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify('AIzaSyAfmohMRf8gckrlSzA-xUWalzLB_Co_e6s'),
      // Google Client Secret (本来はバックエンドで管理すべきですが、現状維持)
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
