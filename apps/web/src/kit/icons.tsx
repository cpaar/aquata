/** Linien-Icons, 24er Raster, 1,4 px Strich. Farbe kommt immer aus currentColor. */
const PATHS = {
  bruecke: 'M3 18h18 M5 18V11a7 7 0 0 1 14 0v7 M12 4V2 M9 11h6',
  karte: 'M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z M9 4v14 M15 6v14',
  flotten: 'M3 14c3-4 6-5 10-5 3 0 6 1 8 3-2 2-5 3-8 3-4 0-7-1-10-1z M13 9l2-3h2 M6 13l-3-3',
  station: 'M4 20V10l8-6 8 6v10z M9 20v-5h6v5 M4 10h16',
  komm: 'M4 5h16v10H9l-5 4z M8 9h8 M8 12h5',
  werft: 'M3 15h18l-3 5H6z M7 15V9h4v6 M13 15V5h4v10',
  antrieb: 'M12 10a2 2 0 1 0 0.01 0 M12 10C11 6 12 3 14 3 M14 12c4-1 7 0 7 2 M12 14c1 4 0 7-2 7 M10 12c-4 1-7 0-7-2',
  sonar: 'M12 20a1 1 0 1 0 0.01 0 M8 16a5.6 5.6 0 0 1 8 0 M5 13a10 10 0 0 1 14 0 M2 10a14 14 0 0 1 20 0',
  sammler: 'M5 16a3 3 0 1 0 6 0a3 3 0 1 0-6 0 M13 16a3 3 0 1 0 6 0a3 3 0 1 0-6 0 M8 13V7h8v6 M8 7l4-3 4 3',
  angriff: 'M4 20L14 10 M10 4l10 10 M14 4h6v6 M4 14l6 6',
  rueckkehr: 'M9 14L4 9l5-5 M4 9h10a6 6 0 0 1 0 12h-3',
  bericht: 'M6 3h9l4 4v14H6z M14 3v5h5 M9 12h7 M9 16h5',
  warnung: 'M12 3l10 18H2z M12 10v5 M12 18v.01',
  uhr: 'M12 21a9 9 0 1 0 0-18a9 9 0 1 0 0 18 M12 7v5l3 2',
  plus: 'M12 5v14 M5 12h14',
  pfeil: 'M9 6l6 6-6 6',
  schliessen: 'M6 6l12 12 M18 6L6 18',
} as const;

export type IconName = keyof typeof PATHS;

export const Icon = ({ name, size }: { name: IconName; size?: number }) => (
  <svg className="k-icon" viewBox="0 0 24 24" aria-hidden="true" style={size ? { width: size, height: size } : undefined}>
    <path d={PATHS[name]} />
  </svg>
);
