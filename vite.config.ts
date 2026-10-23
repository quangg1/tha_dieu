import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/** The public address for link previews: SITE_URL if set, else the production domain Vercel gives the build. */
const SITE = (process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://bilion-vn.vercel.app')).replace(/\/$/, '');

const site: Plugin = {
  name: 'site-url',
  transformIndexHtml: (html) => html.replaceAll('__SITE__', SITE),
};

/** Starts the four fonts every first screen needs while the script still downloads, instead of after it runs. */
const preloadFonts: Plugin = {
  name: 'preload-fonts',
  transformIndexHtml: {
    order: 'post',
    handler(_html, ctx) {
      if (!ctx.bundle) return [];
      const want = /(be-vietnam-pro-(latin|vietnamese)-400|grandstander-(latin|vietnamese)-800)-normal-[^/]*\.woff2$/;
      return Object.keys(ctx.bundle)
        .filter((f) => want.test(f))
        .map((f) => ({ tag: 'link', attrs: { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: '', href: '/' + f }, injectTo: 'head' as const }));
    },
  },
};

export default defineConfig({
  plugins: [react(), site, preloadFonts],
  server: { proxy: { '/api': 'http://localhost:8787' } },
  build: { outDir: 'dist', sourcemap: false },
  test: { testTimeout: 30000 },
} as never);
