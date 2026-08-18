import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EkoColors, EkoFonts, EkoRadius } from '@/constants/eko-theme';

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
};

type ProductCardProps = {
  product: ProductCardData;
  onPress?: () => void;
  width?: number;
};

export function ProductCard({ product, onPress, width }: ProductCardProps) {
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
