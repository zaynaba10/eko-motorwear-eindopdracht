import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCardData } from '@/components/product-card';
import { ProductTegel } from '@/components/winkel/product-tegel';
import { SectieKop } from '@/components/winkel/sectie-kop';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { datumKort } from '@/lib/format';
import { groepeerSecties, parseRichText } from '@/lib/rich-text';
import { BlogDetails, fetchWebflowBlog, fetchWebflowBlogs } from '@/lib/webflow-blogs';
import { fetchWebflowProducts } from '@/lib/webflow-products';

/**
 * Artikelpagina (app/blog/[id].tsx). De ID komt binnen via de route en het
 * artikel wordt opgehaald met het endpoint per blog. Opbouw zoals de rest van
 * de app: hero → intro → secties in wit/sectiegrijs → shop → over de auteur →
 * lees meer.
 */
export default function BlogArtikelScherm() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [blog, setBlog] = useState<BlogDetails | null>(null);
  const [andere, setAndere] = useState<BlogDetails[]>([]);
  const [producten, setProducten] = useState<ProductCardData[]>([]);
  const [laden, setLaden] = useState(true);
  const [fout, setFout] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLaden(true);
    fetchWebflowBlog(id)
      .then((item) => {
        setBlog(item);
        setLaden(false);
      })
      .catch((err) => {
        setFout(err.message);
        setLaden(false);
      });
  }, [id]);

  useEffect(() => {
    fetchWebflowBlogs()
      .then(setAndere)
      .catch(() => {});
    fetchWebflowProducts()
      .then((items) => setProducten(items.map((i) => i.card)))
      .catch(() => {});
  }, []);

  /* Secties uit de rich text: elk tussenkopje start een nieuw blok. */
  const secties = useMemo(() => groepeerSecties(parseRichText(blog?.bodyHtml)), [blog?.bodyHtml]);

  /* "Lees meer": eerst artikels uit dezelfde categorie, daarna de rest. */
  const leesMeer = useMemo(() => {
    const rest = andere.filter((b) => b.id !== id);
    const zelfde = rest.filter((b) => b.categoryId && b.categoryId === blog?.categoryId);
    return [...zelfde, ...rest.filter((b) => !zelfde.includes(b))].slice(0, 2);
  }, [andere, id, blog?.categoryId]);

  const shop = producten.slice(0, 8);

  const Kop = (
    <View style={[styles.kop, { paddingTop: insets.top + 6 }]}>
      <Pressable style={styles.rondeKnop} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={22} color={EkoColors.primaryDark} />
      </Pressable>
      <Text style={styles.kopTitel}>Inspiratie</Text>
      <View style={styles.rondeKnop} />
    </View>
  );

  if (laden) {
    return (
      <View style={styles.scherm}>
        <Stack.Screen options={{ headerShown: false }} />
        {Kop}
        <View style={styles.midden}>
          <ActivityIndicator size="large" color={EkoColors.primary} />
        </View>
      </View>
    );
  }

  if (fout || !blog) {
    return (
      <View style={styles.scherm}>
        <Stack.Screen options={{ headerShown: false }} />
        {Kop}
        <View style={styles.midden}>
          <Text style={styles.foutTekst}>{fout ? `Fout: ${fout}` : 'Artikel niet gevonden.'}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.scherm}>
      <Stack.Screen options={{ headerShown: false }} />
      {Kop}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* ------------------------------------------------------- hero */}
        {blog.imageUrl ? (
          <Image
            source={{ uri: blog.imageUrl }}
            style={styles.hero}
            contentFit="cover"
            accessibilityLabel={blog.altText}
          />
        ) : (
          <View style={[styles.hero, styles.fotoLeeg]} />
        )}

        {/* ------------------------------------------------- titelblok */}
        <View style={styles.titelVlak}>
          <View style={styles.metaRij}>
            {!!blog.categoryName && <Text style={styles.categorie}>{blog.categoryName}</Text>}
            <Text style={styles.datum}>{datumKort(blog.date)}</Text>
          </View>
          <Text style={styles.titel}>{blog.name}</Text>
          {!!blog.summary && <Text style={styles.intro}>{blog.summary}</Text>}
        </View>

        {/* ----------------------------------------------------- secties */}
        {secties.map((sectie, i) => (
          <View key={i} style={i % 2 === 0 ? styles.sectieLicht : styles.sectie}>
            {!!sectie.kop && <Text style={styles.sectieKop}>{sectie.kop}</Text>}
            {sectie.blokken.map((blok, j) => {
              if (blok.type === 'li') {
                return (
                  <View key={j} style={styles.puntRij}>
                    <Ionicons name="checkmark" size={16} color={EkoColors.primary} />
                    <Text style={styles.puntTekst}>{blok.text}</Text>
                  </View>
                );
              }
              if (blok.type === 'quote') {
                return (
                  <Text key={j} style={styles.citaat}>
                    {blok.text}
                  </Text>
                );
              }
              return (
                <Text key={j} style={styles.alinea}>
                  {blok.text}
                </Text>
              );
            })}
          </View>
        ))}

        {/* -------------------------------------------- shop bij artikel */}
        {shop.length > 0 && (
          <View style={styles.shopVlak}>
            <SectieKop titel="Shop dit artikel" klein onMeer={() => router.push('/explore')} />
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

        {/* -------------------------------------------- over de auteur */}
        <View style={styles.auteurVlak}>
          <Text style={styles.auteurKop}>Over de auteur</Text>
          <Text style={styles.auteurTekst}>
            Het team van EKO Motorwear rijdt zelf en test wat we verkopen. In deze artikels delen we
            wat we onderweg en in de showroom leren over motorkledij, veiligheid en onderhoud.
          </Text>
          <View style={styles.auteurRij}>
            {blog.authorImageUrl ? (
              <Image source={{ uri: blog.authorImageUrl }} style={styles.auteurFoto} />
            ) : (
              <View style={[styles.auteurFoto, styles.fotoLeeg]} />
            )}
            <View style={styles.auteurNamen}>
              <Text style={styles.auteurNaam}>
                Geschreven door {blog.authorName || 'EKO Motorwear'}
              </Text>
              <Text style={styles.auteurRol}>{blog.categoryName || 'Redactie'} · EKO Motorwear</Text>
            </View>
          </View>
        </View>

        {/* ------------------------------------------------- lees meer */}
        {leesMeer.length > 0 && (
          <View style={styles.leesMeerVlak}>
            <SectieKop titel="Lees meer" onMeer={() => router.push('/blog')} />
            <View style={styles.leesMeerRij}>
              {leesMeer.map((b) => (
                <Pressable
                  key={b.id}
                  style={styles.leesMeerKaart}
                  onPress={() => router.push(`/blog/${b.id}`)}>
                  {b.imageUrl ? (
                    <Image source={{ uri: b.imageUrl }} style={styles.leesMeerFoto} contentFit="cover" />
                  ) : (
                    <View style={[styles.leesMeerFoto, styles.fotoLeeg]} />
                  )}
                  <View style={styles.leesMeerTekst}>
                    {!!b.categoryName && <Text style={styles.categorie}>{b.categoryName}</Text>}
                    <Text style={styles.leesMeerTitel} numberOfLines={3}>
                      {b.name}
                    </Text>
                    <Text style={styles.datum}>{datumKort(b.date)}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const RAND = 16;

const styles = StyleSheet.create({
  scherm: { flex: 1, backgroundColor: EkoColors.white },
  midden: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  foutTekst: { fontFamily: EkoFonts.bodyRegular, fontSize: 15, color: EkoColors.primary },
  fotoLeeg: { backgroundColor: EkoColors.lightSteelBlue },

  kop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 10,
    gap: 8,
    backgroundColor: EkoColors.white,
  },
  rondeKnop: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: EkoColors.lightGray,
  },
  kopTitel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: EkoFonts.headingBold,
    fontSize: 17,
    letterSpacing: 0.3,
    color: EkoColors.primaryDark,
  },

  hero: { width: '100%', aspectRatio: 4 / 3, backgroundColor: EkoColors.lightGray },

  titelVlak: { paddingHorizontal: RAND, paddingTop: 18, paddingBottom: 22 },
  metaRij: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categorie: {
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: EkoColors.paragraphGray,
  },
  datum: { fontFamily: EkoFonts.bodyRegular, fontSize: 12, color: EkoColors.paragraphGray },
  titel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 27,
    lineHeight: 33,
    color: EkoColors.primaryDark,
    marginBottom: 10,
  },
  intro: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    lineHeight: 23,
    color: EkoColors.paragraphGray,
  },

  sectie: { paddingHorizontal: RAND, paddingVertical: 24, backgroundColor: EkoColors.white },
  sectieLicht: { paddingHorizontal: RAND, paddingVertical: 24, backgroundColor: EkoColors.lightGray },
  sectieKop: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 20,
    lineHeight: 26,
    color: EkoColors.primaryDark,
    marginBottom: 10,
  },
  alinea: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    lineHeight: 22,
    color: EkoColors.paragraphGray,
    marginBottom: 10,
  },
  puntRij: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  puntTekst: {
    flex: 1,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    color: EkoColors.primaryDark,
  },
  citaat: {
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 15,
    lineHeight: 24,
    color: EkoColors.primaryDark,
    borderLeftWidth: 3,
    borderLeftColor: EkoColors.primary,
    paddingLeft: 12,
    marginBottom: 12,
  },

  shopVlak: { paddingTop: 26, paddingBottom: 30, backgroundColor: EkoColors.white },
  rij: { paddingHorizontal: RAND, gap: 12 },

  auteurVlak: { paddingHorizontal: RAND, paddingVertical: 26, backgroundColor: EkoColors.lightGray },
  auteurKop: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 20,
    color: EkoColors.primaryDark,
    marginBottom: 10,
  },
  auteurTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    lineHeight: 22,
    color: EkoColors.paragraphGray,
    marginBottom: 16,
  },
  auteurRij: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  auteurFoto: { width: 48, height: 48, borderRadius: 24, backgroundColor: EkoColors.lightSteelBlue },
  auteurNamen: { flex: 1 },
  auteurNaam: { fontFamily: EkoFonts.bodyBold, fontSize: 14, color: EkoColors.primaryDark },
  auteurRol: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 13,
    color: EkoColors.paragraphGray,
    marginTop: 2,
  },

  leesMeerVlak: { paddingTop: 30, backgroundColor: EkoColors.white },
  leesMeerRij: { flexDirection: 'row' },
  leesMeerKaart: { flex: 1 },
  leesMeerFoto: { width: '100%', aspectRatio: 1, backgroundColor: EkoColors.lightGray },
  leesMeerTekst: { paddingHorizontal: 12, paddingTop: 10 },
  leesMeerTitel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 16,
    lineHeight: 21,
    color: EkoColors.primaryDark,
    marginTop: 4,
    marginBottom: 6,
  },
});
