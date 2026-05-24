// Kategorien fuer das Werkzeug-Verzeichnis.
// Die ID ist URL-safe (kategorie/<id>/), das Label wird im UI angezeigt.
export const KATEGORIEN: Record<string, string> = {
  'daten-analyse':    'Daten & Analyse',
  'kommunikation':    'Kommunikation & Outreach',
  'kollaboration':    'Kollaboration & Doku',
  'visualisierung':   'Visualisierung & Karten',
  'beteiligung':      'Beteiligung & Demokratie',
  'veranstaltung':    'Veranstaltungs-Management',
  'branding-druck':   'Branding & Druck',
  'wissen-recht':     'Wissen & Recht',
  'kampagne':         'Kampagnen & Mobilisierung',
  'verwaltung':       'Verein & Verwaltung',
};

export function kategorieLabel(id: string): string {
  return KATEGORIEN[id] ?? id;
}

export const KATEGORIE_IDS = Object.keys(KATEGORIEN);
