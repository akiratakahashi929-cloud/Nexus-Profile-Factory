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
      'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify('2857768732-oraqk6l28cdiur72s8ep97cqmg5fajuh.apps.googleusercontent.com'),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify('AIzaSyAfmohMRf8gckrlSzA-xUWalzLB_Co_e6s'),
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
