/**
 * Bike.tsx
 * Eén herbruikbare motorrijder in lijnstijl, in de huisstijlkleuren.
 * De speler is navy met een oranje helm en jas; de bende is grijs,
 * zodat je in één oogopslag ziet wie jij bent — ook zonder tekst.
 */

import React from 'react';
import { Circle, G, Line } from 'react-native-svg';
import { EkoColors } from '@/constants/eko-theme';

type BikeProps = {
  x: number;
  y: number;
  angle?: number;
  variant?: 'player' | 'chaser';
  scale?: number;
  flikker?: boolean;   // knippert na een botsing
};

export default function Bike({
  x,
  y,
  angle = 0,
  variant = 'player',
  scale = 1,
  flikker = false,
}: BikeProps) {
  const isChaser = variant === 'chaser';

  const lijn: string = isChaser ? EkoColors.darkGray : EkoColors.primaryDark;
  const accent: string = isChaser ? EkoColors.gray : EkoColors.primary;
  const width = isChaser ? 1.8 : 2.4;
  const opacity = flikker ? 0.35 : isChaser ? 0.85 : 1;

  const line = (x1: number, y1: number, x2: number, y2: number, kleur: string = lijn) => (
    <Line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={kleur}
      strokeWidth={width}
      strokeLinecap="round"
    />
  );

  return (
    <G opacity={opacity} transform={`translate(${x}, ${y}) rotate(${angle}) scale(${scale})`}>
      {/* wielen */}
      <Circle cx={-15} cy={-10} r={10} stroke={lijn} strokeWidth={width} fill="none" />
      <Circle cx={15} cy={-10} r={10} stroke={lijn} strokeWidth={width} fill="none" />

      {/* frame */}
      {line(-15, -10, -3, -23)}
      {line(-3, -23, 15, -10)}
      {line(-3, -23, 9, -25)}
      {line(9, -25, 16, -19)}
      {line(-15, -10, 2, -18)}

      {/* stuur */}
      {line(9, -25, 13, -29)}

      {/* rijder: jas en helm in het oranje van de huisstijl */}
      {line(-3, -23, 1, -35, accent)}
      <Circle cx={3} cy={-40} r={5} stroke={accent} strokeWidth={width} fill="none" />
      {line(1, -34, 12, -28, accent)}
      {line(-1, -27, 5, -16)}
    </G>
  );
}
