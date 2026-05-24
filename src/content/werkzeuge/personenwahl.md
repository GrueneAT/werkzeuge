---
title: Personenauswahl (Buergerinnenrat)
slug: personenwahl
url: https://flomotlik.github.io/buergerinnenrat/
source: https://github.com/flomotlik/buergerinnenrat
own_tool: true
status: beta
maintained_by: flomotlik (Gruene-AT-naher Entwickler)
hosted_by: GitHub Pages
license: MIT  # Iteration 1; spaetere Iterationen ggf. GPL-3.0
language: de
categories:
  - beteiligung
audience:
  - gemeindegruppe
  - landesgruppe
  - bundesgruppe
tags:
  - sortition
  - buergerinnenrat
  - delegierten-wahl
  - stratifikation
  - statistik
related: []
last_verified: 2026-05-24
---

Browser-native, **backend-lose** Sortition-Web-App. Stratifizierte
Zufallsauswahl plus Maximin-Panel-Optimierung — fuer Buergerinnenraete,
Delegierten-Auswahl, Vereins-Gremien.

## Was macht das Werkzeug

- **Stage-1 Versand-Sampler:** stratifizierte Zufallsauswahl auf
  Melderegister-Feldern (Hamilton-/Largest-Remainder + Fisher-Yates)
- **Stage-3 Panel-Optimierung:** Maximin-Heuristik mit HiGHS-Solver im
  Browser (WASM), erfuellt Quoten so „fair wie moeglich" gleichzeitig
- **CSV-Import** mit interaktivem Mapping
- **Audit-Manifest** mit Ed25519/ECDSA-Signatur — Verifier reproduziert
  die Auswahl
- **Override-Editor** (manuelle 1-D-Achsen-Anpassung) mit Begruendungs-
  Pflicht und Audit-Spur

## Wann nutzen

- Buergerinnenrat zusammenstellen (60–300 Personen, demografisch
  ausgewogen aus einem groesseren Pool)
- Delegierte fuer Landeskonferenz oder Bundestag via Zufalls-Auswahl
- Themen-Panel fuer kommunale Beteiligungsprozesse
- Demonstration der Methodik gegenueber Stakeholdern (Audit-Output ist
  manipulationsresistent signiert)

## Wann NICHT nutzen

- Fuer Wahlen mit politischer Stimmabgabe (es ist eine **Auswahl-Methode**,
  kein Wahl-System)
- Wenn der Pool > 50 000 Personen ist — Stage 1 ist O(N), aber Stage 3
  rechnet im Browser, sehr grosse Panels werden zaehfluessig
- Ohne juristische Pruefung des Melderecht-Pfades — in Oesterreich
  Meldegesetz 1991 §16, in DE Bundesmeldegesetz §46

## Datenschutz

Vollstaendig **on-device**. Die CSV bleibt im Browser, Engine A laeuft
clientseitig (TS+highs-js), keine Daten an Server. Audit-Manifest wird
clientseitig signiert.

## Lizenz & Kosten

Iteration 1: MIT. Spaetere Iteration 2 mit Pyodide-Bundle koennte aus
Lizenz-Gruenden auf GPL-3.0 wechseln muessen (Solver-Combined-Work).
Kostenlos, self-host moeglich.

## Hinweis

Beta-Status: Engine A (Maximin) ist produktiv, Engine B (Leximin) wartet
auf Iteration 2 und juristische Klaerung. Bitte vor produktivem Einsatz
mit dem Maintainer abstimmen.
