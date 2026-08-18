import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EkoColors, EkoFonts, EkoRadius } from '@/constants/eko-theme';

type CategorieTegelProps = {
  naam: string;
  foto?: string;
  onPress: () => void;
  /** Vaste breedte voor horizontale rijen; zonder breedte vult de tegel de kolom. */
  breedte?: number;
};

/**
 * Categorietegel in warenhuisstijl: staande foto (of een navy vlak wanneer er
 * nog geen foto is) met de categorienaam eronder.
 */
export function CategorieTegel({ naam, foto, onPress, breedte }: CategorieTegelProps) {
  return (
    <Pressable style={[styles.tegel, breedte ? { width: breedte } : styles.tegelFlex]} onPress={onPress}>
      {foto ? (
        <Image source={{ uri: foto }} style={styles.foto} contentFit="cover" />
      ) : (
        <View style={[styles.foto, styles.vlak]} />
      )}
      <Text style={styles.naam} numberOfLines={2}>
        {naam}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tegel: {
    width: 150,
  },
  tegelFlex: {
    flex: 1,
    width: undefined,
  },
  foto: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: EkoRadius.card,
    backgroundColor: EkoColors.lightGray,
  },
  vlak: {
    backgroundColor: EkoColors.primaryDark,
  },
  naam: {
    marginTop: 10,
    fontFamily: EkoFonts.headingMedium,
    fontSize: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: EkoColors.primaryDark,
  },
});
