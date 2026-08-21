import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EkoColors, EkoFonts } from '@/constants/eko-theme';

type CategorieTegelProps = {
  naam: string;
  foto?: string;
  onPress: () => void;
  /** Vaste breedte voor horizontale rijen; zonder breedte vult de tegel de kolom. */
  breedte?: number;
};

/**
 * Categorietegel: staande foto van een artikel uit die categorie op een licht
 * vlak, met de naam eronder. Categorieën zonder foto krijgen een rustig vlak
 * met een icoon in plaats van een groot gekleurd blok.
 */
export function CategorieTegel({ naam, foto, onPress, breedte }: CategorieTegelProps) {
  return (
    <Pressable
      style={[styles.tegel, breedte ? { width: breedte } : styles.tegelFlex]}
      onPress={onPress}>
      <View style={styles.vlak}>
        {foto ? (
          <Image source={{ uri: foto }} style={styles.foto} contentFit="contain" />
        ) : (
          <View style={[styles.foto, styles.leeg]}>
            <Ionicons name="pricetag-outline" size={26} color={EkoColors.darkGray} />
          </View>
        )}
      </View>
      <Text style={styles.naam} numberOfLines={2}>
        {naam}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tegel: {
    width: 130,
  },
  tegelFlex: {
    flex: 1,
    width: undefined,
  },
  vlak: {
    backgroundColor: '#F4F4F2',
    padding: 10,
  },
  foto: {
    width: '100%',
    aspectRatio: 3 / 4,
  },
  leeg: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  naam: {
    marginTop: 8,
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: EkoColors.primaryDark,
  },
});
