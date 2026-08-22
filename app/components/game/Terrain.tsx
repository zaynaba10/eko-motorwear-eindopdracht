/**
 * Terrain.tsx
 * Tekent de heuvellijn plus schuine streepjes eronder als wegdek-textuur.
 * De grondlijn is navy, de arcering lichtgrijs — allebei uit de huisstijl.
 */

import React from 'react';
import { Line, Path } from 'react-native-svg';
import { EkoColors } from '@/constants/eko-theme';
import { buildGroundHatches, buildTerrainPath } from '@/lib/game/terrain';

type TerrainProps = {
  cameraX: number;
  width: number;
  height: number;
};

export default function Terrain({ cameraX, width, height }: TerrainProps) {
  const path = buildTerrainPath(cameraX, width, height);
  const hatches = buildGroundHatches(cameraX, width, height);

  // Zelfde lijn, maar dichtgemaakt tot onderaan het beeld: geeft de grond
  // gewicht zonder de lijnstijl los te laten.
  const grondvlak = `${path} L ${width} ${height} L 0 ${height} Z`;

  return (
    <>
      <Path d={grondvlak} fill={EkoColors.primaryLight} />
      <Path
        d={path}
        stroke={EkoColors.primaryDark}
        strokeWidth={2.5}
        fill="none"
        strokeLinejoin="round"
      />
      {hatches.map((h, i) => (
        <Line
          key={`hatch-${i}`}
          x1={h.x1}
          y1={h.y1}
          x2={h.x2}
          y2={h.y2}
          stroke={EkoColors.lightSteelBlue}
          strokeWidth={1.5}
        />
      ))}
    </>
  );
}
