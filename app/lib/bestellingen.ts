import { useSyncExternalStore } from 'react';

/**
 * Bestellingen — de demo-bestellingen die je in deze sessie plaatst.
 * Net als de verlanglijst en de winkelmand leeft dit in het geheugen van de
 * app: geen database, wel echte gegevens die overal meteen doorwerken
 * (bevestigingsscherm, Mijn bestellingen en het aantal EKO Club-punten).
 */

export type BestelRegel = {
  productId: string;
  naam: string;
  merk?: string;
  maat?: string;
  aantal: number;
  stukPrijs: number;
  imageUrl?: string;
};

export type Bestelling = {
  nummer: string;
  datum: number;
  email: string;
  regels: BestelRegel[];
  subtotaal: number;
  korting: number;
  verzending: number;
  totaal: number;
};

/** E-mailadres waarop de bevestiging aankomt (demo-account). */
export const BEVESTIGINGSMAIL = 'zaynaba_alkodase@hotmail.com';

let bestellingen: Bestelling[] = [];
let teller = 0;
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

function lees(): Bestelling[] {
  return bestellingen;
}

/** Alle bestellingen, nieuwste eerst. */
export function alleBestellingen(): Bestelling[] {
  return bestellingen;
}

/** Eén bestelling opzoeken op bestelnummer. */
export function vindBestelling(nummer: string): Bestelling | undefined {
  return bestellingen.find((b) => b.nummer === nummer);
}

/** Plaatst een bestelling en geeft ze terug (met bestelnummer en datum). */
export function plaatsBestelling(
  gegevens: Omit<Bestelling, 'nummer' | 'datum' | 'email'>
): Bestelling {
  teller += 1;
  const nummer = String(51000000 + teller * 137 + (Date.now() % 1000));
  const bestelling: Bestelling = {
    ...gegevens,
    nummer,
    datum: Date.now(),
    email: BEVESTIGINGSMAIL,
  };
  bestellingen = [bestelling, ...bestellingen];
  meld();
  return bestelling;
}

/** EKO Club-punten: één punt per besteed euro. */
export function puntenSaldo(): number {
  return Math.floor(bestellingen.reduce((som, b) => som + b.totaal, 0));
}

/** React-hook die meeleest met de bestellingen. */
export function useBestellingen(): Bestelling[] {
  return useSyncExternalStore(abonneer, lees, lees);
}
