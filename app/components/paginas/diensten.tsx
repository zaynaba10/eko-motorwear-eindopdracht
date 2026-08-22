import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SectieKop } from '@/components/winkel/sectie-kop';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { DIENSTEN, DIENSTEN_INTRO, DIENSTEN_NOOT, DIENSTEN_STAPPEN } from '@/lib/paginas';

/**
 * Onze diensten — opgebouwd als een servicegids: hero, titelblok, daarna elke
 * dienst als een genummerd hoofdstuk met eigen foto en checklist, gevolgd door
 * "Zo werkt het" en een blok om je vraag te stellen.
 */

const RAND = 16;

const HERO =
  'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def/6a821ab5379aff3b208b176c_herstellingen-diensten-klein.jpg';

/** Foto per dienst, in dezelfde volgorde als DIENSTEN. */
const DIENST_FOTOS: Record<string, string> = {
  'Herstellingen & aanpassingen':
    'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def/6a821ab5379aff3b208b176c_herstellingen-diensten-klein.jpg',
  'Reinigen met Ozon':
    'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def/6a821ab5e11f15ec4eeddb96_reinigen-met-ozon-diensten-klein.jpg',
  Cadeaubon:
    'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def/6a821ab5cb51c23e7eda935d_cadeaubon-diensten-klein.jpg',
};

const ICONEN: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Herstellingen & aanpassingen': 'construct-outline',
  'Reinigen met Ozon': 'sparkles-outline',
  Cadeaubon: 'gift-outline',
};

export function DienstenPagina() {
  const router = useRouter();

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* --------------------------------------------------------- hero */}
      <Image source={{ uri: HERO }} style={styles.hero} contentFit="cover" />

      {/* ---------------------------------------------------- titelblok */}
      <View style={styles.titelVlak}>
        <View style={styles.metaRij}>
          <Text style={styles.meta}>Diensten</Text>
          <Text style={styles.metaLicht}>{DIENSTEN.length} diensten</Text>
        </View>
        <Text style={styles.titel}>Meer dan enkel motorkledij</Text>
        <Text style={styles.intro}>{DIENSTEN_INTRO}</Text>
      </View>

      {/* ------------------------------------------------------ diensten */}
      {DIENSTEN.map((d, i) => (
        <View key={d.titel} style={i % 2 === 0 ? styles.sectieLicht : styles.sectie}>
          {!!DIENST_FOTOS[d.titel] && (
            <Image
              source={{ uri: DIENST_FOTOS[d.titel] }}
              style={styles.dienstFoto}
              contentFit="cover"
            />
          )}

          <View style={styles.dienstTekst}>
            <View style={styles.dienstKopRij}>
              <View style={styles.icoonVlak}>
                <Ionicons
                  name={ICONEN[d.titel] ?? 'ellipse-outline'}
                  size={20}
                  color={EkoColors.white}
                />
              </View>
              <Text style={styles.nummer}>{String(i + 1).padStart(2, '0')}</Text>
            </View>

            <Text style={styles.dienstTitel}>{d.titel}</Text>
            <Text style={styles.alinea}>{d.tekst}</Text>

            <View style={styles.puntenVlak}>
              {d.punten.map((punt) => (
                <View key={punt} style={styles.puntRij}>
                  <Ionicons name="checkmark" size={16} color={EkoColors.primary} />
                  <Text style={styles.puntTekst}>{punt}</Text>
                </View>
              ))}
            </View>

            {d.titel === 'Cadeaubon' && (
              <Pressable style={styles.knop} onPress={() => router.push('/cadeaukaart')}>
                <Text style={styles.knopTekst}>Bekijk de cadeaubon</Text>
              </Pressable>
            )}
          </View>
        </View>
      ))}

      {/* ----------------------------------------------------- zo werkt */}
      <View style={styles.sectie}>
        <SectieKop titel="Zo werkt het" klein />
        <View style={styles.stappen}>
          {DIENSTEN_STAPPEN.map((s, i) => (
            <View key={s.titel} style={styles.stapRij}>
              <View style={styles.stapBol}>
                <Text style={styles.stapNummer}>{i + 1}</Text>
              </View>
              <View style={styles.stapTekst}>
                <Text style={styles.stapTitel}>{s.titel}</Text>
                <Text style={styles.stapUitleg}>{s.tekst}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* -------------------------------------------------------- noot */}
      <View style={styles.noot}>
        <Ionicons name="information-circle-outline" size={20} color={EkoColors.primary} />
        <Text style={styles.nootTekst}>{DIENSTEN_NOOT}</Text>
      </View>

      {/* ------------------------------------------------------- vraag */}
      <View style={styles.vraagVlak}>
        <Text style={styles.vraagTitel}>Een vraag over een dienst?</Text>
        <Text style={styles.vraagTekst}>
          Stuur ons gerust een bericht met een foto van je stuk, of kom langs in de showroom in
          Kontich. We helpen je graag verder.
        </Text>
        <Pressable
          style={styles.knop}
          onPress={() => router.push('/account/klantenservice-bericht')}>
          <Text style={styles.knopTekst}>Stel je vraag</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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

  sectie: { paddingTop: 26, paddingBottom: 28, backgroundColor: EkoColors.white },
  sectieLicht: { paddingTop: 26, paddingBottom: 28, backgroundColor: EkoColors.lightGray },
  dienstFoto: { width: '100%', aspectRatio: 16 / 9, backgroundColor: EkoColors.lightSteelBlue },
  dienstTekst: { paddingHorizontal: RAND, paddingTop: 16 },
  dienstKopRij: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  icoonVlak: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: EkoColors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nummer: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 22,
    letterSpacing: 1.5,
    color: EkoColors.primary,
  },
  dienstTitel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 20,
    lineHeight: 26,
    color: EkoColors.primaryDark,
    marginBottom: 8,
  },
  alinea: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    lineHeight: 22,
    color: EkoColors.paragraphGray,
    marginBottom: 14,
  },

  puntenVlak: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(22,35,46,0.10)',
    paddingTop: 14,
    gap: 8,
  },
  puntRij: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  puntTekst: {
    flex: 1,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    color: EkoColors.primaryDark,
  },

  stappen: { paddingHorizontal: RAND, gap: 16 },
  stapRij: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  stapBol: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: EkoColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stapNummer: { fontFamily: EkoFonts.bodyBold, fontSize: 14, color: EkoColors.white },
  stapTekst: { flex: 1 },
  stapTitel: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 15,
    color: EkoColors.primaryDark,
    marginBottom: 3,
  },
  stapUitleg: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 13,
    lineHeight: 20,
    color: EkoColors.paragraphGray,
  },

  noot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F7EFE6',
    marginHorizontal: RAND,
    padding: 14,
  },
  nootTekst: {
    flex: 1,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 13,
    lineHeight: 19,
    color: EkoColors.primaryDark,
  },

  vraagVlak: { paddingHorizontal: RAND, paddingTop: 30 },
  vraagTitel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 20,
    color: EkoColors.primaryDark,
    marginBottom: 8,
  },
  vraagTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    lineHeight: 22,
    color: EkoColors.paragraphGray,
    marginBottom: 16,
  },
  knop: {
    marginTop: 16,
    backgroundColor: EkoColors.primaryDark,
    paddingVertical: 15,
    alignItems: 'center',
  },
  knopTekst: { fontFamily: EkoFonts.bodyBold, fontSize: 15, color: EkoColors.white },
});
