// Org-Bereiche fuer das Werkzeug-Verzeichnis. Orthogonal zu den fachlichen
// `kategorien` — der Bereich ordnet ein Tool organisatorisch ein und steuert
// die Sortierung/Gruppierung auf der Startseite.
//
// Reihenfolge = Anzeige-Reihenfolge (Standardtools ganz oben).
export const BEREICHE: Record<string, string> = {
  'standardtools': 'Standardtools',
  'eigene-tools': 'Eigene Werkzeuge',
  'admin': 'Für Admins',
  'bundesbuero': 'Bundesbüro',
  'sonstiges': 'Sonstiges',
};

export const BEREICH_IDS = Object.keys(BEREICHE);

export function bereichLabel(id: string): string {
  return BEREICHE[id] ?? id;
}

// Sortier-Index fuer einen Bereich (kleiner = weiter oben).
export function bereichOrder(id: string): number {
  const i = BEREICH_IDS.indexOf(id);
  return i === -1 ? BEREICH_IDS.length : i;
}

// Default-"Highlights"-Set: das, was die Startseite vor dem Filtern zeigt,
// damit die Liste nicht von Anfang an alle Tools auf einmal ausspielt.
export const HIGHLIGHT_BEREICHE = ['standardtools', 'eigene-tools'];

export function istHighlight(bereich: string): boolean {
  return HIGHLIGHT_BEREICHE.includes(bereich);
}
