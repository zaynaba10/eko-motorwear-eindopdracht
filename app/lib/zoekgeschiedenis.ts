import { useSyncExternalStore } from 'react';

/**
 * Zoekgeschiedenis — de zoektermen van deze sessie, getoond onder de zoekbalk
 * zodra je het veld opent. Zelfde opzet als de verlanglijst en de winkelmand:
 * één gedeelde bron, geen database.
 */

const MAX_TERMEN = 10;

let termen: string[] = [];
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

function lees(): string[] {
  return termen;
}

/** Zoekterm bovenaan de geschiedenis zetten. */
export function bewaarZoekterm(term: string) {
  const schoon = term.trim();
  if (!schoon) return;
  termen = [schoon, ...termen].slice(0, MAX_TERMEN);
  meld();
}

/** Eén zoekterm verwijderen (kruisje op de rij). */
export function verwijderZoekterm(index: number) {
  termen = termen.filter((_, i) => i !== index);
  meld();
}

/** Volledige geschiedenis wissen. */
export function wisZoekgeschiedenis() {
  termen = [];
  meld();
}

/** React-hook die meeleest met de zoekgeschiedenis. */
export function useZoekgeschiedenis(): string[] {
  return useSyncExternalStore(abonneer, lees, lees);
}
