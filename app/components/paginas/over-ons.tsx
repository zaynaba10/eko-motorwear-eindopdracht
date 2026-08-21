import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { CITAAT, CITAAT_BRON, MISSIE, OVER_ONS_BLOKKEN, OVER_ONS_INTRO } from '@/lib/paginas';

const BANNER =
  'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def/6a7260ea77f40c20eaaa7fba_harley-davidson-QD6GvrDFPAA-unsplash.webp';

/** Over ons — dezelfde opbouw als de pagina Over Ons op de website. */
export function OverOnsPagina({ bovenRuimte }: { bovenRuimte: number }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.banner}>
        <Image source={{ uri: BANNER }} style={StyleSheet.absoluteFill} contentFit="cover" />
        <View style={styles.waas} pointerEvents="none" />
        <View style={[styles.bannerInhoud, { paddingTop: bovenRuimte }]}>
          <View style={styles.accent} />
          <Text style={styles.bannerTitel}>Over EKO Motorwear</Text>
          <Text style={styles.bannerTekst}>{OVER_ONS_INTRO}</Text>
        </View>
      </View>

      {OVER_ONS_BLOKKEN.map((blok, i) => (
        <View key={blok.titel} style={i % 2 === 0 ? styles.sectie : styles.sectieLicht}>
          <View style={styles.accent} />
          <Text style={styles.titel}>{blok.titel}</Text>
          {blok.alineas.map((a, j) => (
            <Text key={j} style={styles.tekst}>
              {a}
            </Text>
          ))}
        </View>
      ))}

      {/* Onze missie */}
      <View style={styles.sectie}>
        <View style={styles.accent} />
        <Text style={styles.titel}>Onze missie</Text>
        <View style={styles.missieRaster}>
          {MISSIE.map((m) => (
            <View key={m.titel} style={styles.missieKaart}>
              <Text style={styles.missieTitel}>{m.titel}</Text>
              <Text style={styles.missieTekst}>{m.alineas[0]}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Citaat van de zaakvoerders */}
      <View style={styles.citaatVlak}>
        <Text style={styles.citaat}>{CITAAT}</Text>
        <Text style={styles.citaatBron}>{CITAAT_BRON}</Text>
      </View>

      {/* Kom langs */}
      <View style={styles.sectie}>
        <View style={styles.accent} />
        <Text style={styles.titel}>Kom langs</Text>
        <Text style={styles.tekst}>Singel 4C, B-2550 Kontich</Text>
        <Text style={styles.tekst}>vraag@eko-motorwear.be · (0032) 03/457 11 28</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  banner: {
    minHeight: 380,
    justifyContent: 'flex-end',
    backgroundColor: EkoColors.primaryDark,
    overflow: 'hidden',
  },
  waas: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(22,35,46,0.45)',
  },
  bannerInhoud: { paddingHorizontal: 16, paddingBottom: 30 },
  bannerTitel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 32,
    lineHeight: 38,
    color: EkoColors.white,
    marginBottom: 10,
  },
  bannerTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.88)',
  },

  accent: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: EkoColors.primary,
    marginBottom: 14,
  },
  sectie: { paddingHorizontal: 16, paddingVertical: 30, backgroundColor: EkoColors.white },
  sectieLicht: { paddingHorizontal: 16, paddingVertical: 30, backgroundColor: EkoColors.lightGray },
  titel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 22,
    lineHeight: 28,
    color: EkoColors.primaryDark,
    marginBottom: 12,
  },
  tekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    lineHeight: 22,
    color: EkoColors.paragraphGray,
    marginBottom: 10,
  },

  missieRaster: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 4 },
  missieKaart: {
    flexGrow: 1,
    flexBasis: '46%',
    borderWidth: 1,
    borderColor: EkoColors.lightSteelBlue,
    padding: 14,
  },
  missieTitel: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 15,
    color: EkoColors.primaryDark,
    marginBottom: 6,
  },
  missieTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 13,
    lineHeight: 19,
    color: EkoColors.paragraphGray,
  },

  citaatVlak: { backgroundColor: EkoColors.primaryDark, paddingHorizontal: 24, paddingVertical: 34 },
  citaat: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 16,
    lineHeight: 26,
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
});
