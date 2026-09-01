---
id: udcdm
title: Fuenf Werkzeuge entfernen, Default auf Alle, Impressum und Datenschutz verlinken
status: open
priority: high
labels:
- enhancement
remote:
- source: github
  id: '22'
  url: https://github.com/GrueneAT/werkzeuge/issues/22
---

Drei Aenderungen am Werkzeug-Verzeichnis, die zusammen ausgeliefert werden.

## 1. Fuenf Eintraege entfernen

Aus dem Verzeichnis nehmen:

| Eintrag | Datei | Grund |
|---|---|---|
| Bildgenerator | `src/content/werkzeuge/bildgenerator.md` | — |
| Vorlagen | `src/content/werkzeuge/vorlagen.md` | — |
| Bundesbuero-Server | `src/content/werkzeuge/bundesbuero-server.md` | — |
| Gemeindeordnung | `src/content/werkzeuge/gemeindeordnung.md` | laut Rueckmeldung liefert das Werkzeug teils falsche Auskuenfte |
| Gemeindefinanzen | `src/content/werkzeuge/gemeindefinanzen.md` | es soll stattdessen das interne Werkzeug verwendet werden |

Geprueft (gegen `origin/main`): Alle `related`-Verweise auf diese fuenf liegen
innerhalb der fuenf selbst. Nach der Entfernung bleiben **keine haengenden
Verweise** zurueck — trotzdem nach dem Build gegenpruefen, nicht annehmen.

Bestand danach: 16 statt 21 Eintraege.

    standardtools (4): cloud, gruen-aktiv, icewarp, listen
    sonstiges     (7): ggs-noe, gruenerator, jitsi-netzbegruenung-at, nuudel,
                       openauthenticator, termino-gv-at, textbegruenung
    admin         (3): helpdesk, respond, voting
    eigene-tools  (1): personenwahl
    bundesbuero   (1): passbolt

## 2. Voreinstellung von „Highlights" auf „Alle"

`src/components/FilterBar.astro`: Der Chip „Alle" ist beim Laden aktiv statt
„Highlights" — betrifft `aria-pressed` an beiden Chips (Zeile ~28/29) und den
Startwert von `state` im Skript (Zeile ~73, heute `{ facet: 'highlights' }`).
Der Chip „Highlights" bleibt als waehlbare Ansicht erhalten.

Der Text auf der Startseite behauptet die alte Voreinstellung an zwei Stellen
und muss mit:
- `src/pages/index.astro` Hero-Absatz: „Standardmaessig siehst du die
  **Highlights** …"
- `src/pages/index.astro` Zeile ~58: „{highlightCount} Highlights von
  {all.length} Werkzeugen." — mit „Alle" als Default ist die fuehrende Zahl
  irrefuehrend.

Hintergrund: Durch die Entfernungen faellt `eigene-tools` auf einen einzigen
Eintrag; „Highlights" (Standardtools + eigene Werkzeuge) zeigt dann nur noch
5 von 16 Werkzeugen. Als Voreinstellung waere das mehr Versteck als Hilfe.

## 3. Impressum und Datenschutzerklaerung verlinken

Der Footer (`src/layouts/Base.astro`, `.werkzeuge-footer`) traegt heute nur den
Vorschlags-Link. Er bekommt zusaetzlich:

- **Impressum** -> `https://gruene.at/impressum/`
- **Datenschutzerklaerung** -> `https://gruene.at/datenschutzerklarung/`

Beide URLs sind geprueft (HTTP 200, Titel „Impressum - Die Gruenen" bzw.
„Datenschutzerklaerung - Die Gruenen"). Aussenlinks wie im Repo ueblich
kennzeichnen (`rel="noopener"`), auf allen Seiten sichtbar, da der Footer im
Layout steckt.

## Akzeptanzkriterien

- [ ] Die fuenf Eintraege sind aus `src/content/werkzeuge/` entfernt und
      erscheinen weder auf der Startseite noch im Verzeichnis noch als
      Detailseite
- [ ] Kein `related`-Eintrag zeigt mehr auf einen entfernten Slug; die
      Backlink-Sektion bricht nirgends
- [ ] Die Volltextsuche (Pagefind) findet keinen der fuenf mehr
- [ ] Beim Laden der Startseite ist „Alle" aktiv, alle 16 Werkzeuge sind
      sichtbar; „Highlights" bleibt anwaehlbar und funktioniert
- [ ] Kein Text auf der Startseite behauptet mehr, Highlights seien die
      Voreinstellung
- [ ] Footer traegt Impressum- und Datenschutz-Link auf jeder Seite, beide
      fuehren auf die offiziellen Seiten auf gruene.at
- [ ] `pnpm run build` laeuft ohne Fehler durch

## Constraints

- Kein Vendoring, DS bleibt Cross-CDN
- Conventional Commit, keine Werkzeug-Attribution
