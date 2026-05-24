---
title: Gemeindefinanzen
slug: gemeindefinanzen
url: https://gemeindefinanzen.gruene.at
source: https://github.com/GrueneAT/gemeindefinanzen
own_tool: true
status: live
maintained_by: GrueneAT
hosted_by: GrueneAT (GitHub Pages)
license: MIT
language: de
categories:
  - daten-analyse
  - wissen-recht
audience:
  - gemeindegruppe
  - kandidat-in
  - mandatar-in
tags:
  - vrv-2015
  - voranschlag
  - rechnungsabschluss
  - finanzen
  - kommunalpolitik
related:
  - vorlagen
last_verified: 2026-05-24
---

Browserbasierte Analyse oesterreichischer Gemeindevoranschlaege und
Rechnungsabschluesse nach **VRV 2015**. PDF wird clientseitig geparst,
Daten verlassen den Browser nicht.

## Was macht das Werkzeug

Lade ein Gemeindebudget-PDF (Voranschlag oder Rechnungsabschluss) hoch und
das Tool extrahiert die strukturierten Tabellen, baut Kennzahlen und
Diagramme:

- Lagebild (Ertraege, Aufwendungen, Personal-Quote, Nettoergebnis)
- Einnahmen- und Ausgabenstruktur (Sankey, Treemap, Wasserfall)
- Mehrjahres-Vergleich, Trend-Eckwerte
- Detailposten-Suche ueber alle Aufgabenbereiche
- Druck-Stylesheet fuer Auswertungs-Reports

Mehrere Dokumente (z. B. RA 2024 + VA 2025 + NVA 2025) lassen sich
parallel halten und gegenueberstellen.

## Wann nutzen

- Pruefen, wo eine Gemeinde investiert (Klima? Bildung? Verwaltung?)
- Trends ueber mehrere Jahre erkennen
- Konkrete Posten finden (Aufgabenbereich `010`, Konto `7281`, ...)
- Auswertungen fuer Gemeinderats-Sitzungen vorbereiten

## Wann NICHT nutzen

- Fuer Voranschlaege ausserhalb des **VRV-2015-Schemas** (vor 2020) — die
  Parser-Logik ist auf das neue Format ausgelegt
- Fuer Buchungsdetails unterhalb der Konto-Ebene — die Quellen-PDFs
  liefern nicht mehr als das Tool zeigt
- Als juristisch verbindliche Auswertung — bleibt analytische
  Unterstuetzung, kein Ersatz fuer Pruefungsorgane

## Datenschutz

**Alles on-device.** Das PDF wird im Browser geparst, keine Daten gehen an
Server. Keine Cookies, kein Tracking. Die App laedt nur statisches HTML/
CSS/JS von GitHub Pages.

## Lizenz & Kosten

MIT, kostenlos. Self-Host moeglich (ist eine statische Site).
