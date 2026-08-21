import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCardData } from '@/components/product-card';
import { CategorieTegel } from '@/components/winkel/categorie-tegel';
import { ProductTegel } from '@/components/winkel/product-tegel';
import { SectieKop } from '@/components/winkel/sectie-kop';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { MERKEN_MET_LOGO } from '@/lib/merken';
import { fetchCategorieIds } from '@/lib/webflow-categories';
import { fetchWebflowProducts } from '@/lib/webflow-products';
import { vindHoofdcategorie } from '@/lib/winkel-boom';

/**
 * Hoofdcategoriepagina, opgebouwd zoals de rest van de app: een raster met de
 * subcategorieën, de merklogo's en de bestsellers van deze categorie.
 */

const { width: BREEDTE } = Dimensions.get('window');
const RAND = 16;
const KOLOM = (BREEDTE - RAND * 2 - 12) / 2;

export default function CategorieScherm() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const hoofd = vindHoofdcategorie(slug ?? '');

  const [producten, setProducten] = useState<ProductCardData[]>([]);
  const [catIds, setCatIds] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchWebflowProducts()
      .then((items) => setProducten(items.map((i) => i.card)))
      .catch(() => {});
    fetchCategorieIds()
      .then(setCatIds)
      .catch(() => {});
  }, []);

  /* Producten die bij deze hoofdcategorie horen (hoofd- of subcategorie-id). */
  const eigenProducten = useMemo(() => {
    if (!hoofd) return [];
    const ids = new Set(
      [hoofd.slug, ...hoofd.subs.map((s) => s.slug)].map((s) => catIds[s]).filter(Boolean)
    );
    if (!ids.size) return [];
    return producten.filter((p) => (p.categorieIds || []).some((id) => ids.has(id)));
  }, [hoofd, producten, catIds]);

  if (!hoofd) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.leegTekst}>Categorie niet gevonden.</Text>
      </View>
    );
  }

  const bestsellers = eigenProducten.slice(0, 6);

  return (
    <View style={styles.scherm}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Kop: terugknop links, titel gecentreerd */}
      <View style={[styles.kop, { paddingTop: insets.top + 6 }]}>
        <Pressable style={styles.rondeKnop} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={EkoColors.primaryDark} />
        </Pressable>
        <View style={styles.kopMidden}>
          <Text style={styles.kopTitel} numberOfLines={1}>
            {hoofd.naam}
          </Text>
          <Text style={styles.kopAantal}>
            {eigenProducten.length} {eigenProducten.length === 1 ? 'artikel' : 'artikelen'}
          </Text>
        </View>
        <View style={styles.rondeKnop} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 50 }} showsVerticalScrollIndicator={false}>
        {/* --------------------------------------------- subcategorieën */}
        <View style={styles.sectie}>
          <SectieKop
            titel={hoofd.naam}
            onMeer={() => router.push(`/lijst/${hoofd.slug}?alles=1`)}
          />
          <View style={styles.raster}>
            {hoofd.subs.map((s) => (
              <View key={s.slug} style={{ width: KOLOM }}>
                <CategorieTegel
                  naam={s.naam}
                  foto={s.foto}
                  onPress={() => router.push(`/lijst/${s.slug}`)}
                />
              </View>
            ))}
          </View>

          <Pressable
            style={styles.allesKnop}
            onPress={() => router.push(`/lijst/${hoofd.slug}?alles=1`)}>
            <Text style={styles.allesKnopTekst}>
              Bekijk alle {hoofd.naam.toLowerCase()} ({eigenProducten.length})
            </Text>
          </Pressable>
        </View>

        {/* ---------------------------------------------- merken (logo's) */}
        <View style={styles.sectieLicht}>
          <SectieKop titel="Onze merken" onMeer={() => router.push('/merken')} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rij}>
            {MERKEN_MET_LOGO.slice(0, 12).map((m) => (
              <Pressable
                key={m.naam}
                style={styles.merkTegel}
                accessibilityLabel={`Producten van ${m.naam}`}
                onPress={() => router.push(`/zoeken/${encodeURIComponent(m.naam)}`)}>
                <View style={styles.merkLogoVlak}>
                  <Image source={{ uri: m.logo }} style={styles.merkLogo} contentFit="contain" />
                </View>
                <Text style={styles.merkNaam} numberOfLines={1}>
                  {m.naam}
                </Text>
              </Pressable>
            ))}

            <Pressable
              style={styles.merkTegel}
              accessibilityLabel="Alle merken bekijken"
              onPress={() => router.push('/merken')}>
              <View style={[styles.merkLogoVlak, styles.meerVlak]}>
                <Ionicons name="arrow-forward" size={22} color={EkoColors.white} />
              </View>
              <Text style={[styles.merkNaam, styles.meerNaam]}>Meer</Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* ------------------------------------------------- bestsellers */}
        {bestsellers.length > 0 && (
          <View style={styles.sectie}>
            <SectieKop
              titel="Bestsellers"
              onMeer={() => router.push(`/lijst/${hoofd.slug}?alles=1`)}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rij}>
              {bestsellers.map((p) => (
                <ProductTegel
                  key={p.id}
                  product={p}
                  breedte={160}
                  onPress={() => router.push(`/product/${p.id}`)}
                />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scherm: { flex: 1, backgroundColor: EkoColors.white },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: EkoColors.white,
  },
  leegTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.paragraphGray,
  },

  kop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  rondeKnop: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: EkoColors.lightGray,
  },
  kopMidden: { flex: 1, alignItems: 'center' },
  kopTitel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 17,
    letterSpacing: 0.3,
    color: EkoColors.primaryDark,
  },
  kopAantal: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 12,
    color: EkoColors.paragraphGray,
    marginTop: 2,
  },

  sectie: { paddingTop: 26, paddingBottom: 30, backgroundColor: EkoColors.white },
  sectieLicht: { paddingTop: 26, paddingBottom: 30, backgroundColor: EkoColors.lightGray },
  rij: { paddingHorizontal: RAND, gap: 12 },
  raster: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: RAND,
    gap: 12,
  },

  allesKnop: {
    marginTop: 26,
    marginHorizontal: RAND,
    backgroundColor: EkoColors.primaryDark,
    paddingVertical: 15,
    alignItems: 'center',
  },
  allesKnopTekst: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 15,
    color: EkoColors.white,
  },

  merkTegel: { width: 108 },
  merkLogoVlak: {
    height: 72,
    backgroundColor: EkoColors.white,
    borderWidth: 1,
    borderColor: 'rgba(22,35,46,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  merkLogo: { width: '100%', height: '100%' },
  meerVlak: {
    backgroundColor: EkoColors.primaryDark,
    borderColor: EkoColors.primaryDark,
  },
  merkNaam: {
    marginTop: 8,
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 12,
    textAlign: 'center',
    color: EkoColors.primaryDark,
  },
  meerNaam: { fontFamily: EkoFonts.bodyBold },
});
