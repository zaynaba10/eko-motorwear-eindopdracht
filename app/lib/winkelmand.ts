import { useSyncExternalStore } from 'react';

/**
 * Winkelmand — gedeelde staat voor de hele app. Hetzelfde principe als de
 * verlanglijst: één bron voor de productpagina, het mandje-tabblad en het
 * telbolletje op de tabbalk.
 */

export type MandItem = {
  productId: string;
  maat?: string;
  aantal: number;
};

let items: MandItem[] = [];
const luisteraars = new Set<() => void>();

function meld() {
  luisteraars.forEach((fn) => fn());
}

function abonneer(fn: () => void) {
  luisteraars.add(fn);
  return () => {
    luisteraars.delete(fn);
  };
}

function lees(): MandItem[] {
  return items;
}

/** Sleutel van een regel: hetzelfde product in een andere maat is een aparte regel. */
export function mandSleutel(item: MandItem): string {
  return `${item.productId}|${item.maat ?? ''}`;
}

/** Huidige inhoud van de winkelmand. */
export function winkelmand(): MandItem[] {
  return items;
}

/** Totaal aantal artikelen (voor het bolletje op de tabbalk). */
export function mandAantal(): number {
  return items.reduce((som, i) => som + i.aantal, 0);
}

/** Legt een product in de mand, of verhoogt het aantal als het er al ligt. */
export function voegToeAanMand(productId: string, maat?: string) {
  const bestaat = items.find((i) => i.productId === productId && i.maat === maat);
  items = bestaat
    ? items.map((i) => (i === bestaat ? { ...i, aantal: i.aantal + 1 } : i))
    : [...items, { productId, maat, aantal: 1 }];
  meld();
}

/** Aantal aanpassen met + of −; het minimum is 1. */
export function wijzigAantal(sleutel: string, verschil: number) {
  items = items.map((i) =>
    mandSleutel(i) === sleutel ? { ...i, aantal: Math.max(1, i.aantal + verschil) } : i
  );
  meld();
}

/** Regel uit de mand halen. */
export function verwijderUitMand(sleutel: string) {
  items = items.filter((i) => mandSleutel(i) !== sleutel);
  meld();
}

/** React-hook die meeleest met de winkelmand. */
export function useWinkelmand(): MandItem[] {
  return useSyncExternalStore(abonneer, lees, lees);
}
