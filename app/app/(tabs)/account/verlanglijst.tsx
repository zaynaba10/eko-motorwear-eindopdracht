import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { LegeStaat, Scherm } from '@/components/account-ui';
import { ProductCardData } from '@/components/product-card';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { prijsKort } from '@/lib/format';
import { useVerlanglijst, verwijderVanVerlanglijst } from '@/lib/verlanglijst';
import { fetchWebflowProducts } from '@/lib/webflow-products';

/**
 * Verlanglijst binnen Mijn account. Leest dezelfde gedeelde lijst als het
 * verlanglijst-tabblad, dus alles wat je met een hartje bewaart, staat hier
 * meteen ook in je dashboard.
 */
export default function AccountVerlanglijst() {
  const router = useRouter();
  const lijst = useVerlanglijst();

  const [producten, setProducten] = useState<ProductCardData[]>([]);
  const [laden, setLaden] = useState(true);

  useEffect(() => {
    fetchWebflowProducts()
      .then((items) => {
        setProducten(items.map((i) => i.card));
        setLaden(false);
      })
      .catch(() => setLaden(false));
  }, []);

  const regels = useMemo(
    () =>
      lijst
        .map((item) => producten.find((p) => p.id === item.productId))
        .filter(Boolean) as ProductCardData[],
    [lijst, producten]
  );

  return (
    <Scherm titel="Verlanglijst">
      {laden ? (
        <View style={styles.midden}>
          <ActivityIndicator size="large" color={EkoColors.primary} />
        </View>
      ) : regels.length === 0 ? (
        <LegeStaat
          icoon="heart-outline"
          titel="Je verlanglijst is leeg"
          tekst="Tik op het hartje bij een product om het hier te bewaren. Zo vind je het later makkelijk terug."
        />
      ) : (
        <View style={styles.lijst}>
          <Text style={styles.telling}>
            {regels.length} {regels.length === 1 ? 'artikel' : 'artikelen'} bewaard
          </Text>

          {regels.map((p) => (
            <Pressable
              key={p.id}
              style={styles.rij}
              onPress={() => router.push(`/product/${p.id}`)}>
              <View style={styles.fotoVlak}>
                {p.imageUrl ? (
                  <Image source={{ uri: p.imageUrl }} style={styles.foto} contentFit="cover" />
                ) : (
                  <View style={[styles.foto, styles.fotoLeeg]}>
                    <Ionicons name="image-outline" size={22} color={EkoColors.darkGray} />
                  </View>
                )}
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.merk} numberOfLines={1}>
                  {p.merk || p.name}
                </Text>
                <Text style={styles.naam} numberOfLines={2}>
                  {p.name}
                </Text>
                {typeof p.priceEuro === 'number' && (
                  <Text style={styles.prijs}>{prijsKort(p.priceEuro)}</Text>
                )}
              </View>

              <Pressable
                hitSlop={10}
                accessibilityLabel={`${p.name} van verlanglijst halen`}
                onPress={() => verwijderVanVerlanglijst(p.id)}>
                <Ionicons name="close" size={22} color={EkoColors.primaryDark} />
              </Pressable>
            </Pressable>
          ))}
        </View>
      )}
    </Scherm>
  );
}

const styles = StyleSheet.create({
  midden: { paddingVertical: 60, alignItems: 'center' },
  lijst: { paddingHorizontal: 16, paddingTop: 8 },
  telling: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    color: EkoColors.paragraphGray,
    marginBottom: 14,
  },
  rij: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: EkoColors.lightSteelBlue,
  },
  fotoVlak: { width: 74, backgroundColor: '#F4F4F2' },
  foto: { width: '100%', aspectRatio: 3 / 4 },
  fotoLeeg: { alignItems: 'center', justifyContent: 'center' },
  merk: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 15,
    color: EkoColors.primaryDark,
  },
  naam: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    lineHeight: 19,
    color: EkoColors.paragraphGray,
    marginTop: 2,
  },
  prijs: {
    marginTop: 6,
    fontFamily: EkoFonts.bodyBold,
    fontSize: 15,
    color: EkoColors.primaryDark,
  },
});
