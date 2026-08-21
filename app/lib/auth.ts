import { useSyncExternalStore } from 'react';

/**
 * Aanmelden en registreren met dummygegevens, zoals de opdracht toelaat.
 * De accounts leven in het geheugen van de app-sessie — geen database.
 */

export type Gebruiker = {
  aanhef: string;
  voornaam: string;
  tussenvoegsel?: string;
  achternaam: string;
  email: string;
  geboortedatum?: string;
  telefoon?: string;
  land: string;
  postcode?: string;
  plaats?: string;
  straat?: string;
  huisnummer?: string;
  bus?: string;
  bedrijf?: string;
  btw?: string;
};

type Account = {
  wachtwoord: string;
  gegevens: Gebruiker;
};

/** Demo-account waarmee je meteen kan inloggen. */
const DEMO_EMAIL = 'zaynaba@eko-motorwear.be';
const DEMO_WACHTWOORD = 'Eko2026';

const accounts = new Map<string, Account>([
  [
    DEMO_EMAIL,
    {
      wachtwoord: DEMO_WACHTWOORD,
      gegevens: {
        aanhef: 'Mevr.',
        voornaam: 'Zaynaba',
        achternaam: 'Alkodase',
        email: DEMO_EMAIL,
        geboortedatum: '09/10/1996',
        telefoon: '0486 39 63 72',
        land: 'België',
        postcode: '2550',
        plaats: 'Kontich',
        straat: 'Singel',
        huisnummer: '4c',
      },
    },
  ],
]);

let ingelogd: Gebruiker | null = null;
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

function lees(): Gebruiker | null {
  return ingelogd;
}

/** Demogegevens om te tonen op het inlogscherm. */
export const DEMO = { email: DEMO_EMAIL, wachtwoord: DEMO_WACHTWOORD };

/** Bestaat er al een account met dit e-mailadres? */
export function kentEmail(email: string): boolean {
  return accounts.has(email.trim().toLowerCase());
}

/** Inloggen met e-mailadres en wachtwoord. */
export function login(email: string, wachtwoord: string): { ok: boolean; fout?: string } {
  const account = accounts.get(email.trim().toLowerCase());
  if (!account) return { ok: false, fout: 'We kennen dit e-mailadres nog niet.' };
  if (account.wachtwoord !== wachtwoord) return { ok: false, fout: 'Dit wachtwoord klopt niet.' };
  ingelogd = account.gegevens;
  meld();
  return { ok: true };
}

/** Nieuw account aanmaken en meteen inloggen. */
export function registreer(wachtwoord: string, gegevens: Gebruiker) {
  const sleutel = gegevens.email.trim().toLowerCase();
  accounts.set(sleutel, { wachtwoord, gegevens: { ...gegevens, email: sleutel } });
  ingelogd = { ...gegevens, email: sleutel };
  meld();
}

/**
 * Gegevens van de ingelogde gebruiker bijwerken. Wijzigt het e-mailadres mee
 * als sleutel van het account, zodat je met het nieuwe adres kan inloggen.
 */
export function werkBij(velden: Partial<Gebruiker>) {
  if (!ingelogd) return;
  const oudeSleutel = ingelogd.email;
  const account = accounts.get(oudeSleutel);
  const wachtwoord = account?.wachtwoord ?? '';

  const bijgewerkt: Gebruiker = { ...ingelogd, ...velden };
  const nieuweSleutel = (velden.email ?? oudeSleutel).trim().toLowerCase();
  bijgewerkt.email = nieuweSleutel;

  if (nieuweSleutel !== oudeSleutel) accounts.delete(oudeSleutel);
  accounts.set(nieuweSleutel, { wachtwoord, gegevens: bijgewerkt });
  ingelogd = bijgewerkt;
  meld();
}

/** Wachtwoord wijzigen van de ingelogde gebruiker. */
export function wijzigWachtwoord(huidig: string, nieuw: string): { ok: boolean; fout?: string } {
  if (!ingelogd) return { ok: false, fout: 'Je bent niet ingelogd.' };
  const account = accounts.get(ingelogd.email);
  if (!account || account.wachtwoord !== huidig)
    return { ok: false, fout: 'Je huidige wachtwoord klopt niet.' };
  const regelFout = wachtwoordFout(nieuw);
  if (regelFout) return { ok: false, fout: regelFout };
  accounts.set(ingelogd.email, { ...account, wachtwoord: nieuw });
  return { ok: true };
}

/** Uitloggen. */
export function uitloggen() {
  ingelogd = null;
  meld();
}

/** Huidige gebruiker, of null wanneer niemand ingelogd is. */
export function huidigeGebruiker(): Gebruiker | null {
  return ingelogd;
}

/** React-hook die meeleest met de aanmeldstatus. */
export function useGebruiker(): Gebruiker | null {
  return useSyncExternalStore(abonneer, lees, lees);
}

/** Controleert of een wachtwoord aan de regels voldoet. */
export function wachtwoordFout(wachtwoord: string): string | null {
  if (wachtwoord.length < 6) return 'Minimaal 6 tekens';
  if (!/[0-9]/.test(wachtwoord)) return 'Minstens 1 cijfer';
  if (!/[A-Z]/.test(wachtwoord)) return 'Minstens 1 hoofdletter';
  if (!/[a-z]/.test(wachtwoord)) return 'Minstens 1 kleine letter';
  return null;
}
