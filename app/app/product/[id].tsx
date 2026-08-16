import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { EkoColors, EkoFonts, EkoRadius } from '@/constants/eko-theme';
import { euro } from '@/lib/format';
import { fetchWebflowProduct, ProductDetails } from '@/lib/webflow-products';

/**
 * ProductDetailsScreen — dynamische route (app/product/[id].tsx), bereikt
 * vanuit het Shop-scherm via router.push(`/product/${id}`). De ID komt binnen
 * via de route-params en het product wordt hier opgehaald via het
 * "endpoint per product (via ID)" uit de opdracht.
 *
 * Bevat de verplichte state: aantal aanpassen (+/-, minimum 1) en de
 * totale prijs die live meetelt.
 */
export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [aantal, setAantal] = useState(1);
  const [maat, setMaat] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchWebflowProduct(id)
      .then((item) => {
        setProduct(item);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={EkoColors.primary} />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error ? `Fout: ${error}` : 'Product niet gevonden.'}</Text>
      </View>
    );
  }

  const totaal =
    typeof product.priceEuro === 'number' ? product.priceEuro * aantal : undefined;

  return (
    <>
      <Stack.Screen options={{ title: product.name, headerBackTitle: 'Shop' }} />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
        {product.imageUrl && (
          <Image source={{ uri: product.imageUrl }} style={styles.heroImage} contentFit="cover" />
        )}
        <View style={styles.content}>
          <Text style={styles.title}>{product.name}</Text>

          {typeof product.priceEuro === 'number' && (
            <Text style={styles.price}>{euro(product.priceEuro)}</Text>
          )}

          {product.description && <Text style={styles.p}>{product.description}</Text>}

          {product.maten.length > 0 && (
            <>
              <Text style={styles.label}>Maat</Text>
              <View style={styles.maatRow}>
                {product.maten.map((m) => (
                  <TouchableOpacity
                    key={m}
                    onPress={() => setMaat(m)}
                    style={[styles.maatChip, maat === m && styles.maatChipActive]}>
                    <Text style={[styles.maatText, maat === m && styles.maatTextActive]}>{m}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <Text style={styles.label}>Aantal</Text>
          <View style={styles.aantalRow}>
            <TouchableOpacity
              onPress={() => setAantal((n) => Math.max(1, n - 1))}
              style={[styles.aantalKnop, aantal === 1 && styles.aantalKnopUit]}>
              <Text style={styles.aantalKnopText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.aantalWaarde}>{aantal}</Text>
            <TouchableOpacity onPress={() => setAantal((n) => n + 1)} style={styles.aantalKnop}>
              <Text style={styles.aantalKnopText}>+</Text>
            </TouchableOpacity>
          </View>

          {typeof totaal === 'number' && (
            <View style={styles.totaalRow}>
              <Text style={styles.totaalLabel}>Totale prijs</Text>
              <Text style={styles.totaalWaarde}>{euro(totaal)}</Text>
            </View>
          )}

          <TouchableOpacity onPress={() => router.back()} style={styles.navRow}>
            <Text style={styles.navLink}>← Terug naar de shop</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: EkoColors.white,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: EkoColors.white,
  },
  errorText: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.primary,
  },
  heroImage: {
    width: '100%',
    height: 300,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 24,
    letterSpacing: 0.5,
    color: EkoColors.primaryDark,
    marginBottom: 8,
  },
  price: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 20,
    color: EkoColors.primary,
    marginBottom: 14,
  },
  p: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    lineHeight: 23,
    color: EkoColors.paragraphGray,
    marginBottom: 18,
  },
  label: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 14,
    color: EkoColors.primaryDark,
    marginBottom: 8,
  },
  maatRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  maatChip: {
    borderRadius: EkoRadius.tag,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: EkoColors.lightGray,
  },
  maatChipActive: {
    backgroundColor: EkoColors.primary,
  },
  maatText: {
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 13,
    color: EkoColors.paragraphGray,
  },
  maatTextActive: {
    color: EkoColors.white,
  },
  aantalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  aantalKnop: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: EkoColors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aantalKnopUit: {
    opacity: 0.4,
  },
  aantalKnopText: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 18,
    color: EkoColors.primaryDark,
  },
  aantalWaarde: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 16,
    color: EkoColors.primaryDark,
    minWidth: 24,
    textAlign: 'center',
  },
  totaalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: EkoColors.lightGray,
    paddingTop: 16,
    marginBottom: 24,
  },
  totaalLabel: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 15,
    color: EkoColors.primaryDark,
  },
  totaalWaarde: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 20,
    color: EkoColors.primary,
  },
  navRow: {
    marginTop: 4,
  },
  navLink: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 13,
    color: EkoColors.primary,
  },
});
