import { defineConfig } from 'astro/config';

// Phase 1: deployed at https://grueneat.github.io/werkzeuge/ (project page).
//
// Phase 4 (Custom-Domain werkzeuge.gruene.at):
//   1. DNS-CNAME setzen: werkzeuge.gruene.at -> grueneat.github.io
//   2. site auf 'https://werkzeuge.gruene.at' setzen, base auf '/'
//   3. public/CNAME ist bereits vorbereitet
//   4. In den GitHub-Pages-Settings die Custom-Domain hinterlegen:
//        gh api -X PUT repos/GrueneAT/werkzeuge/pages -f cname=werkzeuge.gruene.at
export default defineConfig({
  site: 'https://grueneat.github.io',
  base: '/werkzeuge/',
  trailingSlash: 'always',
  outDir: './dist',
  build: {
    inlineStylesheets: 'auto',
  },
});
