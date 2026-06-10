// Bundesland-Codes fuer landesspezifische Werkzeuge. Tools ohne Eintrag gelten
// als bundesweit. Der Bundesland-Filter auf der Startseite erscheint nur, wenn
// ueberhaupt landesspezifische Tools vorhanden sind.
export const BUNDESLAENDER: Record<string, string> = {
  'bgld': 'Burgenland',
  'ktn': 'Kärnten',
  'noe': 'Niederösterreich',
  'ooe': 'Oberösterreich',
  'sbg': 'Salzburg',
  'stmk': 'Steiermark',
  'tirol': 'Tirol',
  'vlbg': 'Vorarlberg',
  'wien': 'Wien',
};

export const BUNDESLAND_IDS = Object.keys(BUNDESLAENDER);

export function bundeslandLabel(id: string): string {
  return BUNDESLAENDER[id] ?? id;
}
