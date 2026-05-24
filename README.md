# Werkzeuge

Werkzeug-Verzeichnis fuer Gruene-AT-Gemeindegruppen und kommunalpolitische
Arbeit. Listet eigene Gruene-Tools (gemeindefinanzen, bildgenerator,
Gemeindeordnung, personenwahl, vorlagen) und kuratierte Dritt-Tools
(Jitsi, termino.gv.at, gruenerator).

**Live:** https://grueneat.github.io/werkzeuge/

(Spaeter: https://werkzeuge.gruene.at/ — DNS-CNAME steht noch aus.)

## Was es enthaelt

- 8 Werkzeuge mit Detail-Seite, Lizenz/Hosting-Info, Datenschutz-Hinweisen,
  Quellcode-Links wenn Open Source
- Volltextsuche (Pagefind, lauft im Browser)
- Kategorien-Filter und Typ-Filter (eigen/Dritt)
- Auto-Backlinks (jede Seite zeigt, wer auf sie verlinkt)

## Ein Werkzeug vorschlagen

PRs willkommen. Eine neue Werkzeug-Karte = eine Markdown-Datei unter
`src/content/werkzeuge/<slug>.md` mit Frontmatter:

```yaml
---
title: Mein Werkzeug
slug: mein-werkzeug
url: https://...
source: https://github.com/.../mein-werkzeug   # optional
own_tool: false                                # true = eigenes Gruene-Tool
status: live                                   # live | beta | unreleased | unmaintained
maintained_by: Anbieter
hosted_by: "self-host"                         # oder "SaaS-EU", "GitHub Pages", etc.
license: AGPL-3.0
language: de
categories:
  - kollaboration
audience:
  - gemeindegruppe
tags:
  - markdown
  - team
related:
  - vorlagen
last_verified: 2026-05-24
---

Eine 1-2 Saetze Kurzbeschreibung.

## Was macht das Werkzeug
...

## Wann nutzen
...

## Wann NICHT nutzen
...

## Datenschutz
...

## Lizenz & Kosten
...
```

Verfuegbare Kategorien siehe `src/lib/kategorien.ts`. Backlinks werden
automatisch generiert — `related:` reicht.

## Lokale Entwicklung

```bash
pnpm install
pnpm run dev                       # Vite-Devserver
pnpm run build                     # erzeugt dist/
pnpm exec pagefind --site dist     # indexiert dist/ fuer Suche
pnpm run preview                   # serviert dist/
```

## Stack

- [Astro 5](https://astro.build/) mit Content Collections
- [Design System v2.2](https://grueneat.github.io/design-system/) per CDN
- [Pagefind](https://pagefind.app/) fuer Volltextsuche
- [pnpm](https://pnpm.io/) als Package-Manager
- GitHub Pages als Hosting

## Self-Host

Klassische statische Site — jeder Webserver oder Pages-Provider reicht.
Nach `pnpm run build && pnpm exec pagefind --site dist` einfach `dist/`
ausliefern.

## Lizenz

MIT
