/**
 * obstacles.ts
 * Obstakels worden niet opgeslagen in een array, maar berekend uit hun index.
 * Dezelfde index geeft altijd hetzelfde obstakel — net als bij het terrein.
 * Zo is de baan oneindig lang zonder dat we iets in het geheugen bijhouden.
 */

import { OBSTACLES } from './gameConfig';

export type ObstakelType = 'kegel' | 'vat' | 'band';

export type Obstakel = {
  id: number;
  worldX: number;
  type: ObstakelType;
  halfWidth: number;
  height: number;
};

const TYPES: ObstakelType[] = ['kegel', 'vat', 'band'];

/** Maten in wereld-pixels. Moeten gelijk lopen met de tekening in Obstacle.tsx. */
const MATEN: Record<ObstakelType, { halfWidth: number; height: number }> = {
  kegel: { halfWidth: 16, height: 33 },
  vat: { halfWidth: 19, height: 43 },
  band: { halfWidth: 19, height: 30 },
};

/** Pseudo-willekeurig maar reproduceerbaar getal tussen 0 en 1. */
function ruis(seed: number): number {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

export function obstakelOpIndex(index: number): Obstakel {
  const worldX =
    OBSTACLES.startAfter + index * OBSTACLES.spacing + ruis(index) * OBSTACLES.jitter;
  const type = TYPES[Math.floor(ruis(index + 99) * TYPES.length)];
  return { id: index, worldX, type, ...MATEN[type] };
}

/** Alleen de obstakels die nu op het scherm passen. */
export function obstakelsInBeeld(cameraX: number, width: number): Obstakel[] {
  const eerste = Math.floor((cameraX - OBSTACLES.startAfter) / OBSTACLES.spacing) - 1;
  const laatste = Math.ceil((cameraX + width - OBSTACLES.startAfter) / OBSTACLES.spacing) + 1;

  const lijst: Obstakel[] = [];
  for (let i = Math.max(0, eerste); i <= laatste; i++) {
    const o = obstakelOpIndex(i);
    if (o.worldX > cameraX - 60 && o.worldX < cameraX + width + 60) lijst.push(o);
  }
  return lijst;
}

/**
 * Botsingscontrole: raak je een obstakel terwijl je te laag vliegt?
 * We checken alleen de drie obstakels rond je huidige positie.
 */
export function geraaktObstakel(distance: number, altitude: number): Obstakel | null {
  const dichtsteIndex = Math.round((distance - OBSTACLES.startAfter) / OBSTACLES.spacing);
  for (let i = dichtsteIndex - 1; i <= dichtsteIndex + 1; i++) {
    if (i < 0) continue;
    const o = obstakelOpIndex(i);
    if (Math.abs(distance - o.worldX) < o.halfWidth + 14 && altitude < o.height) return o;
  }
  return null;
}

/**
 * Het spiegelbeeld van geraaktObstakel: vlieg je op dit moment ju00edst hoog
 * genoeg over een obstakel heen? Zelfde zone, omgekeerde hoogtevoorwaarde.
 */
export function overObstakel(distance: number, altitude: number): Obstakel | null {
  const dichtsteIndex = Math.round((distance - OBSTACLES.startAfter) / OBSTACLES.spacing);
  for (let i = dichtsteIndex - 1; i <= dichtsteIndex + 1; i++) {
    if (i < 0) continue;
    const o = obstakelOpIndex(i);
    if (Math.abs(distance - o.worldX) < o.halfWidth + 14 && altitude >= o.height) return o;
  }
  return null;
}

/**
 * Hoogte van een achtervolger boven de grond.
 * De bende springt automatisch over elk obstakel — zij verliezen dus nooit
 * snelheid, jij moet zelf op de sprongknop drukken. Dat maakt de achtervolging
 * spannend: elk obstakel dat jij raakt, kost jou tijd en hen niets.
 * Puur berekend uit de positie, dus we hoeven niets bij te houden.
 */
export function bendeHoogte(worldX: number): number {
  const index = Math.round((worldX - OBSTACLES.startAfter) / OBSTACLES.spacing);
  const straal = 95;

  for (let i = index - 1; i <= index + 1; i++) {
    if (i < 0) continue;
    const o = obstakelOpIndex(i);
    const dx = worldX - o.worldX;
    if (Math.abs(dx) < straal) {
      const t = dx / straal;                  // -1 (net voor) .. 1 (net na)
      return (o.height + 16) * (1 - t * t);   // parabool = sprongboog
    }
  }
  return 0;
}

/** Het eerstvolgende obstakel vóór je, voor de waarschuwingspijl. */
export function volgendObstakel(distance: number): Obstakel | null {
  const index = Math.max(
    0,
    Math.floor((distance - OBSTACLES.startAfter) / OBSTACLES.spacing)
  );
  for (let i = index; i <= index + 3; i++) {
    const o = obstakelOpIndex(i);
    if (o.worldX > distance) return o;
  }
  return null;
}
