
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Casting process to any to avoid TypeScript error: Property 'cwd' does not exist on type 'Process'.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    define: {
      // Map VITE_API_KEY to process.env.API_KEY to strictly follow GoogleGenAI guidelines
      // while maintaining Vite's environment variable security model.
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || '')
    }
  };
});
