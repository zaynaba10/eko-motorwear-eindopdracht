import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EkoColors, EkoFonts, EkoRadius } from '@/constants/eko-theme';
import { staatOpVerlanglijst, useVerlanglijst, wisselVerlanglijst } from '@/lib/verlanglijst';

export type ProductCardData = {
  id: string;
  name: string;
  slug?: string;
  imageUrl?: string;
  /** Alle productfoto's (hoofdfoto + extra foto's) voor de fotogalerij. */
  imageUrls?: string[];
  description?: string;
  /** Samenstelling en specificaties als rich text (HTML) uit Webflow. */
  specificaties?: string;
  priceEuro?: number;
  /** Adviesprijs bij afgeprijsde artikelen (sale). */
  vergelijkPrijsEuro?: number;
  merk?: string;
  geslacht?: string;
  kleur?: string;
  materiaal?: string;
  eigenschappen?: string[];
  seizoen?: string;
  /** Webflow-categorie-id's waar het product aan gekoppeld is. */
  categorieIds?: string[];
  /** Maten uit de SKU-eigenschappen van dit product (zoals op de website). */
  maten?: string[];
  /** Extra uitleg (rich text) uit het veld More Info. */
  meerInfo?: string;
  /** Staat dit product op "feature on home" in Webflow? */
  uitgelicht?: boolean;
};

type ProductCardProps = {
  product: ProductCardData;
  onPress?: () => void;
  width?: number;
};

export function ProductCard({ product, onPress, width }: ProductCardProps) {
  useVerlanglijst(); // kaart leest mee met de gedeelde verlanglijst
  const favoriet = staatOpVerlanglijst(product.id);
  return (
    <Pressable style={[styles.card, width ? { width } : styles.cardFlex]} onPress={onPress}>
      <View style={styles.imageWrapper}>
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={styles.image} contentFit="cover" />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Ionicons name="image-outline" size={32} color={EkoColors.darkGray} />
          </View>
        )}
        <Pressable
          style={styles.hart}
          hitSlop={10}
          accessibilityLabel={favoriet ? 'Verwijderen van verlanglijst' : 'Toevoegen aan verlanglijst'}
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
      <Text style={styles.name} numberOfLines={2}>
        {product.name}
      </Text>
      {typeof product.priceEuro === 'number' && (
        <Text style={styles.price}>€ {product.priceEuro.toFixed(2)}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 170,
  },
  cardFlex: {
    flex: 1,
    width: undefined,
  },
  imageWrapper: {
    borderRadius: EkoRadius.card,
    overflow: 'hidden',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 180,
  },
  imagePlaceholder: {
    backgroundColor: EkoColors.lightSteelBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hart: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 14,
    color: EkoColors.primaryDark,
    marginBottom: 4,
  },
  price: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 14,
    color: EkoColors.primary,
  },
});
