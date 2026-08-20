import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ProductCardData } from '@/components/product-card';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { prijsKort } from '@/lib/format';
import { staatOpVerlanglijst, useVerlanglijst, wisselVerlanglijst } from '@/lib/verlanglijst';

type CollectieKaartProps = {
  product: ProductCardData;
  onPress?: () => void;
  /** Vaste breedte voor horizontale rijen; zonder breedte vult de kaart de kolom. */
  breedte?: number;
  /** Klein label boven de merknaam, bv. "NIEUWE COLLECTIE". */
  label?: string;
  /** Toont een kruisje rechtsboven (gebruikt bij "Laatst bekeken"). */
  onVerwijder?: () => void;
  /** Verbergt de prijs, bv. in een inspiratierij. */
  toonPrijs?: boolean;
};

/**
 * Productkaart in warenhuisstijl: grote foto op een licht vlak met een hartje,
 * daaronder merk, productnaam en prijs. Herbruikbaar via props in elke rij of
 * raster van het startscherm.
 */
export function CollectieKaart({
  product,
  onPress,
  breedte,
  label,
  onVerwijder,
  toonPrijs = true,
}: CollectieKaartProps) {
  useVerlanglijst(); // laat de kaart meelezen met de gedeelde verlanglijst
  const favoriet = staatOpVerlanglijst(product.id);
  const sale =
    typeof product.vergelijkPrijsEuro === 'number' &&
    typeof product.priceEuro === 'number' &&
    product.vergelijkPrijsEuro > product.priceEuro;

  return (
    <Pressable
      style={[styles.kaart, breedte ? { width: breedte } : styles.kaartFlex]}
      onPress={onPress}>
      <View style={styles.fotoVlak}>
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={styles.foto} contentFit="cover" />
        ) : (
          <View style={[styles.foto, styles.fotoLeeg]}>
            <Ionicons name="image-outline" size={30} color={EkoColors.darkGray} />
          </View>
        )}

        {onVerwijder && (
          <Pressable
            style={styles.kruisje}
            hitSlop={10}
            accessibilityLabel={`${product.name} verwijderen`}
            onPress={onVerwijder}>
            <Ionicons name="close" size={22} color={EkoColors.primaryDark} />
          </Pressable>
        )}

        <Pressable
          style={styles.hart}
          hitSlop={10}
          accessibilityLabel={`${product.name} bewaren`}
          onPress={() => wisselVerlanglijst(product.id)}>
          <Ionicons
            name={favoriet ? 'heart' : 'heart-outline'}
            size={22}
            color={favoriet ? EkoColors.primary : EkoColors.primaryDark}
          />
        </Pressable>
      </View>

      {!!label && <Text style={styles.label}>{label}</Text>}
      {!!product.merk && (
        <Text style={styles.merk} numberOfLines={1}>
          {product.merk}
        </Text>
      )}
      <Text style={styles.naam} numberOfLines={1}>
        {product.name}
      </Text>

      {toonPrijs && typeof product.priceEuro === 'number' && (
        <View style={styles.prijsRij}>
          <Text style={[styles.prijs, sale && styles.prijsSale]}>
            {prijsKort(product.priceEuro)}
          </Text>
          {sale && <Text style={styles.adviesPrijs}>{prijsKort(product.vergelijkPrijsEuro!)}</Text>}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  kaart: {
    width: 190,
  },
  kaartFlex: {
    flex: 1,
    width: undefined,
  },
  fotoVlak: {
    backgroundColor: '#F4F4F2',
    marginBottom: 12,
  },
  foto: {
    width: '100%',
    aspectRatio: 1,
  },
  fotoLeeg: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hart: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  kruisje: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  label: {
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: EkoColors.paragraphGray,
    marginBottom: 4,
  },
  merk: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 18,
    letterSpacing: 0.3,
    color: EkoColors.primaryDark,
    marginBottom: 2,
  },
  naam: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    color: EkoColors.paragraphGray,
    marginBottom: 6,
  },
  prijsRij: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  prijs: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 15,
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
