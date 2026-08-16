/**
 * Prijsnotatie zoals op de website (Belgisch): komma i.p.v. punt.
 * Eén plek voor alle prijzen, zodat app en site consistent blijven.
 */
export function euro(bedrag: number): string {
  return '€ ' + bedrag.toFixed(2).replace('.', ',');
}
