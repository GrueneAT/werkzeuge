---
title: Vorlagen
slug: vorlagen
url: https://grueneat.github.io/vorlagen/
source: https://github.com/GrueneAT/vorlagen
own_tool: true
status: live
maintained_by: GrueneAT
hosted_by: GrueneAT (GitHub Pages)
license: MIT
language: de
categories:
  - branding-druck
audience:
  - gemeindegruppe
  - landesgruppe
  - kandidat-in
tags:
  - druck
  - flyer
  - plakat
  - schriften
  - falzflyer
  - scribus
related:
  - bildgenerator
last_verified: 2026-05-24
---

Druckfertige **Templates** (Scribus, IDML, PDF) im Gruene-AT-Branding plus
Vergleichs-Galerie fuer freie Gotham-Ersatzschriften — zusaetzlich
experimentelle Voting-Engine fuer Vorlagen-Bewertung.

## Was macht das Werkzeug

- **Template-Galerie:** Flyer A4/A5/A6, Falzflyer, Plakate A3/A2, Sticker,
  jeweils in Hochformat und Querformat, mit Branding-konformen Farben und
  Schriften
- **Schriften-Vergleich:** freie Open-Source-Schriften (Tahoma-Ersatz,
  Gotham-Alternativen) gegenuebergestellt mit Beispieltext, Lesbarkeits-
  Lozenges und Lizenz-Hinweisen
- **Voting-Engine** (experimentell): mehrere Personen koennen Templates
  vergleichen und ranken (mailto-Submission, localStorage-Persistenz)
- **Source-Files** zum Download (Scribus `.sla`, InDesign `.idml`, PDF)

## Wann nutzen

- Druck-Aktionen vorbereiten (Plakat fuer Stand, Falzflyer fuer
  Veranstaltungen, Sticker fuer Stiegen-Wahlkampf)
- Branding-Konsistenz pruefen, bevor an die Druckerei geliefert wird
- Schrift fuer eigene Materialien auswaehlen (Lizenz-konform)
- Vorlagen-Variantensystem testen (Voting, Schriftvergleich)

## Wann NICHT nutzen

- Fuer Marken jenseits Gruene AT — Templates sind brand-spezifisch
- Fuer Social-Media-Material — dafuer ist `bildgenerator` da
- Als Print-Auftrag-Service — Vorlagen sind Templates, die Druckerei
  bleibt extern

## Datenschutz

Statische Site, keine Server-Interaktion. Voting-Engine persistiert
lokal im localStorage des Browsers; Submission per `mailto:` (oeffnet
lokalen Mail-Client).

## Lizenz & Kosten

MIT fuer den Code. Schriften und Bild-Assets folgen ihren jeweiligen
Lizenzen (SIL OFL fuer freie Schriften, Markenrechte fuer Gruene-Logo).
Kostenlos.
