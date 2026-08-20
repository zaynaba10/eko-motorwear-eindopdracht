import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCardData } from '@/components/product-card';
import { ProductTegel } from '@/components/winkel/product-tegel';
import { EkoColors, EkoFonts, EkoRadius } from '@/constants/eko-theme';
import { fetchWebflowProducts } from '@/lib/webflow-products';
import { HOOFDCATEGORIEEN, MERKEN } from '@/lib/winkel-boom';

/**
 * Startscherm van de app = de winkelpagina van de website.
 * Zelfde opbouw als eko-motorwear.webflow.io/winkel:
 * hero met doorlopende fotogalerij → Onze categorieën → Bestsellers → Onze merken.
 */

const { width: SCHERM_BREEDTE, height: SCHERM_HOOGTE } = Dimensions.get('window');

/* Hero-galerij: dezelfde Webflow-assets als op de website. */
const HERO_FOTOS = [
  'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def/6a7260ea77f40c20eaaa7fa4_harley-davidson-eeTJKC_wz34-unsplash.webp',
  'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def/6a7260ea77f40c20eaaa7fb9_harley-davidson-zGzXsJUBQfs-unsplash.webp',
  'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def/6a7260ea77f40c20eaaa7fc2_roberto-nickson-eXV74Ia7Log-unsplash.webp',
  'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def/6a7260ea77f40c20eaaa7fbb_mike-kienle-2jCCzw83jGU-unsplash.webp',
  'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def/6a7260ea77f40c20eaaa7fb7_zac-wolff-Ptx8G07I6xI-unsplash.webp',
  'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def/6a7260ea77f40c20eaaa7fbf_joe-neric-EGzkhZyFRX4-unsplash.webp',
];

/* Bestsellers in dezelfde volgorde als op de winkelpagina. */
const BESTSELLER_SLUGS = [
  'motorhandschoenen-leder-zwart',
  'systeemhelm-glanzend-zwart',
  'motorlaarzen-corozal-v2-drystar',
  'integraalhelm-rpha-12-anti-venom',
  'motorhandschoenen-rapier-2-rtx',
  'motorbroek-cruiser-pro',
  'motorjas-stour-leder',
  'integraalhelm-wit',
];

const HERO_HOOGTE = Math.max(540, SCHERM_HOOGTE - 140);
const DIA_BREEDTE = Math.round(SCHERM_BREEDTE * 0.66);
const SNELHEID = 0.03; // px per ms, zelfde tempo als de website

/** Oranje accentstreep boven een sectietitel, zoals op de website. */
function Accentstreep({ gecentreerd }: { gecentreerd?: boolean }) {
  return <View style={[styles.accent, gecentreerd && styles.accentMidden]} />;
}

/** Doorlopende, niet-klikbare fotogalerij achter de hero. */
function HeroGalerij() {
  const x = useRef(new Animated.Value(0)).current;
  const totaal = DIA_BREEDTE * HERO_FOTOS.length;

  useEffect(() => {
    const animatie = Animated.loop(
      Animated.timing(x, {
        toValue: -totaal,
        duration: totaal / SNELHEID,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animatie.start();
    return () => animatie.stop();
  }, [totaal, x]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.galerijSpoor, { width: totaal * 2, transform: [{ translateX: x }] }]}>
      {[...HERO_FOTOS, ...HERO_FOTOS].map((uri, i) => (
        <Image
          key={`${uri}-${i}`}
          source={{ uri }}
          style={{ width: DIA_BREEDTE, height: HERO_HOOGTE }}
          contentFit="cover"
        />
      ))}
    </Animated.View>
  );
}

export default function WinkelStartScherm() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const categorieënY = useRef(0);

  const [producten, setProducten] = useState<ProductCardData[]>([]);
  const [laden, setLaden] = useState(true);
  const [fout, setFout] = useState<string | null>(null);
  const [toonTop, setToonTop] = useState(false);

  useEffect(() => {
    fetchWebflowProducts()
      .then((items) => {
        setProducten(items.map((i) => i.card));
        setLaden(false);
      })
      .catch((err) => {
        setFout(err.message);
        setLaden(false);
      });
  }, []);

  const bestsellers = useMemo(() => {
    const opSlug = new Map(producten.map((p) => [p.slug ?? '', p]));
    const gekozen = BESTSELLER_SLUGS.map((s) => opSlug.get(s)).filter(Boolean) as ProductCardData[];
    return gekozen.length > 0 ? gekozen : producten.slice(0, 8);
  }, [producten]);

  const naarCategorieën = useCallback(() => {
    scrollRef.current?.scrollTo({ y: Math.max(0, categorieënY.current - 12), animated: true });
  }, []);

  const naarBoven = useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  const bijScrollen = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setToonTop(e.nativeEvent.contentOffset.y > SCHERM_HOOGTE * 0.6);
  }, []);

  return (
    <View style={styles.scherm}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        onScroll={bijScrollen}
        scrollEventThrottle={32}
        contentContainerStyle={{ paddingBottom: 24 }}>
        {/* ---------- HERO ---------- */}
        <View style={styles.hero}>
          <HeroGalerij />
          <View style={styles.heroWaas} pointerEvents="none" />
          <View style={[styles.heroInhoud, { paddingTop: insets.top + 24 }]}>
            <Accentstreep gecentreerd />
            <Text style={styles.heroTitel}>Ontdek onze volledige collectie</Text>
            <Text style={styles.heroTekst}>
              Van helm tot laarzen — alles voor jouw rit, met persoonlijk advies en topmerken onder
              één dak.
            </Text>
            <Pressable style={styles.heroKnop} onPress={naarCategorieën}>
              <Text style={styles.heroKnopTekst}>Bekijk de categorieën</Text>
            </Pressable>
          </View>
          <Pressable
            style={styles.heroPijl}
            hitSlop={12}
            accessibilityLabel="Ga naar onze categorieën"
            onPress={naarCategorieën}>
            <Ionicons name="chevron-down" size={26} color={EkoColors.white} />
          </Pressable>
        </View>

        {/* ---------- ONZE CATEGORIEËN ---------- */}
        <View
          style={[styles.sectie, styles.sectieLicht]}
          onLayout={(e) => {
            categorieënY.current = e.nativeEvent.layout.y;
          }}>
          <Accentstreep />
          <Text style={styles.sectieTitel}>Onze categorieën</Text>

          <View style={styles.raster}>
            {HOOFDCATEGORIEEN.map((h) => (
              <Pressable
                key={h.slug}
                style={styles.winkeltegel}
                onPress={() => router.push(`/categorie/${h.slug}`)}>
                <View style={styles.tegelKader}>
                  <Image source={{ uri: h.foto }} style={styles.tegelfoto} contentFit="contain" />
                </View>
                <Text style={styles.tegelnaam}>{h.naam}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ---------- BESTSELLERS ---------- */}
        <View style={styles.sectie}>
          <Accentstreep />
          <Text style={styles.sectieTitel}>Bestsellers</Text>

          {laden && <Text style={styles.hulptekst}>Producten laden…</Text>}
          {fout && <Text style={styles.fouttekst}>Fout: {fout}</Text>}

          {!laden && !fout && (
            <View style={styles.raster}>
              {bestsellers.map((p) => (
                <View key={p.id} style={styles.productKolom}>
                  <ProductTegel product={p} onPress={() => router.push(`/product/${p.id}`)} />
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ---------- ONZE MERKEN ---------- */}
        <View style={[styles.sectie, styles.sectieLicht]}>
          <Accentstreep />
          <Text style={styles.sectieTitel}>Onze merken</Text>
          <View style={styles.merkenRij}>
            {MERKEN.map((merk) => (
              <View key={merk} style={styles.merkKaart}>
                <Text style={styles.merkTekst}>{merk}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ---------- TERUG NAAR BOVEN ---------- */}
      {toonTop && (
        <Pressable style={styles.topKnop} onPress={naarBoven} accessibilityLabel="Terug naar boven">
          <Ionicons name="chevron-up" size={22} color={EkoColors.white} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scherm: {
    flex: 1,
    backgroundColor: EkoColors.white,
  },

  /* HERO */
  hero: {
    height: HERO_HOOGTE,
    backgroundColor: EkoColors.primaryDark,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  galerijSpoor: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  heroWaas: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(22,35,46,0.58)',
  },
  heroInhoud: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  heroTitel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: 1,
    color: EkoColors.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  heroTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.88)',
    textAlign: 'center',
    marginBottom: 28,
  },
  heroKnop: {
    backgroundColor: EkoColors.primary,
    borderRadius: EkoRadius.pill,
    paddingVertical: 15,
    paddingHorizontal: 28,
  },
  heroKnopTekst: {
    fontFamily: EkoFonts.headingMedium,
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: EkoColors.white,
  },
  heroPijl: {
    position: 'absolute',
    bottom: 22,
    alignSelf: 'center',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* SECTIES */
  sectie: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 44,
    backgroundColor: EkoColors.white,
  },
  sectieLicht: {
    backgroundColor: EkoColors.lightGray,
  },
  accent: {
    width: 56,
    height: 4,
    borderRadius: 2,
    backgroundColor: EkoColors.primary,
    marginBottom: 18,
  },
  accentMidden: {
    alignSelf: 'center',
  },
  sectieTitel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: 0.5,
    color: EkoColors.primaryDark,
    marginBottom: 28,
  },
  hulptekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.paragraphGray,
  },
  fouttekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.primary,
  },

  /* RASTER — 2 per scherm, zoals de tegels op de website */
  raster: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  productKolom: {
    width: (SCHERM_BREEDTE - 32 - 14) / 2,
  },

  /* CATEGORIETEGEL — witte kaart met contain-foto, zoals live */
  winkeltegel: {
    width: (SCHERM_BREEDTE - 32 - 14) / 2,
  },
  tegelKader: {
    backgroundColor: EkoColors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(22,35,46,0.08)',
    padding: 6,
    shadowColor: EkoColors.primaryDark,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tegelfoto: {
    width: '100%',
    aspectRatio: 4 / 5,
    borderRadius: 12,
  },
  tegelnaam: {
    marginTop: 12,
    fontFamily: EkoFonts.headingMedium,
    fontSize: 15,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: EkoColors.primaryDark,
  },

  /* MERKEN */
  merkenRij: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  merkKaart: {
    backgroundColor: EkoColors.white,
    borderRadius: EkoRadius.pill,
    borderWidth: 1,
    borderColor: EkoColors.lightSteelBlue,
    paddingVertical: 11,
    paddingHorizontal: 18,
  },
  merkTekst: {
    fontFamily: EkoFonts.headingMedium,
    fontSize: 14,
    letterSpacing: 0.5,
    color: EkoColors.primaryDark,
  },

  /* TERUG NAAR BOVEN */
  topKnop: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: EkoColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
});
