import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCardData } from '@/components/product-card';
import { CategorieTegel } from '@/components/winkel/categorie-tegel';
import { ProductTegel } from '@/components/winkel/product-tegel';
import { EkoColors, EkoFonts, EkoRadius } from '@/constants/eko-theme';
import { fetchCategorieIds } from '@/lib/webflow-categories';
import { fetchWebflowProducts } from '@/lib/webflow-products';
import { MERKEN, vindHoofdcategorie } from '@/lib/winkel-boom';

/**
 * Hoofdcategoriepagina in warenhuisstijl (zelfde structuur als op de website):
 * bovenaan een tegeloverzicht van alle subcategorieën, daaronder de merken en
 * de bestsellers van deze categorie.
 */
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
      [hoofd.slug, ...hoofd.subs.map((s) => s.slug)]
        .map((s) => catIds[s])
        .filter(Boolean)
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
        <Pressable style={styles.terugKnop} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={EkoColors.primaryDark} />
        </Pressable>
        <Text style={styles.kopTitel}>{hoofd.naam}</Text>
        <View style={styles.terugKnopRuimte} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {/* Sectietitel met pijl naar het volledige overzicht */}
        <Pressable
          style={styles.sectieKopRij}
          onPress={() => router.push(`/lijst/${hoofd.slug}?alles=1`)}>
          <Text style={styles.sectieKop}>{hoofd.naam}</Text>
          <Ionicons name="arrow-forward" size={24} color={EkoColors.primaryDark} />
        </Pressable>

        {/* Tegels van alle subcategorieën */}
        <View style={styles.tegelRooster}>
          {hoofd.subs.map((s) => (
            <View key={s.slug} style={styles.tegelCel}>
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

        {/* Merken */}
        <View style={styles.merkenSectie}>
          <Text style={styles.sectieKop}>Onze merken</Text>
          <View style={styles.merkenRooster}>
            {MERKEN.map((m) => (
              <View key={m} style={styles.merkTegel}>
                <Text style={styles.merkTekst}>{m}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bestsellers */}
        {bestsellers.length > 0 && (
          <View style={styles.bestsellersSectie}>
            <Pressable
              style={styles.sectieKopRij}
              onPress={() => router.push(`/lijst/${hoofd.slug}?alles=1`)}>
              <Text style={styles.sectieKop}>Bestsellers</Text>
              <Ionicons name="arrow-forward" size={24} color={EkoColors.primaryDark} />
            </Pressable>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.bestsellersRij}>
              {bestsellers.map((p) => (
                <ProductTegel
                  key={p.id}
                  product={p}
                  breedte={170}
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
  scherm: {
    flex: 1,
    backgroundColor: EkoColors.white,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: EkoColors.white,
  },
  kop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  terugKnop: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: EkoColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: EkoColors.primaryDark,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  terugKnopRuimte: {
    width: 42,
  },
  kopTitel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: EkoFonts.headingMedium,
    fontSize: 17,
    letterSpacing: 0.5,
    color: EkoColors.primaryDark,
  },
  sectieKopRij: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 14,
  },
  sectieKop: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 26,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: EkoColors.primaryDark,
  },
  tegelRooster: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    columnGap: 16,
    rowGap: 24,
  },
  tegelCel: {
    width: '47%',
    flexGrow: 1,
  },
  allesKnop: {
    marginTop: 28,
    marginHorizontal: 16,
    backgroundColor: EkoColors.primaryDark,
    borderRadius: EkoRadius.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  allesKnopTekst: {
    fontFamily: EkoFonts.headingMedium,
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: EkoColors.white,
  },
  merkenSectie: {
    marginTop: 36,
    backgroundColor: EkoColors.lightGray,
    paddingBottom: 20,
  },
  merkenRooster: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
  },
  merkTegel: {
    backgroundColor: EkoColors.white,
    borderRadius: EkoRadius.tag,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  merkTekst: {
    fontFamily: EkoFonts.headingMedium,
    fontSize: 13,
    letterSpacing: 0.5,
    color: EkoColors.primaryDark,
  },
  bestsellersSectie: {
    marginTop: 8,
  },
  bestsellersRij: {
    paddingHorizontal: 16,
    gap: 14,
  },
  leegTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.paragraphGray,
  },
});
