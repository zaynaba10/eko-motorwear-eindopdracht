/**
 * EkoLogo.tsx
 * Het EM-merkteken van EKO Motorwear: navy blokje, witte letters,
 * oranje streep ertussen. Precies zoals het app-icoon van de website.
 * Schaalbaar via de prop `size`.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';

export default function EkoLogo({ size = 18 }: { size?: number }) {
  return (
    <View
      style={[
        styles.badge,
        {
          borderRadius: size * 0.45,
          paddingHorizontal: size * 0.5,
          paddingVertical: size * 0.34,
        },
      ]}
    >
      <Text style={[styles.letter, { fontSize: size }]}>E</Text>
      <View
        style={[
          styles.bar,
          { width: Math.max(2, size * 0.16), height: size * 1.05, marginHorizontal: size * 0.24 },
        ]}
      />
      <Text style={[styles.letter, { fontSize: size }]}>M</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: EkoColors.primaryDark,
  },
  letter: {
    fontFamily: EkoFonts.headingBold,
    color: EkoColors.white,
    letterSpacing: 1,
    includeFontPadding: false,
  },
  bar: {
    backgroundColor: EkoColors.primary,
    borderRadius: 2,
  },
});
