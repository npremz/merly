// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com', // TODO: Remplacer par l'URL du site
  output: 'static',
  server: {
    host: '0.0.0.0',
    port: 5103
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: true,
  compressHTML: true,
  build: {
    inlineStylesheets: 'always',
  },
});
