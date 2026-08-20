/**
 * Maten per hoofdcategorie, zoals in de winkel gevoerd. Eén bron voor de
 * productpagina en de verlanglijst, zodat beide dezelfde maten tonen.
 */
export const MATEN: Record<string, string[]> = {
  motorkledij: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  handschoenen: ['S', 'M', 'L', 'XL'],
  helmet: ['XS', 'S', 'M', 'L', 'XL'],
  laarzen: ['40', '41', '42', '43', '44', '45', '46'],
  'protection-set': ['S', 'M', 'L', 'XL'],
};

/** Maten van een hoofdcategorie; undefined wanneer maat niet van toepassing is. */
export function matenVoorSlug(slug?: string): string[] | undefined {
  return slug ? MATEN[slug] : undefined;
}
