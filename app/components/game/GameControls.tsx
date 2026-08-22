/**
 * GameControls.tsx
 * De drie pijltjes. onPressIn/onPressOut houden de knop "ingedrukt",
 * zodat je echt kunt blijven gasgeven of remmen.
 * Ingedrukt kleurt de knop oranje — de actieve staat uit de huisstijl.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { EkoColors, EkoFonts, EkoRadius } from '@/constants/eko-theme';

type ArrowButtonProps = {
  symbol: string;
  caption: string;
  onPressIn?: () => void;
  onPressOut?: () => void;
  onPress?: () => void;
};

function ArrowButton({ symbol, caption, onPressIn, onPressOut, onPress }: ArrowButtonProps) {
  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      {({ pressed }) => (
        <>
          <Text style={[styles.symbol, pressed && styles.textPressed]}>{symbol}</Text>
          <Text style={[styles.caption, pressed && styles.textPressed]}>{caption}</Text>
        </>
      )}
    </Pressable>
  );
}

type GameControlsProps = {
  setInput: (key: 'left' | 'right', value: boolean) => void;
  jump: () => void;
  disabled?: boolean;
};

export default function GameControls({ setInput, jump, disabled }: GameControlsProps) {
  if (disabled) return <View style={styles.row} />;

  return (
    <View style={styles.row}>
      <ArrowButton
        symbol="←"
        caption="REM"
        onPressIn={() => setInput('left', true)}
        onPressOut={() => setInput('left', false)}
      />
      <ArrowButton symbol="↑" caption="SPRING" onPress={jump} />
      <ArrowButton
        symbol="→"
        caption="GAS"
        onPressIn={() => setInput('right', true)}
        onPressOut={() => setInput('right', false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    paddingVertical: 18,
  },
  button: {
    width: 88,
    height: 68,
    borderWidth: 2,
    borderColor: EkoColors.primaryDark,
    borderRadius: EkoRadius.small,
    backgroundColor: EkoColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    backgroundColor: EkoColors.primary,
    borderColor: EkoColors.primary,
  },
  symbol: {
    fontSize: 26,
    lineHeight: 30,
    color: EkoColors.primaryDark,
  },
  caption: {
    fontFamily: EkoFonts.headingMedium,
    fontSize: 9,
    letterSpacing: 2,
    color: EkoColors.paragraphGray,
  },
  textPressed: {
    color: EkoColors.white,
  },
});
