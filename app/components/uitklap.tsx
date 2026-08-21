import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EkoColors, EkoFonts } from '@/constants/eko-theme';

type UitklapProps = {
  titel: string;
  open: boolean;
  onPress: () => void;
  children: ReactNode;
};

/**
 * Uitklapblok met een plus/min links, zoals de accordeons op de website.
 * Herbruikbaar voor de veelgestelde vragen en de algemene voorwaarden.
 */
export function Uitklap({ titel, open, onPress, children }: UitklapProps) {
  return (
    <View style={styles.blok}>
      <Pressable style={styles.kop} onPress={onPress}>
        <Ionicons
          name={open ? 'remove' : 'add'}
          size={20}
          color={EkoColors.primaryDark}
          style={styles.icoon}
        />
        <Text style={styles.titel}>{titel}</Text>
      </Pressable>
      {open && <View style={styles.inhoud}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  blok: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: EkoColors.lightSteelBlue,
  },
  kop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 16,
  },
  icoon: {
    marginTop: 1,
  },
  titel: {
    flex: 1,
    fontFamily: EkoFonts.bodyBold,
    fontSize: 15,
    lineHeight: 21,
    color: EkoColors.primaryDark,
  },
  inhoud: {
    paddingBottom: 16,
    paddingLeft: 32,
  },
});
