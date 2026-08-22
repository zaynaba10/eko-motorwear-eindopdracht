import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SectieKop } from '@/components/winkel/sectie-kop';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { MERKEN_MET_LOGO } from '@/lib/merken';
import {
  CITAAT,
  CITAAT_BRON,
  MISSIE,
  OVER_ONS_BLOKKEN,
  OVER_ONS_CIJFERS,
  OVER_ONS_INTRO,
} from '@/lib/paginas';

/**
 * Over ons — het verhaal van de winkel, opgebouwd als een artikel: hero,
 * titelblok, kerncijfers, de hoofdstukken in wit/sectiegrijs, onze missie,
 * het citaat van de zaakvoerders, de merken en tot slot "Kom langs".
 */

const RAND = 16;

const HERO =
  'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def/6a7260ea77f40c20eaaa7fba_harley-davidson-QD6GvrDFPAA-unsplash.webp';

/** Eén sfeerfoto per hoofdstuk, in dezelfde volgorde als OVER_ONS_BLOKKEN. */
const BLOK_FOTOS = [
  'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def/6a7260ea77f40c20eaaa7fb7_zac-wolff-Ptx8G07I6xI-unsplash.webp',
  'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def/6a7a58089e5940ddd2a1ffe5_hero-motocross-actie.jpg',
  'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def/6a7260ea77f40c20eaaa7fb5_roberto-nickson-D1F7OtbbvKc-unsplash.webp',
];

export function OverOnsPagina() {
  const router = useRouter();

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* --------------------------------------------------------- hero */}
      <View style={styles.heroVlak}>
        <Image source={{ uri: HERO }} style={styles.hero} contentFit="cover" />
      </View>

      {/* ---------------------------------------------------- titelblok */}
      <View style={styles.titelVlak}>
        <View style={styles.metaRij}>
          <Text style={styles.meta}>Over ons</Text>
          <Text style={styles.metaLicht}>Kontich · sinds 1995</Text>
        </View>
        <Text style={styles.titel}>Al meer dan 30 jaar onderweg met jou</Text>
        <Text style={styles.intro}>{OVER_ONS_INTRO}</Text>
      </View>

      {/* ------------------------------------------------- kerncijfers */}
      <View style={styles.cijferBalk}>
        {OVER_ONS_CIJFERS.map((c, i) => (
          <View key={c.label} style={[styles.cijfer, i < OVER_ONS_CIJFERS.length - 1 && styles.cijferRand]}>
            <Text style={styles.cijferWaarde}>{c.waarde}</Text>
            <Text style={styles.cijferLabel}>{c.label}</Text>
          </View>
        ))}
      </View>

      {/* ------------------------------------------------- hoofdstukken */}
      {OVER_ONS_BLOKKEN.map((blok, i) => (
        <View key={blok.titel} style={i % 2 === 0 ? styles.sectie : styles.sectieLicht}>
          {!!BLOK_FOTOS[i] && (
            <Image source={{ uri: BLOK_FOTOS[i] }} style={styles.blokFoto} contentFit="cover" />
          )}
          <View style={styles.blokTekst}>
            <Text style={styles.nummer}>{String(i + 1).padStart(2, '0')}</Text>
            <Text style={styles.blokTitel}>{blok.titel}</Text>
            {blok.alineas.map((a, j) => (
              <Text key={j} style={styles.alinea}>
                {a}
              </Text>
            ))}
          </View>
        </View>
      ))}

      {/* -------------------------------------------------- onze missie */}
      <View style={styles.sectie}>
        <SectieKop titel="Onze missie" klein />
        <View style={styles.missieRaster}>
          {MISSIE.map((m) => (
            <View key={m.titel} style={styles.missieKaart}>
              <View style={styles.missieIcoon}>
                <Ionicons name="checkmark" size={15} color={EkoColors.white} />
              </View>
              <Text style={styles.missieTitel}>{m.titel}</Text>
              <Text style={styles.missieTekst}>{m.alineas[0]}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ------------------------------------------------------- citaat */}
      <View style={styles.citaatVlak}>
        <Ionicons name="chatbox-ellipses-outline" size={22} color={EkoColors.primary} />
        <Text style={styles.citaat}>{CITAAT}</Text>
        <Text style={styles.citaatBron}>{CITAAT_BRON}</Text>
      </View>

      {/* ------------------------------------------------- onze merken */}
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

      {/* ----------------------------------------------------- kom langs */}
      <View style={styles.bezoekVlak}>
        <Text style={styles.bezoekTitel}>Kom langs</Text>
        <View style={styles.bezoekRij}>
          <Ionicons name="location-outline" size={18} color={EkoColors.primary} />
          <Text style={styles.bezoekTekst}>Singel 4C, B-2550 Kontich</Text>
        </View>
        <View style={styles.bezoekRij}>
          <Ionicons name="call-outline" size={18} color={EkoColors.primary} />
          <Text style={styles.bezoekTekst}>(0032) 03/457 11 28</Text>
        </View>
        <View style={styles.bezoekRij}>
          <Ionicons name="mail-outline" size={18} color={EkoColors.primary} />
          <Text style={styles.bezoekTekst}>vraag@eko-motorwear.be</Text>
        </View>

        <Pressable style={styles.knop} onPress={() => router.push('/explore')}>
          <Text style={styles.knopTekst}>Bekijk het assortiment</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heroVlak: { backgroundColor: EkoColors.primaryDark },
  hero: { width: '100%', aspectRatio: 4 / 3, backgroundColor: EkoColors.primaryDark },

  titelVlak: {
    paddingHorizontal: RAND,
    paddingTop: 18,
    paddingBottom: 22,
    backgroundColor: EkoColors.white,
  },
  metaRij: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  meta: {
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: EkoColors.primary,
  },
  metaLicht: { fontFamily: EkoFonts.bodyRegular, fontSize: 12, color: EkoColors.paragraphGray },
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

  cijferBalk: {
    flexDirection: 'row',
    backgroundColor: EkoColors.primaryDark,
    paddingVertical: 20,
  },
  cijfer: { flex: 1, alignItems: 'center' },
  cijferRand: { borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.15)' },
  cijferWaarde: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 24,
    lineHeight: 30,
    color: EkoColors.primary,
  },
  cijferLabel: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },

  sectie: { paddingBottom: 28, paddingTop: 26, backgroundColor: EkoColors.white },
  sectieLicht: { paddingBottom: 28, paddingTop: 26, backgroundColor: EkoColors.lightGray },
  blokFoto: { width: '100%', aspectRatio: 16 / 9, backgroundColor: EkoColors.lightSteelBlue },
  blokTekst: { paddingHorizontal: RAND, paddingTop: 16 },
  nummer: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 13,
    letterSpacing: 1.5,
    color: EkoColors.primary,
    marginBottom: 4,
  },
  blokTitel: {
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

  missieRaster: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: RAND,
    gap: 12,
  },
  missieKaart: {
    flexGrow: 1,
    flexBasis: '46%',
    borderWidth: 1,
    borderColor: EkoColors.lightSteelBlue,
    padding: 14,
  },
  missieIcoon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: EkoColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  missieTitel: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 14,
    color: EkoColors.primaryDark,
    marginBottom: 6,
  },
  missieTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 13,
    lineHeight: 19,
    color: EkoColors.paragraphGray,
  },

  citaatVlak: {
    backgroundColor: EkoColors.primaryDark,
    paddingHorizontal: 24,
    paddingVertical: 30,
    alignItems: 'center',
  },
  citaat: {
    marginTop: 12,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    lineHeight: 25,
    color: EkoColors.white,
    textAlign: 'center',
  },
  citaatBron: {
    marginTop: 14,
    fontFamily: EkoFonts.headingMedium,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: EkoColors.primary,
    textAlign: 'center',
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

  bezoekVlak: { paddingHorizontal: RAND, paddingTop: 28, backgroundColor: EkoColors.white },
  bezoekTitel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 20,
    color: EkoColors.primaryDark,
    marginBottom: 14,
  },
  bezoekRij: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  bezoekTekst: {
    flex: 1,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    color: EkoColors.paragraphGray,
  },
  knop: {
    marginTop: 14,
    backgroundColor: EkoColors.primaryDark,
    paddingVertical: 15,
    alignItems: 'center',
  },
  knopTekst: { fontFamily: EkoFonts.bodyBold, fontSize: 15, color: EkoColors.white },
});
