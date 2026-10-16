import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/** The public address for link previews: SITE_URL if set, else the production domain Vercel gives the build. */
const SITE = (process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://tha-dieu-dusky.vercel.app')).replace(/\/$/, '');

const site: Plugin = {
  name: 'site-url',
  transformIndexHtml: (html) => html.replaceAll('__SITE__', SITE),
};

export default defineConfig({
  plugins: [react(), site],
  server: { proxy: { '/api': 'http://localhost:8787' } },
  build: { outDir: 'dist', sourcemap: false },
  test: { testTimeout: 30000 },
} as never);
