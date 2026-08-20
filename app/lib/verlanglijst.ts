import { useSyncExternalStore } from 'react';

/**
 * Verlanglijst — gedeelde staat voor de hele app, zodat het hartje op een
 * producttegel, de productpagina en het verlanglijst-tabblad altijd hetzelfde
 * tonen. Bewust zonder database: de lijst leeft in het geheugen van de sessie.
 */

export type VerlanglijstItem = {
  productId: string;
  /** Gekozen maat; wordt pas gezet als de gebruiker er een kiest. */
  maat?: string;
};

/** Maximum aantal artikelen, zoals de limiet in een echte verlanglijst. */
export const VERLANGLIJST_LIMIET = 200;

let items: VerlanglijstItem[] = [];
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

function lees(): VerlanglijstItem[] {
  return items;
}

/** Huidige verlanglijst (nieuwste eerst). */
export function verlanglijst(): VerlanglijstItem[] {
  return items;
}

/** Staat dit product al op de verlanglijst? */
export function staatOpVerlanglijst(productId: string): boolean {
  return items.some((i) => i.productId === productId);
}

/** Hartje aan of uit zetten. Geeft terug of het product er nu op staat. */
export function wisselVerlanglijst(productId: string): boolean {
  if (staatOpVerlanglijst(productId)) {
    items = items.filter((i) => i.productId !== productId);
    meld();
    return false;
  }
  if (items.length >= VERLANGLIJST_LIMIET) return false;
  items = [{ productId }, ...items];
  meld();
  return true;
}

/** Kruisje op een rij in de verlanglijst. */
export function verwijderVanVerlanglijst(productId: string) {
  items = items.filter((i) => i.productId !== productId);
  meld();
}

/** Maat bewaren bij een artikel op de verlanglijst. */
export function zetVerlanglijstMaat(productId: string, maat: string) {
  items = items.map((i) => (i.productId === productId ? { ...i, maat } : i));
  meld();
}

/** React-hook die meeleest met de verlanglijst. */
export function useVerlanglijst(): VerlanglijstItem[] {
  return useSyncExternalStore(abonneer, lees, lees);
}
