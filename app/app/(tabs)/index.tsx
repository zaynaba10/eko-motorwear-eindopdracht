import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCardData } from '@/components/product-card';
import { CollectieKaart } from '@/components/winkel/collectie-kaart';
import { SectieKop } from '@/components/winkel/sectie-kop';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { datumKort } from '@/lib/format';
import { laatstBekeken, verwijderBekeken } from '@/lib/laatst-bekeken';
import { BlogDetails, fetchWebflowBlogs } from '@/lib/webflow-blogs';
import { MERKEN_MET_LOGO } from '@/lib/merken';
import { fetchWebflowProducts } from '@/lib/webflow-products';
import { HOOFDCATEGORIEEN } from '@/lib/winkel-boom';

/**
 * Startscherm van de app: de winkelpagina in warenhuisstijl.
 * Opbouw: zwevende afdelingskeuze → hero → categorieën → laatst bekeken →
 * uitgelicht → nieuwe collectie → inspiratie → merken → merkcampagnes.
 */

const { width: BREEDTE } = Dimensions.get('window');
const RAND = 16;
const KOLOM = (BREEDTE - RAND * 2 - 12) / 2;

const HERO_FOTO =
  'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def/6a7260ea77f40c20eaaa7fa4_harley-davidson-eeTJKC_wz34-unsplash.webp';
const UITGELICHT_FOTO =
  'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def/6a7260ea77f40c20eaaa7fb5_roberto-nickson-D1F7OtbbvKc-unsplash.webp';
const CAMPAGNE_A =
  'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def/6a7260ea77f40c20eaaa7fb7_zac-wolff-Ptx8G07I6xI-unsplash.webp';
const CAMPAGNE_B =
  'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def/6a7260ea77f40c20eaaa7fbb_mike-kienle-2jCCzw83jGU-unsplash.webp';

/* ---------------------------------------------------------------- hero ---- */

function Banner({
  foto,
  bovenkop,
  titel,
  knop,
  hoogte,
  onPress,
}: {
  foto: string;
  bovenkop: string;
  titel: string;
  knop: string;
  hoogte: number;
  onPress: () => void;
}) {
  return (
    <View style={[styles.banner, { height: hoogte }]}>
      <Image source={{ uri: foto }} style={StyleSheet.absoluteFill} contentFit="cover" />
      <View style={styles.bannerWaas} pointerEvents="none" />
      <View style={styles.bannerInhoud}>
        <Text style={styles.bannerBovenkop}>{bovenkop}</Text>
        <Text style={styles.bannerTitel}>{titel}</Text>
        <Pressable style={styles.bannerKnop} onPress={onPress}>
          <Text style={styles.bannerKnopTekst}>{knop}</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------- scherm ---- */

export default function WinkelStartScherm() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [producten, setProducten] = useState<ProductCardData[]>([]);
  const [blogs, setBlogs] = useState<BlogDetails[]>([]);
  const [laden, setLaden] = useState(true);
  const [fout, setFout] = useState<string | null>(null);

  const [afdeling, setAfdeling] = useState('Alles');
  const [afdelingOpen, setAfdelingOpen] = useState(false);
  const [bekekenIds, setBekekenIds] = useState<string[]>(laatstBekeken());

  useEffect(() => {
    Promise.all([fetchWebflowProducts(), fetchWebflowBlogs()])
      .then(([items, posts]) => {
        setProducten(items.map((i) => i.card));
        setBlogs(posts);
        setLaden(false);
      })
      .catch((err) => {
        setFout(err.message);
        setLaden(false);
      });
  }, []);

  /* Afdelingen uit het geslachtsveld van de producten (Heren, Dames, …). */
  const afdelingen = useMemo(() => {
    const gevonden = producten.map((p) => p.geslacht).filter(Boolean) as string[];
    return ['Alles', ...Array.from(new Set(gevonden))];
  }, [producten]);

  const zichtbaar = useMemo(
    () => (afdeling === 'Alles' ? producten : producten.filter((p) => p.geslacht === afdeling)),
    [producten, afdeling]
  );

  /* Producten met "feature on home" aan in Webflow krijgen voorrang. */
  const uitgelicht = zichtbaar.filter((p) => p.uitgelicht);
  const nieuweCollectie = (uitgelicht.length > 0 ? uitgelicht : zichtbaar).slice(0, 4);
  const inspiratie = blogs.slice(0, 4);

  const bekeken = bekekenIds
    .map((id) => producten.find((p) => p.id === id))
    .filter(Boolean) as ProductCardData[];
  const populair = zichtbaar.slice(4, 12);
  const rijProducten = bekeken.length > 0 ? bekeken : populair;
  const rijTitel = bekeken.length > 0 ? 'Laatst bekeken' : 'Populair nu';

  const naarProduct = (id: string) => router.push(`/product/${id}`);

  return (
    <View style={styles.scherm}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* ---------------------------------------------------------- hero */}
        <Banner
          foto={HERO_FOTO}
          bovenkop="COLLECTIE 2026"
          titel="Klaar voor elke rit"
          knop="Bekijk de selectie"
          hoogte={520}
          onPress={() => router.push('/explore')}
        />

        {/* -------------------------------------------------- categorieën */}
        <View style={styles.sectieLicht}>
          <SectieKop titel="Ontdek de categorieën" onMeer={() => router.push('/explore')} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rij}>
            {HOOFDCATEGORIEEN.map((h) => (
              <Pressable
                key={h.slug}
                style={styles.categorieTegel}
                onPress={() => router.push(`/categorie/${h.slug}`)}>
                <Image source={{ uri: h.foto }} style={styles.categorieFoto} contentFit="cover" />
                <Text style={styles.categorieNaam}>{h.naam}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* ------------------------------------ laatst bekeken / populair */}
        {rijProducten.length > 0 && (
          <View style={styles.sectie}>
            <SectieKop titel={rijTitel} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rij}>
              {rijProducten.map((p) => (
                <CollectieKaart
                  key={p.id}
                  product={p}
                  breedte={190}
                  onPress={() => naarProduct(p.id)}
                  onVerwijder={
                    bekeken.length > 0
                      ? () => {
                          verwijderBekeken(p.id);
                          setBekekenIds(laatstBekeken());
                        }
                      : undefined
                  }
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* --------------------------------------------------- uitgelicht */}
        <Banner
          foto={UITGELICHT_FOTO}
          bovenkop="UITGELICHT"
          titel="Ons huismerk G&F"
          knop="Bekijk de selectie"
          hoogte={340}
          onPress={() => router.push('/explore')}
        />

        {/* ---------------------------------------------- nieuwe collectie */}
        <View style={styles.sectieLicht}>
          <SectieKop titel="Nieuwe collectie" onMeer={() => router.push('/lijst/nieuw')} />

          {laden && <Text style={styles.hulptekst}>Producten laden…</Text>}
          {fout && <Text style={styles.fouttekst}>Fout bij het laden: {fout}</Text>}
          {!laden && !fout && nieuweCollectie.length === 0 && (
            <Text style={styles.hulptekst}>Geen producten in deze afdeling.</Text>
          )}

          <View style={styles.raster}>
            {nieuweCollectie.map((p, i) => (
              <CollectieKaart
                key={p.id}
                product={p}
                breedte={KOLOM}
                label={i === 1 ? 'Nieuwe collectie' : undefined}
                onPress={() => naarProduct(p.id)}
              />
            ))}
          </View>
        </View>

        {/* ---------------------------------------------------- inspiratie */}
        {inspiratie.length > 0 && (
          <View style={styles.sectie}>
            <SectieKop titel="Inspiratie" onMeer={() => router.push('/blog')} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rij}>
              {inspiratie.map((b) => (
                <Pressable
                  key={b.id}
                  style={styles.blogKaart}
                  onPress={() => router.push(`/blog/${b.id}`)}>
                  {b.imageUrl ? (
                    <Image source={{ uri: b.imageUrl }} style={styles.blogFoto} contentFit="cover" />
                  ) : (
                    <View style={[styles.blogFoto, styles.blogFotoLeeg]} />
                  )}
                  {!!b.categoryName && (
                    <Text style={styles.blogCategorie}>{b.categoryName}</Text>
                  )}
                  <Text style={styles.blogTitel} numberOfLines={3}>
                    {b.name}
                  </Text>
                  <Text style={styles.blogDatum}>{datumKort(b.date)}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* --------------------------------------------------- onze merken */}
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

        {/* ---------------------------------------------- merkcampagnes */}
        <View style={styles.sectie}>
          <SectieKop titel="Motorkledij merken" klein />
          <View style={styles.campagneRij}>
            <Pressable style={styles.campagne} onPress={() => router.push('/explore')}>
              <Image source={{ uri: CAMPAGNE_A }} style={StyleSheet.absoluteFill} contentFit="cover" />
              <View style={styles.campagneWaas} pointerEvents="none" />
              <Text style={styles.campagneTekst}>G&F MOTORWEAR</Text>
            </Pressable>
            <Pressable style={styles.campagne} onPress={() => router.push('/explore')}>
              <Image source={{ uri: CAMPAGNE_B }} style={StyleSheet.absoluteFill} contentFit="cover" />
              <View style={styles.campagneWaas} pointerEvents="none" />
              <Text style={styles.campagneTekst}>TOPMERKEN</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* ------------------------------- zwevende afdelingskeuze linksboven */}
      <View style={[styles.afdelingLaag, { top: insets.top + 8 }]} pointerEvents="box-none">
        <Pressable style={styles.afdelingPil} onPress={() => setAfdelingOpen((v) => !v)}>
          <Text style={styles.afdelingTekst}>{afdeling}</Text>
          <Ionicons
            name={afdelingOpen ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={EkoColors.primaryDark}
          />
        </Pressable>

        {afdelingOpen && (
          <View style={styles.afdelingLijst}>
            {afdelingen.map((a) => (
              <Pressable
                key={a}
                style={styles.afdelingOptie}
                onPress={() => {
                  setAfdeling(a);
                  setAfdelingOpen(false);
                }}>
                <Text style={[styles.afdelingOptieTekst, a === afdeling && styles.afdelingOptieAan]}>
                  {a}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

/* -------------------------------------------------------------- styles ---- */

const styles = StyleSheet.create({
  scherm: {
    flex: 1,
    backgroundColor: EkoColors.white,
  },

  /* BANNERS */
  banner: {
    justifyContent: 'flex-end',
    backgroundColor: EkoColors.primaryDark,
    overflow: 'hidden',
  },
  bannerWaas: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(22,35,46,0.32)',
  },
  bannerInhoud: {
    padding: 24,
  },
  bannerBovenkop: {
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 6,
  },
  bannerTitel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: 0.5,
    color: EkoColors.white,
    marginBottom: 18,
  },
  bannerKnop: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: EkoColors.white,
    paddingVertical: 13,
    paddingHorizontal: 22,
  },
  bannerKnopTekst: {
    fontFamily: EkoFonts.headingMedium,
    fontSize: 13,
    letterSpacing: 1,
    color: EkoColors.white,
  },

  /* SECTIES */
  sectie: {
    paddingVertical: 36,
    backgroundColor: EkoColors.white,
  },
  sectieLicht: {
    paddingVertical: 36,
    backgroundColor: EkoColors.lightGray,
  },
  rij: {
    paddingHorizontal: RAND,
    gap: 12,
  },
  raster: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: RAND,
    gap: 12,
  },
  hulptekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.paragraphGray,
    paddingHorizontal: RAND,
    marginBottom: 12,
  },
  fouttekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.primary,
    paddingHorizontal: RAND,
    marginBottom: 12,
  },

  /* CATEGORIEËN */
  categorieTegel: {
    width: 165,
  },
  categorieFoto: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: EkoColors.white,
  },
  categorieNaam: {
    marginTop: 12,
    fontFamily: EkoFonts.bodyBold,
    fontSize: 15,
    color: EkoColors.primaryDark,
  },

  /* INSPIRATIE */
  blogKaart: {
    width: 260,
  },
  blogFoto: {
    width: '100%',
    height: 220,
    backgroundColor: EkoColors.lightGray,
    marginBottom: 14,
  },
  blogFotoLeeg: {
    backgroundColor: EkoColors.lightSteelBlue,
  },
  blogCategorie: {
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: EkoColors.paragraphGray,
    marginBottom: 6,
  },
  blogTitel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 20,
    lineHeight: 26,
    color: EkoColors.primaryDark,
    marginBottom: 6,
  },
  blogDatum: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 13,
    color: EkoColors.paragraphGray,
  },

  /* MERKEN */
  merkTegel: {
    width: 108,
  },
  merkLogoVlak: {
    height: 72,
    backgroundColor: EkoColors.white,
    borderWidth: 1,
    borderColor: 'rgba(22,35,46,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  merkLogo: {
    width: '100%',
    height: '100%',
  },
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
  meerNaam: {
    fontFamily: EkoFonts.bodyBold,
  },
  chipsRij: {
    paddingHorizontal: RAND,
    gap: 10,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: EkoColors.lightSteelBlue,
    backgroundColor: EkoColors.white,
  },
  chipAan: {
    backgroundColor: EkoColors.primaryDark,
    borderColor: EkoColors.primaryDark,
  },
  chipTekst: {
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 15,
    color: EkoColors.primaryDark,
  },
  chipTekstAan: {
    color: EkoColors.white,
  },

  /* CAMPAGNETEGELS */
  campagneRij: {
    flexDirection: 'row',
  },
  campagne: {
    flex: 1,
    height: 230,
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: EkoColors.primaryDark,
    overflow: 'hidden',
  },
  campagneWaas: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(22,35,46,0.28)',
  },
  campagneTekst: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 18,
    letterSpacing: 1.2,
    color: EkoColors.white,
  },

  /* AFDELINGSKEUZE */
  afdelingLaag: {
    position: 'absolute',
    left: RAND,
  },
  afdelingPil: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 24,
    paddingVertical: 11,
    paddingHorizontal: 18,
    shadowColor: EkoColors.primaryDark,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  afdelingTekst: {
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 16,
    color: EkoColors.primaryDark,
  },
  afdelingLijst: {
    marginTop: 8,
    minWidth: 170,
    backgroundColor: EkoColors.white,
    borderRadius: 16,
    paddingVertical: 6,
    shadowColor: EkoColors.primaryDark,
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  afdelingOptie: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  afdelingOptieTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 16,
    color: EkoColors.primaryDark,
  },
  afdelingOptieAan: {
    fontFamily: EkoFonts.bodyBold,
    color: EkoColors.primary,
  },
});
