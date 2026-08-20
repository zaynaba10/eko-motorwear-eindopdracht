import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EkoColors, EkoFonts } from '@/constants/eko-theme';

type SectieKopProps = {
  titel: string;
  /** Toont een pijl rechts die naar het volledige overzicht gaat. */
  onMeer?: () => void;
  /** Kleinere variant voor secties zonder doorklik. */
  klein?: boolean;
};

/**
 * Sectiekop met titel links en een pijl rechts, zoals de blokken op het
 * startscherm ("Ontdek de categorieën →", "Nieuwe collectie →").
 */
export function SectieKop({ titel, onMeer, klein }: SectieKopProps) {
  return (
    <View style={styles.rij}>
      <Text style={[styles.titel, klein && styles.titelKlein]}>{titel}</Text>
      {onMeer && (
        <Pressable hitSlop={12} onPress={onMeer} accessibilityLabel={`Meer: ${titel}`}>
          <Ionicons name="arrow-forward" size={24} color={EkoColors.primaryDark} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rij: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  titel: {
    flex: 1,
    fontFamily: EkoFonts.headingBold,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: 0.3,
    color: EkoColors.primaryDark,
  },
  titelKlein: {
    fontSize: 21,
    lineHeight: 26,
  },
});
