# Changelog

Alle nennenswerten Aenderungen werden hier festgehalten.

## [1.0.0] — 2026-05-24

Initiales Release des Werkzeug-Verzeichnisses (Phase-1-MVP).

### Inhalt

- 8 Werkzeuge: gemeindefinanzen, bildgenerator, gemeindeordnung,
  personenwahl, vorlagen, gruenerator, jitsi-netzbegruenung-at, termino-gv-at
- 5 eigene Gruene-Tools + 3 kuratierte Dritt-Werkzeuge

### Features

- Landing mit Hero, eigenen Tools, Kategorien-Grid, Dritt-Tools-Liste
- Detail-Seite je Werkzeug mit URL-Button, Meta-Tabelle, Markdown-Body,
  Verwandte-Sektion, automatischen Backlinks ("Verlinkt von")
- Kategorien-Index `/kategorie/<id>/` fuer jede aktive Kategorie
- Filter-Bar auf `/alle/` mit Typ-Toggle (eigene/Dritt) und Kategorien-Filter
- Volltextsuche via Pagefind auf `/suche/`
- Datenschutz-Badge (On-Device / SaaS-EU / SaaS-AT / Self-Host etc.)

### Tech

- Astro 5 mit Content Collections (Zod-Schema)
- Design-System v2.2 per CDN (kein Vendoring)
- Pagefind als reine Build-Zeit-Indexierung
- GitHub Pages mit Pages-Workflow
- `public/CNAME` fuer spaetere Custom-Domain `werkzeuge.gruene.at` (Phase 4)
