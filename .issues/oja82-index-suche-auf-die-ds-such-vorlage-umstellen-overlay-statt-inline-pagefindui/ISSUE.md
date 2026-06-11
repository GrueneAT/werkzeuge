---
id: oja82
title: Index-Suche auf die DS-Such-Vorlage umstellen (Overlay statt Inline-PagefindUI)
status: open
priority: high
labels:
- enhancement
remote:
- source: github
  id: '15'
  url: https://github.com/GrueneAT/werkzeuge/issues/15
---

## Kontext

Das Suchfeld auf der Startseite nutzt die **Pagefind Default-UI** (`PagefindUI`),
die Treffer **inline** unter dem Eingabefeld rendert und damit den restlichen
Seiteninhalt nach unten schiebt (Layout-Shift) — live auf werkzeuge.gruene.at.

Rollout-Teil des DS-Issues **GrueneAT/design-system#26** (gemeinsame Such-Vorlage,
abgeleitet von der Gemeindeordnung). Dieses Issue stellt werkzeuge auf die neue
DS-Vorlage um.

## Scope

- Index-Suchfeld (`src/components/Suche.astro`, eingebunden in `src/pages/index.astro`)
  von der inline-rendernden `PagefindUI` auf das **DS-Overlay/Dropdown-Pattern**
  umstellen → Ergebnisse als Overlay, **kein Content-Shift** mehr.
- DS-Such-Vorlage konsumieren (Markup + CSS aus dem Design System), eigene
  Pagefind-Quelle (`/pagefind/`) anbinden.
- Bestehende Indexierung beibehalten (Name, Beschreibung, Kategorien, Tags;
  Meta-Rauschen via `data-pagefind-ignore` bleibt ausgeschlossen).
- A11y- und Mobile-Verhalten der DS-Vorlage uebernehmen.

## Abhaengigkeit

- Blockiert durch **GrueneAT/design-system#26** (DS-Vorlage muss existieren).

## Acceptance Criteria

- [ ] Suchergebnisse erscheinen als Overlay/Dropdown; der Seiteninhalt wird
      **nicht** mehr verschoben.
- [ ] Such-UI nutzt die DS-Vorlage (Markup + CSS), keine PagefindUI-Default-UI mehr.
- [ ] Suche deckt weiterhin Name, Beschreibung, Kategorien und Tags ab.
- [ ] Tastatur-Navigation + ESC/Focus-Verhalten funktionieren; Mobile-Variante ok.
- [ ] `pnpm run build` + Pagefind-Index sauber; live verifiziert.
