import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ProductCardData } from '@/components/product-card';
import { ProductTegel } from '@/components/winkel/product-tegel';
import { SectieKop } from '@/components/winkel/sectie-kop';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { datumKort } from '@/lib/format';
import { MERKEN_MET_LOGO } from '@/lib/merken';
import { BlogCategory, BlogDetails, fetchWebflowBlogCategories, fetchWebflowBlogs } from '@/lib/webflow-blogs';
import { fetchWebflowProducts } from '@/lib/webflow-products';

/**
 * Inspiratie-overzicht: de blogpagina van de website, opgebouwd zoals de rest
 * van de app. Bovenaan een balk met de categorieën, daaronder de artikels als
 * brede kaarten. Tussendoor tonen we de shop en de merken, zodat de lezer
 * meteen kan doorklikken naar de winkel.
 */

const RAND = 16;

export function BlogOverzicht({ bovenRuimte = 0 }: { bovenRuimte?: number }) {
  const router = useRouter();

  const [blogs, setBlogs] = useState<BlogDetails[]>([]);
  const [categorieen, setCategorieen] = useState<BlogCategory[]>([]);
  const [producten, setProducten] = useState<ProductCardData[]>([]);
  const [laden, setLaden] = useState(true);
  const [actief, setActief] = useState<string>('alles');

  useEffect(() => {
    Promise.all([fetchWebflowBlogs(), fetchWebflowBlogCategories()])
      .then(([posts, cats]) => {
        setBlogs(posts);
        setCategorieen(cats);
        setLaden(false);
      })
      .catch(() => setLaden(false));

    fetchWebflowProducts()
      .then((items) => setProducten(items.map((i) => i.card)))
      .catch(() => {});
  }, []);

  /* Alleen categorieën tonen waar ook echt artikels in zitten. */
  const chips = useMemo(() => {
    const gebruikt = new Set(blogs.map((b) => b.categoryId).filter(Boolean) as string[]);
    return categorieen.filter((c) => gebruikt.has(c.id));
  }, [blogs, categorieen]);

  const zichtbaar = useMemo(
    () => (actief === 'alles' ? blogs : blogs.filter((b) => b.categoryId === actief)),
    [blogs, actief]
  );

  const actieveNaam = chips.find((c) => c.id === actief)?.name;
  const shop = producten.slice(0, 8);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={[styles.kop, { paddingTop: bovenRuimte }]}>
        <Text style={styles.paginaTitel}>
          Inspiratie{actieveNaam ? ` ${actieveNaam.toLowerCase()}` : ''}
        </Text>
      </View>

      {/* -------------------------------------------------- categoriebalk */}
      <View style={styles.chipsBalk}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRij}>
          {[{ id: 'alles', name: 'Alles' }, ...chips].map((c) => {
            const aan = c.id === actief;
            return (
              <Pressable
                key={c.id}
                style={[styles.chip, aan && styles.chipAan]}
                onPress={() => setActief(c.id)}>
                <Text style={[styles.chipTekst, aan && styles.chipTekstAan]} numberOfLines={1}>
                  {c.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {laden && <Text style={styles.hulptekst}>Artikels laden…</Text>}
      {!laden && zichtbaar.length === 0 && (
        <Text style={styles.hulptekst}>Nog geen artikels in deze categorie.</Text>
      )}

      {/* ------------------------------------------------------- artikels */}
      {zichtbaar.map((b, i) => (
        <View key={b.id}>
          <Pressable style={styles.kaart} onPress={() => router.push(`/blog/${b.id}`)}>
            {b.imageUrl ? (
              <Image
                source={{ uri: b.imageUrl }}
                style={styles.kaartFoto}
                contentFit="cover"
                accessibilityLabel={b.altText}
              />
            ) : (
              <View style={[styles.kaartFoto, styles.fotoLeeg]} />
            )}
            <View style={styles.kaartTekst}>
              {!!b.categoryName && <Text style={styles.categorie}>{b.categoryName}</Text>}
              <Text style={styles.kaartTitel} numberOfLines={3}>
                {b.name}
              </Text>
              <Text style={styles.datum}>{datumKort(b.date)}</Text>
            </View>
          </Pressable>

          {/* Na twee artikels: de shop. */}
          {i === 1 && shop.length > 0 && (
            <View style={styles.sectieLicht}>
              <SectieKop titel="Shop de collectie" onMeer={() => router.push('/explore')} />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.rij}>
                {shop.map((p) => (
                  <ProductTegel
                    key={p.id}
                    product={p}
                    breedte={150}
                    onPress={() => router.push(`/product/${p.id}`)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Na vier artikels: de merken. */}
          {i === 3 && (
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
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  kop: { paddingHorizontal: RAND, paddingBottom: 10, backgroundColor: EkoColors.white },
  paginaTitel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: 0.3,
    color: EkoColors.primaryDark,
  },

  chipsBalk: {
    flexGrow: 0,
    flexShrink: 0,
    paddingVertical: 10,
    backgroundColor: EkoColors.white,
  },
  chipsRij: { paddingHorizontal: RAND, gap: 8 },
  chip: {
    height: 34,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: EkoColors.lightSteelBlue,
    backgroundColor: EkoColors.white,
  },
  chipAan: { backgroundColor: EkoColors.primaryDark, borderColor: EkoColors.primaryDark },
  chipTekst: { fontFamily: EkoFonts.bodyMedium, fontSize: 13, color: EkoColors.primaryDark },
  chipTekstAan: { color: EkoColors.white },

  hulptekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    color: EkoColors.paragraphGray,
    paddingHorizontal: RAND,
    paddingVertical: 16,
  },

  kaart: { marginBottom: 24 },
  kaartFoto: { width: '100%', aspectRatio: 4 / 3, backgroundColor: EkoColors.lightGray },
  fotoLeeg: { backgroundColor: EkoColors.lightSteelBlue },
  kaartTekst: { paddingHorizontal: RAND, paddingTop: 12 },
  categorie: {
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: EkoColors.paragraphGray,
    marginBottom: 6,
  },
  kaartTitel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 20,
    lineHeight: 26,
    color: EkoColors.primaryDark,
    marginBottom: 6,
  },
  datum: { fontFamily: EkoFonts.bodyRegular, fontSize: 13, color: EkoColors.paragraphGray },

  sectieLicht: {
    paddingTop: 24,
    paddingBottom: 28,
    marginBottom: 24,
    backgroundColor: EkoColors.lightGray,
  },
  rij: { paddingHorizontal: RAND, gap: 12 },

  merkTegel: { width: 100 },
  merkLogoVlak: {
    height: 66,
    backgroundColor: EkoColors.white,
    borderWidth: 1,
    borderColor: 'rgba(22,35,46,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  merkLogo: { width: '100%', height: '100%' },
  meerVlak: { backgroundColor: EkoColors.primaryDark, borderColor: EkoColors.primaryDark },
  merkNaam: {
    marginTop: 8,
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 12,
    textAlign: 'center',
    color: EkoColors.primaryDark,
  },
  meerNaam: { fontFamily: EkoFonts.bodyBold },
});
