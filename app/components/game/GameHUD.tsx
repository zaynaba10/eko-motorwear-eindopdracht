/**
 * GameHUD.tsx
 * Score, timer, snelheid en de afstand tot de bende.
 * Komt de bende dichtbij, dan kleurt dat vakje oranje als waarschuwing.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { EkoColors, EkoFonts, EkoRadius } from '@/constants/eko-theme';

function Stat({ label, value, alarm }: { label: string; value: string; alarm?: boolean }) {
  return (
    <View style={[styles.stat, alarm && styles.statAlarm]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, alarm && styles.valueAlarm]}>{value}</Text>
    </View>
  );
}

type GameHUDProps = {
  score: number;
  timeLeft: number;
  speed: number;
  closestGap: number;
  boost: boolean;
};

export default function GameHUD({ score, timeLeft, speed, closestGap, boost }: GameHUDProps) {
  const meterAchterstand = Math.max(0, Math.round(closestGap / 12));

  return (
    <View style={styles.row}>
      <Stat label="SCORE" value={String(score)} />
      <Stat label="TIJD" value={`${Math.ceil(timeLeft)}s`} alarm={timeLeft <= 10} />
      <Stat label="KM/U" value={String(Math.round(speed / 3))} alarm={boost} />
      <Stat label="BENDE" value={`${meterAchterstand}m`} alarm={closestGap < 70} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  stat: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: EkoColors.lightSteelBlue,
    borderRadius: EkoRadius.small,
    backgroundColor: EkoColors.white,
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  statAlarm: {
    borderColor: EkoColors.primary,
  },
  label: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 9,
    letterSpacing: 2,
    color: EkoColors.paragraphGray,
  },
  value: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 18,
    color: EkoColors.primaryDark,
  },
  valueAlarm: {
    color: EkoColors.primary,
  },
});
