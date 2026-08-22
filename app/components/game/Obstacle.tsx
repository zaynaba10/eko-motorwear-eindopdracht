/**
 * Obstacle.tsx
 * Tekent één obstakel in lijnstijl, in de huisstijlkleuren:
 * een verkeerskegel, een olievat of een autoband.
 * Alles staat op de grond, dus (0,0) is het contactpunt met het terrein.
 */

import React from 'react';
import { Circle, G, Line, Path, Rect } from 'react-native-svg';
import { EkoColors } from '@/constants/eko-theme';
import type { ObstakelType } from '@/lib/game/obstacles';

const ORANJE = EkoColors.primary;
const NAVY = EkoColors.primaryDark;

/** Schaal 1.25 hoort bij de maten in obstacles.ts — pas ze samen aan. */
const SCHAAL = 1.25;

type ObstacleProps = { x: number; y: number; type: ObstakelType };

export default function Obstacle({ x, y, type }: ObstacleProps) {
  return (
    <G transform={`translate(${x}, ${y}) scale(${SCHAAL})`}>
      {type === 'kegel' && (
        <>
          <Path d="M -10 0 L 0 -26 L 10 0 Z" stroke={ORANJE} strokeWidth={2.2} fill="none" strokeLinejoin="round" />
          <Line x1={-6} y1={-11} x2={6} y2={-11} stroke={NAVY} strokeWidth={2} />
          <Line x1={-13} y1={0} x2={13} y2={0} stroke={NAVY} strokeWidth={2.2} strokeLinecap="round" />
        </>
      )}

      {type === 'vat' && (
        <>
          <Rect x={-11} y={-34} width={22} height={34} rx={3} stroke={NAVY} strokeWidth={2.2} fill="none" />
          <Line x1={-11} y1={-25} x2={11} y2={-25} stroke={ORANJE} strokeWidth={2} />
          <Line x1={-11} y1={-11} x2={11} y2={-11} stroke={ORANJE} strokeWidth={2} />
        </>
      )}

      {type === 'band' && (
        <>
          <Circle cx={0} cy={-12} r={12} stroke={NAVY} strokeWidth={2.4} fill="none" />
          <Circle cx={0} cy={-12} r={5} stroke={ORANJE} strokeWidth={2} fill="none" />
        </>
      )}
    </G>
  );
}
