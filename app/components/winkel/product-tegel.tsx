import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ProductCardData } from '@/components/product-card';
import { EkoColors, EkoFonts, EkoRadius } from '@/constants/eko-theme';
import { staatOpVerlanglijst, useVerlanglijst, wisselVerlanglijst } from '@/lib/verlanglijst';

type ProductTegelProps = {
  product: ProductCardData;
  onPress?: () => void;
  /** Vaste breedte voor horizontale rijen; zonder breedte vult de tegel de kolom. */
  breedte?: number;
};

/**
 * Producttegel in warenhuisstijl: foto op een licht vlak met een hartje,
 * daaronder merk, naam en prijs (met adviesprijs bij sale).
 */
export function ProductTegel({ product, onPress, breedte }: ProductTegelProps) {
  useVerlanglijst(); // laat de tegel meelezen met de gedeelde verlanglijst
  const favoriet = staatOpVerlanglijst(product.id);
  const sale =
    typeof product.vergelijkPrijsEuro === 'number' &&
    typeof product.priceEuro === 'number' &&
    product.vergelijkPrijsEuro > product.priceEuro;

  return (
    <Pressable style={[styles.tegel, breedte ? { width: breedte } : styles.tegelFlex]} onPress={onPress}>
      <View style={styles.fotoVlak}>
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={styles.foto} contentFit="cover" />
        ) : (
          <View style={[styles.foto, styles.fotoLeeg]}>
            <Ionicons name="image-outline" size={32} color={EkoColors.darkGray} />
          </View>
        )}
        {sale && (
          <View style={styles.saleTag}>
            <Text style={styles.saleTagTekst}>SALE</Text>
          </View>
        )}
        <Pressable
          style={styles.hart}
          hitSlop={10}
          onPress={(e) => {
            e.stopPropagation();
            wisselVerlanglijst(product.id);
          }}>
          <Ionicons
            name={favoriet ? 'heart' : 'heart-outline'}
            size={20}
            color={favoriet ? EkoColors.primary : EkoColors.primaryDark}
          />
        </Pressable>
      </View>
      {!!product.merk && <Text style={styles.merk}>{product.merk}</Text>}
      <Text style={styles.naam} numberOfLines={2}>
        {product.name}
      </Text>
      {typeof product.priceEuro === 'number' && (
        <View style={styles.prijsRij}>
          {sale && (
            <Text style={styles.adviesPrijs}>€ {product.vergelijkPrijsEuro!.toFixed(2)}</Text>
          )}
          <Text style={[styles.prijs, sale && styles.prijsSale]}>
            € {product.priceEuro.toFixed(2)}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tegel: {
    width: 170,
  },
  tegelFlex: {
    flex: 1,
    width: undefined,
  },
  fotoVlak: {
    borderRadius: EkoRadius.card,
    overflow: 'hidden',
    backgroundColor: EkoColors.lightGray,
    marginBottom: 10,
  },
  foto: {
    width: '100%',
    aspectRatio: 3 / 4,
  },
  fotoLeeg: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hart: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: EkoColors.whiteTranslucent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saleTag: {
    position: 'absolute',
    left: 10,
    top: 10,
    backgroundColor: EkoColors.primary,
    borderRadius: EkoRadius.tag,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  saleTagTekst: {
    fontFamily: EkoFonts.headingMedium,
    fontSize: 11,
    letterSpacing: 1,
    color: EkoColors.white,
  },
  merk: {
    fontFamily: EkoFonts.headingMedium,
    fontSize: 13,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: EkoColors.primaryDark,
    marginBottom: 2,
  },
  naam: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    lineHeight: 19,
    color: EkoColors.paragraphGray,
    marginBottom: 4,
  },
  prijsRij: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  prijs: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 14,
    color: EkoColors.primaryDark,
  },
  prijsSale: {
    color: EkoColors.primary,
  },
  adviesPrijs: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 13,
    color: EkoColors.darkGray,
    textDecorationLine: 'line-through',
  },
});
