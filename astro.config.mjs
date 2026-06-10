import { defineConfig } from 'astro/config';

// Deployed at the custom domain https://werkzeuge.gruene.at via GitHub Pages
// (DNS CNAME werkzeuge.gruene.at -> grueneat.github.io). The custom domain is
// bound through public/CNAME (served at the dist root) plus the Pages-Settings
// custom-domain entry.
export default defineConfig({
  site: 'https://werkzeuge.gruene.at',
  base: '/',
  trailingSlash: 'always',
  outDir: './dist',
  build: {
    inlineStylesheets: 'auto',
  },
});
