# Research: Gemeindefinanzen im Verzeichnis als Beta kennzeichnen

**Researched:** 2026-08-26
**Issue:** mzu8v-gemeindefinanzen-im-verzeichnis-als-beta-kennzeichnen
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

Keine `CONTEXT.md` vorhanden — es gab keine `issue:discuss`-Runde. Verbindlich
sind daher ausschliesslich die Vorgaben aus `ISSUE.md`:

### Locked Decisions (aus ISSUE.md "Constraints" + "Was zu tun ist")
- **Nur Content-/Frontmatter-Aenderung.** Keine Komponenten-Umbauten
  (`WerkzeugCard.astro`, `[slug].astro`, `content.config.ts` bleiben unberuehrt).
- `status: live` -> `status: beta` in `src/content/werkzeuge/gemeindefinanzen.md`.
- Beta-Hinweis **im ersten Absatz** der Beschreibung, nicht weiter unten.
- Support-Adresse im Hinweis: `florian.motlik@gruene.at`.
- `last_verified` aktualisieren.
- Conventional Commit, keine Werkzeug-Attribution.

### Claude's Discretion
- Exakte Formulierung des Beta-Satzes (Laenge/Wortlaut) — siehe Empfehlung unten.
- Konkretes `last_verified`-Datum (sinnvoll: 2026-08-26, das Aenderungsdatum).

### Deferred Ideas (OUT OF SCOPE)
- Gegenstueck im Tool selbst (Beta-Hinweis in Ueberschrift + Hinweis beim
  Oeffnen) — eigenes Issue im Repo `gemeindefinanzen`, hier nicht anfassen.
- Eine Status-Label-Zuordnung (`beta` -> „Beta") in einer `lib/status.ts` — waere
  ein Komponenten-/Lib-Umbau und ist explizit ausgeschlossen (Begruendung unten).
</user_constraints>

## Summary

Die Aenderung ist rein deklarativ: `status: beta` im Frontmatter genuegt, damit
Karte und Detailseite automatisch das Warn-Tag rendern. Das ist verifiziert —
`status` wird im gesamten `src/` nur an **drei** Stellen gelesen
(`WerkzeugCard.astro:54-55`, `[slug].astro:39`, `[slug].astro:89`), immer als
simpler `!== 'live'`-Vergleich. Es gibt **keine** Filterung, Sortierung oder
Gruppierung nach `status` — weder auf `/` noch auf `/verzeichnis/` noch auf den
Kategorieseiten. Eine Label-Zuordnung existiert nicht und wird auch nicht
gebraucht: der rohe String wird gerendert, die beiden bestehenden Beta-Eintraege
(`icewarp`, `personenwahl`) zeigen im gebauten HTML nachweislich das kleine
Tag „beta" — das neue Ergebnis ist damit automatisch konsistent.

Der einzige echte Fallstrick liegt **nicht** beim Status, sondern beim
Beschreibungstext. `WerkzeugCard.astro:31-38` erzeugt den Karten-Teaser aus dem
**ersten Absatz** des Markdown-Bodys und kuerzt ihn bei >180 Zeichen hart auf 177
Zeichen + `...`. Der aktuelle erste Absatz hat bereits 169 Zeichen. Haengt man
den Beta-Satz hinten an, faellt er auf der Karte der Kuerzung zum Opfer
(nachgestellt simuliert: der Teaser endet bei „... Beta-Ph…") — genau die
Sichtbarkeit, die das Issue herstellen will, ginge verloren. Ein **eigener**
vorangestellter Beta-Absatz waere ebenso falsch: er wuerde als erster Absatz den
kompletten Karten-Teaser ersetzen und die Werkzeug-Beschreibung von der Karte
verdraengen. Zusaetzlich strippt die Teaser-Logik zwar `**` und Backticks, aber
**keine Markdown-Links** — ein `[mail](mailto:...)` wuerde als roher
Markdown-Quelltext auf der Karte landen.

Zweite verifizierte Huerde betrifft nur die lokale Verifikation, nicht den Code:
im Container ist `NODE_ENV=production` gesetzt, wodurch `pnpm install`
devDependencies ueberspringt und `pnpm run build` im `postbuild`-Hook mit
`sh: 1: pagefind: not found` abbricht.

**Primary recommendation:** Beta-Hinweis als **Einleitungssatz innerhalb des
bestehenden ersten Absatzes** formulieren (nicht als eigener Absatz, nicht
angehaengt), E-Mail als **Klartext** ohne Markdown-Link, und den Absatz so
straffen, dass er unter 180 Zeichen bleibt — dann steht der Beta-Hinweis
ungekuerzt auf jeder Karte. Vor dem Build lokal `NODE_ENV= pnpm install
--prod=false` ausfuehren.

## Codebase Analysis

### Relevant Code

| File | Purpose | Last Modified | Relevance |
|------|---------|---------------|-----------|
| `src/content/werkzeuge/gemeindefinanzen.md` | Der zu aendernde Eintrag (`status: live`, `last_verified: 2026-05-24`) | `6311b8b` (URL-Fix) | **Einzige zu aendernde Datei** |
| `src/content.config.ts` | Zod-Schema; `status: z.enum(['live','beta','unreleased','unmaintained'])`, `last_verified: z.date()` | `eb3de17` | `beta` ist bereits gueltig — kein Schema-Change |
| `src/components/WerkzeugCard.astro` | Karte: Warn-Tag (Z. 54-55) **und** Teaser-Kuerzung (Z. 31-38) | `eb3de17` | Rendert Tag automatisch; Teaser-Logik ist der Fallstrick |
| `src/pages/werkzeug/[slug].astro` | Detailseite: Warn-Tag (Z. 39), Status-Zeile in `dl` (Z. 89) | `eb3de17` | Rendert Tag automatisch |
| `src/content/werkzeuge/icewarp.md` | Bestehender `status: beta`-Eintrag | `eb3de17` | Referenz fuer Konsistenz |
| `src/content/werkzeuge/personenwahl.md` | Bestehender `status: beta`-Eintrag | `eb3de17` | Referenz fuer Konsistenz |
| `src/pages/index.astro`, `src/pages/verzeichnis.astro`, `src/pages/kategorie/[id].astro` | Listenseiten | `eb3de17` | **Kein** `status`-Zugriff — nur indirekt ueber `WerkzeugCard` |

Hinweis zur Aktualitaet: keine der beteiligten Dateien hat offene Folgearbeiten
im Verzeichnis; die Komponenten stammen aus `eb3de17` (Bereiche/Highlights-PR).
Das Schwester-Issue `oja82` im selben `.issues/`-Verzeichnis betrifft die
Such-Oberflaeche (`Suche.astro`), nicht Karte oder Content — **kein Konflikt**.

### Interfaces

<interfaces>
// From src/content.config.ts — Zod-Schema der Collection `werkzeuge`
// (nur die fuer dieses Issue relevanten Felder)
status: z.enum(['live', 'beta', 'unreleased', 'unmaintained'])   // REQUIRED
last_verified: z.date()                                          // REQUIRED, YAML-Datum unquoted: 2026-08-26
title: z.string()
slug: z.string()
categories: z.array(z.string())                                  // >0 noetig, damit die Karte den Status-Tag ueberhaupt rendert

// From src/components/WerkzeugCard.astro — Props
interface Props {
  entry: {
    id: string;
    data: {
      title: string; slug: string; own_tool: boolean; bereich: string;
      highlight?: boolean; bundesland: string[]; status: string;
      categories: string[]; tags: string[];
    };
    body?: string;
  };
  variant?: 'default' | 'compact';
}

// From src/components/WerkzeugCard.astro:31-38 — Teaser-Ableitung (LOAD-BEARING)
// Der Karten-Text ist der ERSTE nicht-leere Absatz des Markdown-Bodys.
const rawBody = (entry as any).body ?? '';
const firstPara = rawBody
  .split(/\n{2,}/)
  .map((p: string) => p.trim())
  .find((p: string) => p && !p.startsWith('#') && !p.startsWith('---'))
  ?? '';
const stripped = firstPara.replace(/\*\*/g, '').replace(/\n+/g, ' ').replace(/`([^`]+)`/g, '$1');
const shortDesc = stripped.length > 180 ? stripped.slice(0, 177) + '...' : stripped;
// -> strippt NUR ** und `code`; Markdown-Links bleiben als Rohtext stehen.

// From src/components/WerkzeugCard.astro:54-55 — Status-Tag (nur wenn categories.length > 0)
{entry.data.status !== 'live' && (
  <span class="gat-tag gat-tag--warn">{entry.data.status}</span>
)}

// From src/pages/werkzeug/[slug].astro:39 — Status-Tag im Detail-Header
{d.status !== 'live' && <span class="gat-tag gat-tag--warn">{d.status}</span>}

// From src/pages/werkzeug/[slug].astro:88-89 — Status in der Meta-Tabelle
<dt data-pagefind-ignore>Status</dt>
<dd data-pagefind-ignore>{d.status}</dd>
</interfaces>

### Reusable Components

- **Nichts neu zu bauen.** `gat-tag gat-tag--warn` kommt aus dem gehosteten
  Design-System (`https://design-system.gruene.at/design-system.css`) und wird
  von beiden Render-Stellen bereits verwendet.
- **Bestehende Beta-Eintraege als Vorlage:** `icewarp.md` und `personenwahl.md`
  stehen schon auf `status: beta`. Im gebauten `dist/` ist verifiziert, dass
  daraus `<span class="gat-tag gat-tag--warn">beta</span>` wird — sowohl in
  `dist/index.html` (Karte) als auch in `dist/werkzeug/icewarp/index.html`
  (Detailseite).
- `icewarp.md` fuehrt den Status-Kontext ebenfalls direkt im ersten Absatz —
  das Muster „Statushinweis gehoert in Absatz 1" existiert im Repo bereits.

### Potential Conflicts

- **Karten-Teaser vs. Beta-Satz (der eigentliche Konflikt).** Simuliert mit der
  exakten Logik aus `WerkzeugCard.astro`:

  | Variante | Laenge (stripped) | Karten-Teaser |
  |----------|------------------:|---------------|
  | IST (unveraendert) | 169 | vollstaendig |
  | Beta-Satz **angehaengt** | 226 | **abgeschnitten** — endet mit „… Beta-Ph…" |
  | Beta-Satz **vorangestellt**, Rest unveraendert | 215 | Beta sichtbar, Beschreibung abgeschnitten |
  | Beta-Satz vorangestellt **+ Absatz gestrafft** | 148-156 | **vollstaendig, nichts gekuerzt** |

- **Eigener Beta-Absatz vor der Beschreibung:** wuerde von `firstPara` als
  *der* Teaser gewaehlt — die Werkzeug-Beschreibung verschwaende komplett von
  allen Karten. Nicht tun.
- **`related`/Backlinks:** `gemeindeordnung.md` verlinkt auf `gemeindefinanzen`,
  `gemeindefinanzen` verlinkt auf `vorlagen`. Die Karte (mit Beta-Tag)
  erscheint dadurch zusaetzlich auf `/werkzeug/gemeindeordnung/` und in der
  „Verlinkt von"-Sektion von `/werkzeug/vorlagen/`. Kein Bruch — nur mehr
  Oberflaechen, auf denen der Text passen muss.
- **`variant="compact"`** blendet Teaser *und* Status-Tag aus, wird aber
  aktuell **nirgends** gesetzt (alle 5 Aufrufstellen nutzen den Default) — kein
  praktischer Konflikt.

## Standard Stack

| Library | Version | Purpose | Why Standard | Confidence |
|---------|---------|---------|--------------|------------|
| astro | 5.18.1 (installiert; Range `^5.0.0`) | Content Collections + statischer Build | Bereits der Stack laut `CLAUDE.md` | HIGH (installiert verifiziert) |
| pagefind | 1.5.2 (installiert; Range `^1.1.1`) | Volltextindex ueber `dist/` im `postbuild` | Bereits der Stack | HIGH (installiert verifiziert) |
| pnpm | 9.12.3 (`packageManager: pnpm@9.0.0`) | Package-Manager | Repo-Vorgabe | HIGH |
| Design System | gehostet, `design-system.gruene.at/design-system.css` | `gat-tag--warn` etc. | Kein Vendoring (Repo- und Workspace-Regel) | HIGH |

Fuer dieses Issue wird **keine** neue Abhaengigkeit gebraucht.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Rohen Status-String rendern | Label-Map `lib/status.ts` (`beta` -> „Beta") | Waere kosmetisch schoener (Grossschreibung), erfordert aber Aenderungen an `WerkzeugCard.astro` **und** `[slug].astro` und wuerde die bestehenden Beta-Eintraege mitveraendern. `ISSUE.md` schliesst Komponenten-Umbauten aus. **Verworfen** — separates Issue, falls gewuenscht. |
| Beta-Satz im ersten Absatz | Eigener `<div class="gat-callout">`-Block im Markdown | Groesserer visueller Hinweis auf der Detailseite, aber auf der **Karte** unsichtbar (Karte zeigt nur Absatz 1) und Rohes HTML im Content ist im Repo nirgends etabliert. **Verworfen.** |
| E-Mail als Klartext | `[florian.motlik@gruene.at](mailto:...)` | Auf der Detailseite klickbar, auf der Karte aber roher Markdown-Quelltext (verifiziert: die Teaser-Regexe strippen keine Links). **Verworfen fuer Absatz 1** — ein Mailto-Link weiter unten im Body waere unproblematisch. |

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Beta-Kennzeichnung auf Karte + Detailseite | Eigenes Badge/Markup im Markdown-Body | `status: beta` im Frontmatter | Beide Render-Stellen erzeugen das Tag bereits automatisch aus `status !== 'live'` |
| Status-Beschriftung | Label-Mapping/Grossschreibung | Rohen Enum-Wert `beta` so lassen | `icewarp` und `personenwahl` rendern nachweislich ebenfalls „beta" — Konsistenz ohne Codeaenderung |
| Kurzbeschreibung auf der Karte | Ein zusaetzliches `description`-Frontmatter-Feld | Ersten Markdown-Absatz passend formulieren | Die Karte leitet den Teaser bereits aus Absatz 1 ab; ein neues Feld waere ein Schema- und Komponenten-Change |

## Architecture Patterns

### Recommended Approach

1. **Frontmatter:** `status: live` -> `status: beta`; `last_verified: 2026-05-24`
   -> `last_verified: 2026-08-26` (unquoted ISO-Datum, wie alle anderen Eintraege).
2. **Erster Absatz:** Beta-Hinweis als **fuehrenden Satz in denselben Absatz**
   setzen und den Beschreibungssatz dabei so straffen, dass die Gesamtlaenge
   (nach Entfernen von `**`) **unter 180 Zeichen** bleibt. Verifizierte, passende
   Formulierungen (Laenge in Klammern, jeweils ungekuerzt auf der Karte):

   - (148) `**Beta** — Rueckmeldungen an florian.motlik@gruene.at. Browserbasierte Analyse oesterreichischer Gemeindebudgets nach **VRV 2015**, clientseitig im Browser.`
   - (154) `**Beta-Phase** — Feedback an florian.motlik@gruene.at. Browserbasierte Analyse oesterreichischer Gemeindevoranschlaege und Rechnungsabschluesse nach **VRV 2015**.`

   Der weggefallene Datenschutz-Halbsatz ist kein Verlust: die
   `## Datenschutz`-Sektion und das `DatenschutzBadge` decken das ab.
3. **Schreibweise:** `gemeindefinanzen.md` benutzt durchgaengig
   ASCII-Transliteration (`oesterreichischer`, `Rechnungsabschluesse`,
   `Rueckmeldungen`). Neuen Text im selben Stil schreiben — nicht mit echten
   Umlauten mischen (`icewarp.md` nutzt echte Umlaute, aber die Konsistenz gilt
   pro Datei).
4. **Optional, falls mehr Text gewuenscht:** ausfuehrlicherer Beta-Hinweis
   (inkl. klickbarem `mailto:`-Link) als **zweiter** Absatz oder in einer
   eigenen `## Beta`-Sektion. Ab Absatz 2 greift die Teaser-Kuerzung nicht mehr.

### Anti-Patterns to Avoid

- **Beta-Satz ans Ende von Absatz 1 haengen:** verifiziert — er wird auf der
  Karte abgeschnitten (Teaser endet bei „… Beta-Ph…"). Genau das Gegenteil des
  Issue-Ziels.
- **Eigener Beta-Absatz VOR der Beschreibung:** ersetzt den kompletten
  Karten-Teaser, die Werkzeug-Beschreibung verschwindet von allen Listenseiten.
- **Markdown-Link/`mailto:` in Absatz 1:** landet als roher Quelltext
  (`[florian.motlik@gruene.at](mailto:...)`) auf der Karte.
- **`WerkzeugCard.astro` / `[slug].astro` anfassen:** durch `ISSUE.md`
  ausgeschlossen und funktional unnoetig.
- **`status` in Anfuehrungszeichen oder mit Grossbuchstaben** (`"Beta"`):
  bricht das Zod-Enum, der Build schlaegt fehl.

## Common Pitfalls

### Karten-Teaser schneidet den Beta-Hinweis ab
**What goes wrong:** Der Beta-Satz wird an Absatz 1 angehaengt; die Karte zeigt
nur die ersten 177 Zeichen plus `...`, der Beta-Text faellt raus.
**Why it happens:** `WerkzeugCard.astro:38` kuerzt bei `stripped.length > 180`.
Absatz 1 hat heute schon 169 Zeichen.
**How to avoid:** Beta-Hinweis nach vorne, Absatz auf <180 Zeichen straffen.
**Warning signs:** Nach dem Build endet der Kartentext in `dist/index.html` mit
`...` und ohne das Wort „Beta".

### Markdown-Link leakt als Rohtext auf die Karte
**What goes wrong:** `[florian.motlik@gruene.at](mailto:florian.motlik@gruene.at)`
erscheint auf der Karte woertlich mit eckigen Klammern.
**Why it happens:** Die Strip-Kette entfernt nur `**` und `` `code` `` — keine
Link-Syntax.
**How to avoid:** In Absatz 1 die Adresse als Klartext schreiben. Klickbare
Mailto-Links erst ab Absatz 2.
**Warning signs:** `grep -o 'werkzeug-card__desc[^<]*' dist/index.html` zeigt
`[` oder `](`.

### `pnpm run build` bricht lokal an `pagefind` ab
**What goes wrong:** Astro baut 33 Seiten sauber, dann scheitert der
`postbuild`-Hook mit `sh: 1: pagefind: not found`, und `pnpm` beendet sich mit
`ELIFECYCLE`.
**Why it happens:** Im Container ist `NODE_ENV=production` gesetzt; `pnpm
install` meldet dann `devDependencies: skipped because NODE_ENV is set to
production` — `pagefind` (devDependency) wird nie installiert. In der GitHub-
Actions-Pipeline tritt das nicht auf.
**How to avoid:** `NODE_ENV= pnpm install --prod=false` vor dem Build.
**Warning signs:** `node_modules/.bin/` enthaelt nur `astro`.
**Verifiziert:** nach `NODE_ENV= pnpm install --prod=false` laeuft
`NODE_ENV= pnpm run build` vollstaendig gruen durch (33 Seiten, Pagefind
indexiert 22 Seiten / 1366 Woerter).

### Inkonsistente Umlaut-Schreibweise
**What goes wrong:** Neuer Satz mit echten Umlauten („Rückmeldungen") in einer
Datei, die sonst durchgaengig transliteriert („Rueckmeldungen").
**How to avoid:** Stil der Zieldatei uebernehmen — `gemeindefinanzen.md` ist
komplett ASCII-transliteriert.

### Nebeneffekt auf den Suchindex (unkritisch, aber wissenswert)
Das Status-Tag in `[slug].astro:39` liegt innerhalb von
`<article data-pagefind-body>` und wird daher indexiert — nach der Umstellung
findet eine Suche nach „beta" auch Gemeindefinanzen (wie heute schon IceWarp und
Personenwahl). Die Status-Zeile in der Meta-`dl` traegt dagegen
`data-pagefind-ignore` und bleibt aussen vor. Kein Handlungsbedarf.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| node | Astro-Build | ja | v26.7.0 | — |
| pnpm | Install/Build | ja | 9.12.3 | — |
| astro | Build | ja (installiert) | 5.18.1 | — |
| pagefind | `postbuild`-Hook | erst nach `--prod=false`-Install | 1.5.2 | `NODE_ENV= pnpm install --prod=false` |
| issue-cli | Pipeline-Gates | ja | `/usr/local/bin/issue-cli` | — |
| `git` im Worktree | Commits (macht der Orchestrator) | eingeschraenkt — `git` im Worktree meldet `not a git repository` (relatives `gitdir:` in `.git` loest hier nicht auf); History nur ueber den Haupt-Checkout lesbar | — | Git-Operationen vom Haupt-Checkout aus |

Build-/Testkommandos des Repos (aus `package.json`):

| Kommando | Zweck |
|----------|-------|
| `pnpm install` | Abhaengigkeiten (im Container: `NODE_ENV= pnpm install --prod=false`) |
| `pnpm run build` | `astro build` + `postbuild: pagefind --site dist` — **das Akzeptanzkriterium** |
| `pnpm run check` | `astro check` (Typ-/Content-Schema-Pruefung) |
| `pnpm run dev` | Dev-Server |
| `pnpm exec pagefind --site dist` | Suchindex separat |

Es gibt **keine** Unit-Test-Suite und keinen Linter — die Verifikation laeuft
ueber `pnpm run build` (Zod-Schema-Validierung passiert dabei) plus einen Blick
ins erzeugte `dist/`.

## Project Constraints (from CLAUDE.md)

Aus `CLAUDE.md` (Repo `werkzeuge`) und der Workspace-`CLAUDE.md`:

- **Kein Vendoring** von Drittabhaengigkeiten (DS-CSS, Logos, JS) — hier ohnehin
  nicht beruehrt, aber: kein lokales CSS fuer das Beta-Tag anlegen.
- **Keine Werkzeug-Attribution** in Commits, Code, Kommentaren oder Doku.
- **Conventional Commits** (`feat:`, `fix:`, `docs:`, `chore:`); passend fuer
  diese Aenderung: `docs(content): ...` oder `fix(content): ...`.
- **Atomare Commits** fuer Tool-Aenderungen — eine Datei, ein Commit.
- **Konsumenten-URLs stabil halten** — `url:` und `source:` im Frontmatter
  nicht anfassen.
- **Immer im Worktree arbeiten**, nie im Haupt-Checkout
  (`/Users/florianmotlik/Code/GrueneAT/web-apps/werkzeuge`).
- **Deutsche Fachtexte, englische Bezeichner/Commits** — der Content-Text ist
  Deutsch, der Commit-Betreff Englisch.
- **Nicht ueberkonstruieren:** vorhandene Struktur (`status`-Enum + bestehende
  Tag-Renderer) nutzen, statt eine neue Ebene einzuziehen.

## Sources

### HIGH confidence
- Codebase-Analyse im Worktree: `src/content.config.ts`, `src/components/WerkzeugCard.astro`, `src/pages/werkzeug/[slug].astro`, `src/pages/index.astro`, `src/pages/verzeichnis.astro`, `src/pages/kategorie/[id].astro`, `src/components/Backlinks.astro`, `src/lib/bereiche.ts`
- Vollstaendiger `grep` nach `status` ueber `src/**/*.astro` und `src/**/*.ts` — exakt 3 Lesestellen, 1 Schema-Definition
- Statuswerte aller 22 Content-Dateien (`grep '^status:'`): 2x `beta` (`icewarp`, `personenwahl`), 20x `live`, 0x `unreleased`/`unmaintained`
- Gebautes `dist/` dieses Worktrees: `gat-tag gat-tag--warn">beta` in `dist/index.html` und `dist/werkzeug/icewarp/index.html`
- Ausgefuehrte Kommandos: `pnpm install` (mit/ohne `--prod=false`), `pnpm run build` (fehlgeschlagen bei `NODE_ENV=production`, gruen mit devDependencies)
- Teaser-Simulation mit der 1:1 aus `WerkzeugCard.astro:31-38` uebernommenen Logik (Zeichenlaengen und Kuerzungsverhalten oben)
- `package.json`, `.github/workflows/*.yml`, `.issues/config.yaml`
- `CLAUDE.md` (Repo + Workspace), `ISSUE.md`

### MEDIUM confidence
- Git-History der beteiligten Dateien (`eb3de17`, `6311b8b`) — aus dem Haupt-Checkout gelesen, da `git` im Worktree nicht aufloest; kann minimal aelter sein als der Worktree-Stand.

### LOW confidence (needs validation)
- Keine. Alle Aussagen sind gegen Code oder ausgefuehrte Builds verifiziert.

## Metadata

**Confidence breakdown:**

| Area | Level | Reason |
|------|-------|--------|
| Codebase | HIGH | Alle `status`-Lesestellen per vollstaendigem Grep erfasst und gelesen |
| Standard Stack | HIGH | Versionen aus tatsaechlicher Installation, keine neue Abhaengigkeit noetig |
| Architecture | HIGH | Empfehlung gegen die reale Teaser-Logik simuliert, nicht geschaetzt |
| Pitfalls | HIGH | Kuerzungs-, Link- und Build-Fallstricke reproduziert |
| Environment | HIGH | Install und Build beide ausgefuehrt (rot und gruen) |

**Research date:** 2026-08-26
**Research depth:** light (kleines Content-Issue, kein Ecosystem-Research noetig — keine neue Abhaengigkeit im Spiel)
**Sub-agents used:** keine — Codebase-, Pitfalls- und Environment-Recherche direkt durchgefuehrt; Ecosystem-Recherche entfaellt mangels externer Abhaengigkeit
**Raw research files:** entfallen (light depth, Befunde direkt hier synthetisiert)

### Ready for Planning
Der Umfang ist eine Datei: `src/content/werkzeuge/gemeindefinanzen.md`
(Frontmatter `status` + `last_verified`, Absatz 1 neu formuliert), verifiziert
mit `NODE_ENV= pnpm install --prod=false && NODE_ENV= pnpm run build` und einem
Blick auf den Kartentext in `dist/index.html`.
