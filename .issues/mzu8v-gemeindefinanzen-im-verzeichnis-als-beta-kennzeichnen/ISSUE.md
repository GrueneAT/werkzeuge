---
id: mzu8v
title: Gemeindefinanzen im Verzeichnis als Beta kennzeichnen
status: open
priority: medium
labels:
- documentation
remote:
- source: github
  id: '20'
  url: https://github.com/GrueneAT/werkzeuge/issues/20
---

Das Gemeindefinanzen-Werkzeug ist noch Beta, steht im Verzeichnis aber auf
`status: live` — im Verzeichnis ist damit nirgends erkennbar, dass das Tool
noch nicht stabil ist. Rueckmeldung aus dem Anwenderfeedback: der Beta-Stand soll
schon dort sichtbar sein, wo man das Werkzeug zuerst sieht.

## Was zu tun ist

1. `src/content/werkzeuge/gemeindefinanzen.md`: `status: live` -> `status: beta`.
   Karte und Detailseite rendern dann automatisch das `gat-tag--warn`-Label
   („beta"), siehe `src/components/WerkzeugCard.astro:51` und
   `src/pages/werkzeug/[slug].astro:39`.
2. Im Beschreibungstext gleich im ersten Absatz sagen, dass das Werkzeug in
   der Beta-Phase ist und wohin Rueckmeldungen gehen (Support-Adresse aus dem
   Tool: florian.motlik@gruene.at).
3. `last_verified` aktualisieren.

Gegenstueck im Tool selbst: siehe Issue im Repo `gemeindefinanzen`
(Beta-Hinweis in Ueberschrift + grosser Hinweis beim Oeffnen).

## Akzeptanzkriterien

- [ ] `status: beta` im Frontmatter, Beta-Tag erscheint auf Karte und Detailseite
- [ ] Beta-Hinweis steht im ersten Absatz der Beschreibung, nicht erst weiter unten
- [ ] `pnpm run build` laeuft durch

## Constraints

- Nur Content-/Frontmatter-Aenderung, keine Komponenten-Umbauten noetig
- Conventional Commit, keine Werkzeug-Attribution
