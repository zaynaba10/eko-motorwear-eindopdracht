/**
 * Prijsnotatie zoals op de website (Belgisch): komma i.p.v. punt.
 * Eén plek voor alle prijzen, zodat app en site consistent blijven.
 */
export function euro(bedrag: number): string {
  return '€ ' + bedrag.toFixed(2).replace('.', ',');
}

/**
 * Korte prijsnotatie voor de productkaarten op het startscherm:
 * ronde bedragen als "950,-", andere bedragen als "99,95".
 */
export function prijsKort(bedrag: number): string {
  return Number.isInteger(bedrag)
    ? `${bedrag},-`
    : bedrag.toFixed(2).replace('.', ',');
}

const MAANDEN = [
  'jan', 'feb', 'mrt', 'apr', 'mei', 'jun',
  'jul', 'aug', 'sep', 'okt', 'nov', 'dec',
];

/** Korte datum voor de inspiratiekaarten, bv. "18 aug '26". */
export function datumKort(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const jaar = String(d.getFullYear()).slice(-2);
  return `${d.getDate()} ${MAANDEN[d.getMonth()]} '${jaar}`;
}
