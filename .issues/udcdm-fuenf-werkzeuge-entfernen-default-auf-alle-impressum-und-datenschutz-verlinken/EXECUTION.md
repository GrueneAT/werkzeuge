# Execution: Fuenf Werkzeuge entfernen, Default auf Alle, Impressum und Datenschutz verlinken

**Started:** 2026-08-26T18:30:00Z (session opened 2026-08-26, wrapped up 2026-09-01)
**Status:** complete
**Branch:** issue/udcdm-fuenf-werkzeuge-entfernen-default-auf-alle-impressum-und-datenschutz-verlinken

## Execution Log

- [x] Teil 1: Fuenf Eintraege entfernen — commit 356a831
  - `git rm` fuer `bildgenerator.md`, `vorlagen.md`, `bundesbuero-server.md`,
    `gemeindeordnung.md`, `gemeindefinanzen.md`
  - Vorab geprueft: `related`-Felder aller verbleibenden 16 Content-Dateien
    verweisen auf keinen der fuenf Slugs (nur `bundesbuero-server` selbst
    verwies auf `passbolt`, das bleibt bestehen)
- [x] Teil 2: Filter-Default „Highlights" -> „Alle" — commit 64b5be1
  - `src/components/FilterBar.astro`: `aria-pressed` an beiden Chips
    getauscht (Zeile 28/29) und `state.facet` im Skript von `'highlights'`
    auf `'all'` (Zeile 71) — beide Stellen jetzt konsistent
  - `src/pages/index.astro`: Hero-Absatz und Zaehler-Zeile umformuliert,
    beschreiben jetzt „Alle" als Default und „Highlights" als waehlbaren
    Filter
- [x] Teil 3: Impressum/Datenschutz im Footer — commit 4a9dc17
  - `src/layouts/Base.astro`: zwei zusaetzliche Links im
    `.werkzeuge-footer`, `rel="noopener" target="_blank"` (gleiche
    Konvention wie die Aussenlinks auf den Werkzeug-Detailseiten)
  - URL exakt wie in der ISSUE.md gefordert uebernommen:
    `https://gruene.at/datenschutzerklarung/` (ohne „ä", ohne „ss")

## Verification Results

**Build:** `NODE_ENV=development pnpm install` (fuer Pagefind als
Dev-Dependency), dann `pnpm run build` (postbuild-Hook fuehrt
`pagefind --site dist` bereits automatisch aus) — sauber, keine Fehler,
25 Seiten gebaut, 16 Seiten von Pagefind indexiert.

Nach dem letzten Commit zusaetzlich `rm -rf dist .astro && pnpm run build`
wiederholt, um den Build exakt aus dem committeten Stand zu bestaetigen —
gleiches Ergebnis.

**Nachweise im gebauten `dist/`:**
- `ls dist/werkzeug/` -> genau 16 Verzeichnisse, keines der fuenf
  entfernten Slugs darunter
- `grep -rl "<slug>" dist/` fuer alle fuenf Slugs (bildgenerator, vorlagen,
  bundesbuero-server, gemeindeordnung, gemeindefinanzen) -> keine Treffer
  irgendwo in `dist/` (weder HTML noch generierte Assets)
- `grep -a -rl "<slug>|<Title>" dist/pagefind/` fuer alle fuenf Slugs und
  ihre Titel (Bildgenerator, Vorlagen, Bundesbüro, Gemeindeordnung,
  Gemeindefinanzen) -> keine Treffer im binären Pagefind-Index
  (`.pf_fragment`/`.pf_index`/`.pf_meta`)
- `grep -o 'data-bereich="[a-z-]*"' dist/index.html | wc -l` -> 16 Karten
  auf der Startseite (4 standardtools, 7 sonstiges, 3 admin, 1
  eigene-tools, 1 bundesbuero — passt exakt zur Sollzahl aus der ISSUE.md)
- Gebautes `dist/index.html`: Chip „Alle" traegt `aria-pressed="true"`,
  Chip „Highlights" traegt `aria-pressed="false"` — Markup und Skript-
  Startwert stimmen ueberein, keine widerspruechliche Anzeige
- Zaehler-Zeile im gebauten HTML: „16 Werkzeuge, davon 5 Highlights"
- Footer mit Impressum- und Datenschutz-Link nachgewiesen sowohl in
  `dist/index.html` (Startseite) als auch in `dist/werkzeug/passbolt/index.html`
  (Detailseite) — Footer sitzt im Layout, gilt also fuer jede Seite
- Backlink-Sektionen („Verlinkt von") auf allen betroffenen Detailseiten
  (cloud, gruenerator, listen, icewarp, openauthenticator, passbolt,
  personenwahl, termino-gv-at) geprueft — keine zeigt auf einen entfernten
  Slug

**Linter/Typecheck:** Kein Linter im Repo konfiguriert (nur `dev`,
`build`, `preview`, `check`, `index`, `postbuild` in `package.json`).
`pnpm run check` (astro check) haette `@astrojs/check` und `typescript`
als neue Dev-Dependencies nachinstalliert — nicht Teil der bestehenden
Verifikations-Kette aus der Repo-CLAUDE.md (`pnpm install`, `pnpm run
build`, `pnpm exec pagefind --site dist`), daher uebersprungen und nicht
nachinstalliert, um keine neue Abhaengigkeit ohne Auftrag einzufuehren.
Der produktive Build (Astro's eingebaute Content-Collection-Validierung
per Zod-Schema) lief fehlerfrei durch, das deckt die relevanten
Typ-/Schema-Fehler ab.

**Tests:** Kein Testframework im Repo (statische Astro-Site ohne
Unit-/Integrationstests). Aenderungen sind Content-Entfernung und
Markup/Text-Anpassungen, vollstaendig ueber den Build + manuelle
`grep`-Nachweise im `dist/`-Output verifiziert (siehe oben).

## Deviations from Plan

Keine. Alle drei Teile der ISSUE.md wie beschrieben umgesetzt, Fundstellen
und Zeilennummern haben gestimmt (kleine Verschiebung: `aria-pressed`
tatsaechlich Zeile 28/29, `state` Zeile 71 statt der in der ISSUE.md
genannten ~73 — beides im erwarteten Bereich).

## Discovered Issues

Keine ausserhalb des Issue-Scopes gefundenen Probleme.

## Self-Check

- [x] Alle fuenf Content-Dateien aus `src/content/werkzeuge/` entfernt
- [x] Kein `related`-Verweis zeigt mehr auf einen entfernten Slug
- [x] `FilterBar.astro`: Markup- und Skript-Default konsistent auf „Alle"
- [x] `index.astro`: Hero-Text und Zaehler-Zeile beschreiben „Alle" als
      Default, kein Satzrest mit „Highlights" als Default-Behauptung
- [x] `Base.astro`: Impressum- und Datenschutz-Link im Footer, korrekte
      URLs, `rel="noopener" target="_blank"`
- [x] Alle drei Commits existieren auf dem Branch (356a831, 64b5be1,
      4a9dc17)
- [x] `pnpm run build` laeuft fehlerfrei durch (zweimal verifiziert,
      inklusive frischem `rm -rf dist .astro`-Rebuild aus dem committeten
      Stand)
- [x] Kein TODO/FIXME/HACK/PLACEHOLDER in den geaenderten Dateien
- [x] Kein Debug-Code (`console.log`, `debugger`) in den geaenderten
      Dateien
- **Result:** PASSED

**Completed:** 2026-09-01T18:45:00Z
**Duration:** ~15 min aktive Ausfuehrung
**Commits:** 3 (plus dieser EXECUTION.md-Commit)
