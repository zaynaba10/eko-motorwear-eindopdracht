import { useSyncExternalStore } from 'react';

/**
 * Winkelmand — gedeelde staat voor de hele app. Hetzelfde principe als de
 * verlanglijst: één bron voor de productpagina, het mandje-tabblad en het
 * telbolletje op de tabbalk. Ook de kortingscode leeft hier.
 */

export type MandItem = {
  productId: string;
  maat?: string;
  aantal: number;
};

export type Voucher = {
  code: string;
  procent: number;
};

type MandStaat = {
  items: MandItem[];
  voucher: Voucher | null;
};

/** Maximaal aantal stuks per artikel in één bestelling. */
export const MAX_PER_ARTIKEL = 3;

/** Gratis verzending vanaf dit bedrag, zoals op de website. */
export const GRATIS_VERZENDING_VANAF = 40;

/** Verzendkosten onder de drempel. */
export const VERZENDKOSTEN = 4.95;

/** Kortingscodes die de app aanvaardt. */
const GELDIGE_CODES: Record<string, number> = {
  EKO10: 10,
  WELKOM5: 5,
};

let staat: MandStaat = { items: [], voucher: null };
const luisteraars = new Set<() => void>();

function zet(nieuw: Partial<MandStaat>) {
  staat = { ...staat, ...nieuw };
  luisteraars.forEach((fn) => fn());
}

function abonneer(fn: () => void) {
  luisteraars.add(fn);
  return () => {
    luisteraars.delete(fn);
  };
}

function lees(): MandStaat {
  return staat;
}

/** Sleutel van een regel: hetzelfde product in een andere maat is een aparte regel. */
export function mandSleutel(item: MandItem): string {
  return `${item.productId}|${item.maat ?? ''}`;
}

/** Huidige inhoud van de winkelmand. */
export function winkelmand(): MandItem[] {
  return staat.items;
}

/** Totaal aantal artikelen (voor het bolletje op de tabbalk). */
export function mandAantal(): number {
  return staat.items.reduce((som, i) => som + i.aantal, 0);
}

/** Legt een product in de mand, of verhoogt het aantal als het er al ligt. */
export function voegToeAanMand(productId: string, maat?: string) {
  const bestaat = staat.items.find((i) => i.productId === productId && i.maat === maat);
  zet({
    items: bestaat
      ? staat.items.map((i) =>
          i === bestaat ? { ...i, aantal: Math.min(MAX_PER_ARTIKEL, i.aantal + 1) } : i
        )
      : [...staat.items, { productId, maat, aantal: 1 }],
  });
}

/** Aantal aanpassen met + of −; minimum 1, maximum MAX_PER_ARTIKEL. */
export function wijzigAantal(sleutel: string, verschil: number) {
  zet({
    items: staat.items.map((i) =>
      mandSleutel(i) === sleutel
        ? { ...i, aantal: Math.min(MAX_PER_ARTIKEL, Math.max(1, i.aantal + verschil)) }
        : i
    ),
  });
}

/** Regel uit de mand halen. */
export function verwijderUitMand(sleutel: string) {
  zet({ items: staat.items.filter((i) => mandSleutel(i) !== sleutel) });
}

/** Mand leegmaken, bv. na het plaatsen van een bestelling. */
export function leegMand() {
  zet({ items: [], voucher: null });
}

/** Actieve kortingscode. */
export function actieveVoucher(): Voucher | null {
  return staat.voucher;
}

/** Kortingscode toevoegen. Geeft false terug bij een onbekende code. */
export function zetVoucher(code: string): boolean {
  const schoon = code.trim().toUpperCase();
  const procent = GELDIGE_CODES[schoon];
  if (!procent) return false;
  zet({ voucher: { code: schoon, procent } });
  return true;
}

/** Kortingscode verwijderen. */
export function wisVoucher() {
  zet({ voucher: null });
}

/** Berekent subtotaal, korting, verzendkosten en totaal. */
export function berekenTotalen(subtotaal: number) {
  const korting = staat.voucher ? (subtotaal * staat.voucher.procent) / 100 : 0;
  const naKorting = subtotaal - korting;
  const verzending =
    naKorting === 0 || naKorting >= GRATIS_VERZENDING_VANAF ? 0 : VERZENDKOSTEN;
  return { subtotaal, korting, verzending, totaal: naKorting + verzending };
}

/** React-hook op de volledige mandstaat (regels én kortingscode). */
export function useMandStaat(): MandStaat {
  return useSyncExternalStore(abonneer, lees, lees);
}

/** React-hook die alleen de regels teruggeeft. */
export function useWinkelmand(): MandItem[] {
  return useMandStaat().items;
}
