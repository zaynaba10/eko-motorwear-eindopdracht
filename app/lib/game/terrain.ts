/**
 * terrain.ts
 * De heuvels zijn géén array met vaste punten, maar een wiskundige functie.
 * Voordeel: het landschap is oneindig lang, kost geen geheugen en is
 * altijd exact hetzelfde voor eenzelfde x (dus speler en bende rijden
 * gegarandeerd over dezelfde grond).
 */

import { TERRAIN } from './gameConfig';

/** Hoogte (y in px, van boven gemeten) van de grond op wereldpositie x. */
export function terrainY(worldX: number, screenHeight: number): number {
  let y = TERRAIN.baseY * screenHeight;
  for (const hill of TERRAIN.hills) {
    y += Math.sin((worldX + hill.offset) / hill.length) * hill.amplitude;
  }
  return y;
}

/**
 * Helling op positie x: positief = het gaat omlaag op het scherm (bergaf),
 * negatief = bergop. Berekend als numerieke afgeleide.
 */
export function terrainSlope(worldX: number, screenHeight: number): number {
  const d = 4;
  return (
    (terrainY(worldX + d, screenHeight) - terrainY(worldX - d, screenHeight)) /
    (2 * d)
  );
}

/**
 * Hoek van de motor in graden, zodat hij netjes op de helling staat.
 * We dempen de hoek een beetje (0.7) en begrenzen hem op 26°,
 * anders staat de motor bij een steile heuvel bijna rechtop.
 */
export function slopeAngle(worldX: number, screenHeight: number): number {
  const deg = (Math.atan(terrainSlope(worldX, screenHeight)) * 180) / Math.PI;
  return Math.max(-26, Math.min(26, deg * 0.7));
}

/**
 * Bouwt het SVG-pad van de zichtbare grondlijn.
 * We samplen alleen wat op het scherm past, niet de hele wereld.
 */
export function buildTerrainPath(
  cameraX: number,
  width: number,
  height: number
): string {
  const step = TERRAIN.step;
  let path = '';
  for (let x = -step; x <= width + step; x += step) {
    const y = terrainY(cameraX + x, height);
    path += `${path === '' ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return path.trim();
}

export type Hatch = { x1: number; y1: number; x2: number; y2: number };

/**
 * Korte streepjes onder de grondlijn: geeft textuur zonder vulling of kleur.
 */
export function buildGroundHatches(
  cameraX: number,
  width: number,
  height: number,
  spacing = 34
): Hatch[] {
  const hatches: Hatch[] = [];
  const first = Math.ceil(cameraX / spacing) * spacing;
  for (let worldX = first; worldX < cameraX + width; worldX += spacing) {
    const x = worldX - cameraX;
    const y = terrainY(worldX, height);
    hatches.push({ x1: x, y1: y + 6, x2: x - 9, y2: y + 20 });
  }
  return hatches;
}
