# CLAUDE.md — Werkzeuge

Werkzeug-Verzeichnis fuer Gruene-AT-Gemeindegruppen.

## Was das ist

- Statische Astro-Site, eine Karte pro digitalem Werkzeug (eigene Tools +
  kuratierte Dritt-Tools)
- Live: https://grueneat.github.io/werkzeuge/ (Phase 1)
- Spaeter: https://werkzeuge.gruene.at/ (Phase 4, sobald DNS gesetzt)

## Stack

- **Astro 5** mit Content Collections (Zod-Schema in `src/content.config.ts`)
- **DS v2.2** als externer Stylesheet von `https://grueneat.github.io/design-system/design-system.css` — **kein Vendoring**, kein Tailwind
- **Pagefind** fuer client-seitige Volltextsuche (indexiert `dist/` nach dem Astro-Build)
- **pnpm** als Package-Manager
- **GitHub Pages** als Hosting

## Konventionen

- **Kein Vendoring**: DS-CSS, DS-Logo etc. bleiben Cross-CDN, nie kopieren
- **Keine Tool-Attribution**: weder in Commits, Code noch Doku
- **Konsumenten-URL stabil halten**: `werkzeuge.gruene.at` und der DS-Konsumenten-Pfad sind Vertrag
- **Atomare Commits** fuer Tool-Aenderungen; Phase-1-Scaffold war bewusst ein einziger Commit
- **Conventional Commits**: `feat:`, `fix:`, `docs:`, `chore:` — siehe `.issues/config.yaml`

## Content-Modell

Jedes Werkzeug = `src/content/werkzeuge/<slug>.md`. Schema:

```ts
{
  title, slug, url, source?, own_tool, status,
  maintained_by, hosted_by, license, language,
  categories: string[], audience: string[], tags: string[],
  related: string[],          // Backlinks werden automatisch gebaut
  last_verified: Date
}
```

Backlinks (Sektion "Verlinkt von" auf der Detail-Seite) werden zur Build-Zeit
aus dem `related`-Graphen berechnet — kein manueller Pflegeaufwand pro Tool.

## Lokales Build

```bash
pnpm install
pnpm run build              # erzeugt dist/
pnpm exec pagefind --site dist   # indexiert dist/ fuer Volltextsuche
```

## Neue Werkzeuge hinzufuegen

1. `src/content/werkzeuge/<slug>.md` neu anlegen, Frontmatter komplett
2. `categories` aus `src/lib/kategorien.ts` waehlen (oder dort neue ID anlegen)
3. Optional `related: [<slug>, ...]` setzen — Backlinks erscheinen automatisch
4. PR oeffnen
