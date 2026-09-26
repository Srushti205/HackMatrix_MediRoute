import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Seamlessly load env from both frontend/.env and root workspace .env
  const rootEnv = loadEnv(mode, path.resolve(__dirname, '..'), '');
  const localEnv = loadEnv(mode, __dirname, '');
  const apiKey = localEnv.VITE_GOOGLE_MAPS_API_KEY || rootEnv.VITE_GOOGLE_MAPS_API_KEY;

  return {
    plugins: [react()],
    define: apiKey
      ? {
          'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(apiKey),
        }
      : {},
    server: {
      port: 3000,
      open: false,
    },
  };
});

