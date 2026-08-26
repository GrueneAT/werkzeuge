# Plan: Gemeindefinanzen im Verzeichnis als Beta kennzeichnen

<objective>
Was dieser Plan erreicht: Der Eintrag `src/content/werkzeuge/gemeindefinanzen.md`
steht auf `status: beta`, und der Beta-Hinweis samt Support-Adresse
(`florian.motlik@gruene.at`) steht im ersten Absatz der Beschreibung — sodass
das Warn-Tag „beta" auf Karte und Detailseite erscheint und der Beta-Hinweis
ungekuerzt im Karten-Teaser sichtbar ist.

Warum das zaehlt: Das Gemeindefinanzen-Werkzeug ist noch Beta, stand im
Verzeichnis aber auf `live`. Im Verzeichnis — der Stelle, an der man das
Werkzeug zuerst sieht — war der Beta-Stand damit nirgends erkennbar.

Scope:
- IN: genau eine Datei, `src/content/werkzeuge/gemeindefinanzen.md`
  (Frontmatter `status` + `last_verified`, Absatz 1 neu formuliert).
- OUT: `WerkzeugCard.astro`, `src/pages/werkzeug/[slug].astro`,
  `src/content.config.ts` — alle drei bleiben unberuehrt (Constraint aus
  ISSUE.md: „Nur Content-/Frontmatter-Aenderung, keine Komponenten-Umbauten").
- OUT: das Gegenstueck im Repo `gemeindefinanzen` (Beta-Hinweis in Ueberschrift
  + Hinweis beim Oeffnen) — eigenes Issue, hier nicht anfassen.
- OUT: eine Status-Label-Map (`beta` -> „Beta") in einer `lib/status.ts` — waere
  ein Komponenten-Umbau und ist explizit ausgeschlossen.

Keine CONTEXT.md vorhanden — es gab keine `issue:discuss`-Runde. Verbindlich
sind ausschliesslich die Vorgaben aus ISSUE.md; die Formulierung des
Beta-Satzes und das konkrete `last_verified`-Datum liegen laut RESEARCH.md in
Claude's Discretion und sind unten festgeschrieben.
</objective>

<strategy>
Die Aenderung ist rein deklarativ. `status` wird im gesamten `src/` nur an drei
Stellen gelesen, immer als simpler `!== 'live'`-Vergleich — es gibt keine
Filterung, Sortierung oder Gruppierung nach Status. `status: beta` im
Frontmatter genuegt also, damit Karte und Detailseite das
`gat-tag--warn`-Label automatisch rendern; `icewarp` und `personenwahl` machen
genau das heute schon. Kein Code, kein Schema, keine neue Abhaengigkeit.

Der einzige echte Fallstrick liegt beim Beschreibungstext, nicht beim Status:
`WerkzeugCard.astro:31-38` baut den Karten-Teaser aus dem **ersten Absatz** des
Markdown-Bodys und kuerzt ihn ab 180 Zeichen hart auf 177 + `...`. Der heutige
erste Absatz hat bereits 169 Zeichen. Daraus folgt die zentrale
Design-Entscheidung des Plans: der Beta-Hinweis wird als **fuehrender Satz in
denselben Absatz** gesetzt und der Absatz dabei gestrafft (Zielwert 160
Zeichen), statt angehaengt (waere abgeschnitten) oder als eigener Absatz
vorangestellt (wuerde die Werkzeug-Beschreibung komplett vom Teaser
verdraengen). Die E-Mail steht als Klartext, nicht als Markdown-Link — die
Teaser-Strip-Kette entfernt nur `**` und `` `code` ``, ein `[…](mailto:…)`
landet als roher Quelltext auf der Karte.

Der Plan ist deshalb bewusst zweistufig: Task 1 macht die Quelltext-Aenderung
und prueft sie mit einer 1:1 aus `WerkzeugCard.astro` nachgebauten
Teaser-Simulation (schnelles Gate, kein Build noetig). Task 2 baut die Site und
prueft das **gerenderte** Ergebnis in `dist/` — Warn-Tag auf Karte und
Detailseite, Beta-Hinweis ungekuerzt im Teaser. Das ist zugleich das
Akzeptanzkriterium „`pnpm run build` laeuft durch".
</strategy>

<context>
Issue: @.issues/mzu8v-gemeindefinanzen-im-verzeichnis-als-beta-kennzeichnen/ISSUE.md
Research: @.issues/mzu8v-gemeindefinanzen-im-verzeichnis-als-beta-kennzeichnen/RESEARCH.md

Keine `.claude/skills/` im Repo — kein Skill-Block.
Keine CLI-Oberflaeche betroffen (reine Content-Aenderung) — keine
Call-Site-Enumeration noetig.

<interfaces>
<!-- Executor: nutze diese Contracts direkt. Den Code NICHT nachschlagen und NICHT aendern. -->

// Aus src/content.config.ts — Zod-Schema der Collection `werkzeuge`
// (nur die fuer dieses Issue relevanten Felder)
status: z.enum(['live', 'beta', 'unreleased', 'unmaintained'])   // 'beta' ist bereits gueltig — KEIN Schema-Change
last_verified: z.date()                                          // YAML-Datum unquoted: 2026-08-26

// Aus src/components/WerkzeugCard.astro:31-38 — Teaser-Ableitung (LOAD-BEARING)
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

// Aus src/components/WerkzeugCard.astro:54-55 — Status-Tag auf der Karte
{entry.data.status !== 'live' && (
  <span class="gat-tag gat-tag--warn">{entry.data.status}</span>
)}

// Aus src/pages/werkzeug/[slug].astro:39 — Status-Tag im Detail-Header
{d.status !== 'live' && <span class="gat-tag gat-tag--warn">{d.status}</span>}
</interfaces>

Key files:
@src/content/werkzeuge/gemeindefinanzen.md — die einzige zu aendernde Datei
@src/components/WerkzeugCard.astro — NUR lesen/verstehen, nicht aendern (Teaser + Warn-Tag)
@src/pages/werkzeug/[slug].astro — NUR lesen/verstehen, nicht aendern (Warn-Tag)

Umgebungs-Hinweis (verifiziert): Im Container ist `NODE_ENV=production` gesetzt.
`pnpm install` ueberspringt dann devDependencies, und `pnpm run build` bricht im
`postbuild`-Hook mit `sh: 1: pagefind: not found` ab. Deshalb IMMER
`NODE_ENV= pnpm install --prod=false` vor dem Build. In GitHub Actions tritt das
nicht auf.
</context>

<commit_format>
Format: conventional mit Issue-Prefix (aus `.issues/config.yaml`:
`format: conventional`, `prefix: true`)
Beispiel: `mzu8v: docs(content): mark gemeindefinanzen as beta`
Pattern: `{issue-id}: {type}({scope}): {description}`
Commit-Betreff auf Englisch, Content-Text auf Deutsch. Keine Werkzeug-Attribution
(kein „Generated with", kein `Co-Authored-By`). Atomarer Commit — eine Datei.
</commit_format>

<tasks>

<task type="auto">
  <name>Task 1: Frontmatter auf beta setzen und Beta-Hinweis in Absatz 1 einbauen</name>
  <files>src/content/werkzeuge/gemeindefinanzen.md</files>
  <action>
  Genau drei Aenderungen in `src/content/werkzeuge/gemeindefinanzen.md`, sonst nichts.
  `title`, `slug`, `url`, `source`, `bereich`, `bundesland`, `categories`, `tags`,
  `related` und alle uebrigen Frontmatter-Felder bleiben unveraendert (Konsumenten-URLs
  sind laut CLAUDE.md Vertrag).

  1. Frontmatter: `status: live` -> `status: beta`.
     Ohne Anfuehrungszeichen, klein geschrieben. `"Beta"` oder `Beta` bricht das
     Zod-Enum und laesst den Build fehlschlagen.

  2. Frontmatter: `last_verified: 2026-05-24` -> `last_verified: 2026-08-26`.
     Unquoted ISO-Datum, wie in allen anderen Content-Dateien.

  3. Ersten Absatz des Bodys komplett ersetzen. Aktuell (direkt nach dem
     schliessenden `---`, drei Zeilen):

         Browserbasierte Analyse oesterreichischer Gemeindevoranschlaege und
         Rechnungsabschluesse nach **VRV 2015**. PDF wird clientseitig geparst,
         Daten verlassen den Browser nicht.

     Neu — exakt dieser Wortlaut und dieser Zeilenumbruch:

         **Beta-Phase** — Rueckmeldungen an florian.motlik@gruene.at.
         Browserbasierte Analyse oesterreichischer Gemeindevoranschlaege und
         Rechnungsabschluesse nach **VRV 2015**.

  Warum genau so (nicht "verbessern"):
  - Der Beta-Satz steht VORNE im selben Absatz. Angehaengt waere er auf der Karte
    abgeschnitten (verifiziert: Teaser endete bei „… Beta-Ph…"), als eigener
    vorangestellter Absatz wuerde er den kompletten Karten-Teaser ersetzen und
    die Werkzeug-Beschreibung von allen Listenseiten verdraengen.
  - Der Absatz misst nach dem Strippen der `**` exakt 160 Zeichen und bleibt
    damit unter der 180-Zeichen-Kuerzungsgrenze aus `WerkzeugCard.astro:38`.
  - Die E-Mail steht als KLARTEXT. Kein `[florian.motlik@gruene.at](mailto:...)`
    und kein sonstiger Markdown-Link in Absatz 1 — die Strip-Kette entfernt keine
    Link-Syntax, der Rohtext mit eckigen Klammern landete auf der Karte.
  - Der weggefallene Halbsatz „PDF wird clientseitig geparst, Daten verlassen den
    Browser nicht." ist kein Verlust: die bestehende `## Datenschutz`-Sektion
    deckt das ab. Sie NICHT anfassen und den Satz NICHT anderswo wieder einfuegen.
  - Schreibweise: die Datei ist durchgaengig ASCII-transliteriert
    (`oesterreichischer`, `Rueckmeldungen`). Keine echten Umlaute einmischen.
    Das `—` ist ein Geviertstrich (U+2014), wie sonst in der Datei auch.

  Alle uebrigen Absaetze und Sektionen (`## Was macht das Werkzeug`,
  `## Wann nutzen`, `## Wann NICHT nutzen`, `## Datenschutz`,
  `## Lizenz & Kosten`) bleiben unveraendert. Keine weitere Datei anfassen.
  </action>
  <verify>
  <automated>
python3 - <<'PY'
import re, sys
p = "src/content/werkzeuge/gemeindefinanzen.md"
raw = open(p, encoding="utf-8").read()
fm, body = re.match(r"^---\n(.*?)\n---\n(.*)$", raw, re.S).groups()
fail = []
if not re.search(r"^status: beta$", fm, re.M):
    fail.append("frontmatter: status ist nicht 'beta'")
if not re.search(r"^last_verified: 2026-08-26$", fm, re.M):
    fail.append("frontmatter: last_verified ist nicht 2026-08-26")
# Teaser-Logik 1:1 aus WerkzeugCard.astro:31-38
para = next((s.strip() for s in re.split(r"\n{2,}", body)
             if s.strip() and not s.strip().startswith("#")
             and not s.strip().startswith("---")), "")
teaser = re.sub(r"`([^`]+)`", r"\1", para.replace("**", "").replace("\n", " "))
if len(teaser) > 180:
    fail.append(f"Absatz 1 ist {len(teaser)} Zeichen -> Karten-Teaser wird gekuerzt (max 180)")
if "Beta" not in teaser:
    fail.append("Absatz 1 enthaelt keinen Beta-Hinweis")
if "florian.motlik@gruene.at" not in teaser:
    fail.append("Absatz 1 nennt die Support-Adresse nicht")
if "[" in para or "](" in para:
    fail.append("Absatz 1 enthaelt Markdown-Link -> landet als Rohtext auf der Karte")
print(f"Teaser ({len(teaser)} Zeichen): {teaser}")
if fail:
    print("FAIL:")
    for f in fail:
        print("  -", f)
    sys.exit(1)
print("TASK 1 OK")
PY
  </automated>
  </verify>
  <done>
  - `status: beta` und `last_verified: 2026-08-26` stehen im Frontmatter
  - Absatz 1 beginnt mit dem Beta-Hinweis und nennt `florian.motlik@gruene.at` als Klartext
  - Absatz 1 misst nach dem Strippen 160 Zeichen (< 180) — Teaser wird nicht gekuerzt
  - Kein Markdown-Link in Absatz 1
  - Kein anderes Frontmatter-Feld und keine andere Datei veraendert
  - Das Verify-Skript gibt `TASK 1 OK` aus und beendet mit Exit 0
  </done>
</task>

<task type="auto">
  <name>Task 2: Build ausfuehren und gerendertes Beta-Tag in dist/ verifizieren</name>
  <files>src/content/werkzeuge/gemeindefinanzen.md</files>
  <action>
  Keine Quelltext-Aenderung in diesem Task — hier wird die Wirkung von Task 1
  gebaut und am gerenderten HTML geprueft. Das ist zugleich das Akzeptanzkriterium
  „`pnpm run build` laeuft durch".

  1. Abhaengigkeiten inklusive devDependencies installieren:
     `NODE_ENV= pnpm install --prod=false`
     Das fuehrende `NODE_ENV=` ist zwingend — mit dem im Container gesetzten
     `NODE_ENV=production` ueberspringt pnpm devDependencies, `pagefind` fehlt und
     der `postbuild`-Hook bricht mit `sh: 1: pagefind: not found` ab.
  2. `NODE_ENV= pnpm run build` — Astro baut nach `dist/`, der `postbuild`-Hook
     indexiert mit Pagefind. Dabei validiert Astro auch das Zod-Schema der
     Content-Collection; ein ungueltiger `status` faellt hier auf.
  3. Das Ergebnis in `dist/` pruefen (macht das Verify-Skript automatisch):
     - `dist/index.html`: die Gemeindefinanzen-Karte traegt
       `<span class="gat-tag gat-tag--warn">beta</span>`
     - der Karten-Teaser enthaelt „Beta" und endet NICHT auf `...`
     - `dist/werkzeug/gemeindefinanzen/index.html`: Warn-Tag im Detail-Header

  Falls das Verify-Skript die Karte nicht findet (`Karte ... nicht gefunden`),
  liegt das an geaendertem Markup, nicht an einem Content-Fehler — dann in
  `dist/index.html` nach `werkzeug/gemeindefinanzen/` greppen und die drei
  Merkmale von Hand bestaetigen. NICHT `WerkzeugCard.astro` anpassen.

  `dist/`, `node_modules/`, `.astro/` und `.pagefind/` sind in `.gitignore` —
  Build-Artefakte gehoeren nicht in den Commit.
  </action>
  <verify>
  <automated>
NODE_ENV= pnpm install --prod=false && NODE_ENV= pnpm run build && python3 - <<'PY'
import re, sys
fail = []
idx = open("dist/index.html", encoding="utf-8").read()
m = re.search(
    r'<a class="werkzeug-card"[^>]*href="[^"]*werkzeug/gemeindefinanzen/"[^>]*>(.*?)</a>',
    idx, re.S)
if not m:
    fail.append("Gemeindefinanzen-Karte in dist/index.html nicht gefunden")
else:
    card = m.group(1)
    if 'gat-tag gat-tag--warn">beta<' not in card:
        fail.append("Karte zeigt kein beta-Warn-Tag")
    d = re.search(r'<p class="werkzeug-card__desc">(.*?)</p>', card, re.S)
    if not d:
        fail.append("Karte hat keinen Teaser")
    else:
        desc = d.group(1).strip()
        print("Karten-Teaser:", desc)
        if "Beta" not in desc:
            fail.append("Beta-Hinweis fehlt im Karten-Teaser")
        if desc.endswith("..."):
            fail.append("Karten-Teaser wurde gekuerzt (endet auf '...')")
        if "[" in desc:
            fail.append("Markdown-Link leakt als Rohtext in den Teaser")
detail = open("dist/werkzeug/gemeindefinanzen/index.html", encoding="utf-8").read()
if 'gat-tag gat-tag--warn">beta<' not in detail:
    fail.append("Detailseite zeigt kein beta-Warn-Tag")
if fail:
    print("FAIL:")
    for f in fail:
        print("  -", f)
    sys.exit(1)
print("TASK 2 OK")
PY
  </automated>
  </verify>
  <done>
  - `NODE_ENV= pnpm run build` laeuft ohne Fehler durch (Astro-Build + Pagefind-Index)
  - `dist/index.html`: Gemeindefinanzen-Karte enthaelt `gat-tag gat-tag--warn">beta`
  - Karten-Teaser enthaelt „Beta", endet nicht auf `...`, enthaelt keine `[`-Rohtext-Links
  - `dist/werkzeug/gemeindefinanzen/index.html` enthaelt `gat-tag gat-tag--warn">beta`
  - Das Verify-Skript gibt `TASK 2 OK` aus und beendet mit Exit 0
  - Keine Build-Artefakte im Commit (`dist/`, `node_modules/` sind gitignored)
  </done>
</task>

</tasks>

<verification>
Abschluss-Checks nach allen Tasks:
- `NODE_ENV= pnpm install --prod=false && NODE_ENV= pnpm run build` laeuft gruen durch
- `git status --short` zeigt genau eine geaenderte Datei:
  `src/content/werkzeuge/gemeindefinanzen.md` (plus die Issue-Artefakte unter
  `.issues/`, falls `commit_artifacts` greift) — keine Aenderung an
  `src/components/`, `src/pages/` oder `src/content.config.ts`
- `git diff -- src/ | grep -c '^+++'` ergibt `1`
Es gibt in diesem Repo keine Unit-Test-Suite und keinen Linter; `pnpm run check`
(`astro check`) wird NICHT verwendet — `@astrojs/check` und `typescript` sind
nicht installiert und wuerden einen interaktiven Install ausloesen.
</verification>

<success_criteria>
Bildet 1:1 die Akzeptanzkriterien aus ISSUE.md ab:
- `status: beta` im Frontmatter, und das Beta-Tag erscheint gerendert sowohl auf
  der Karte (`dist/index.html`) als auch auf der Detailseite
  (`dist/werkzeug/gemeindefinanzen/index.html`)
- Der Beta-Hinweis steht im ERSTEN Absatz der Beschreibung (nicht weiter unten)
  und erscheint ungekuerzt im Karten-Teaser, inklusive Support-Adresse
  `florian.motlik@gruene.at` als Klartext
- `pnpm run build` laeuft durch (im Container: `NODE_ENV= pnpm run build`)
Zusaetzlich aus den Constraints:
- `last_verified` ist auf `2026-08-26` aktualisiert
- Nur Content-/Frontmatter-Aenderung — keine Komponenten-Datei angefasst
- Conventional Commit mit Issue-Prefix, keine Werkzeug-Attribution
</success_criteria>
