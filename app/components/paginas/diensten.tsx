import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { DIENSTEN, DIENSTEN_INTRO, DIENSTEN_NOOT } from '@/lib/paginas';

const ICONEN: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Herstellingen & aanpassingen': 'construct-outline',
  'Reinigen met Ozon': 'sparkles-outline',
  Cadeaubon: 'gift-outline',
};

/** Onze diensten — dezelfde inhoud als de dienstenpagina op de website. */
export function DienstenPagina({ bovenRuimte }: { bovenRuimte: number }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={[styles.kopVlak, { paddingTop: bovenRuimte }]}>
        <View style={styles.accent} />
        <Text style={styles.paginaTitel}>Onze diensten</Text>
        <Text style={styles.intro}>{DIENSTEN_INTRO}</Text>
      </View>

      {DIENSTEN.map((d, i) => (
        <View key={d.titel} style={i % 2 === 0 ? styles.sectie : styles.sectieLicht}>
          <View style={styles.icoonVlak}>
            <Ionicons
              name={ICONEN[d.titel] ?? 'ellipse-outline'}
              size={24}
              color={EkoColors.white}
            />
          </View>
          <Text style={styles.titel}>{d.titel}</Text>
          <Text style={styles.tekst}>{d.tekst}</Text>

          {d.punten.map((punt) => (
            <View key={punt} style={styles.puntRij}>
              <Ionicons name="checkmark" size={16} color={EkoColors.primary} />
              <Text style={styles.puntTekst}>{punt}</Text>
            </View>
          ))}
        </View>
      ))}

      <View style={styles.noot}>
        <Ionicons name="information-circle-outline" size={20} color={EkoColors.primary} />
        <Text style={styles.nootTekst}>{DIENSTEN_NOOT}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  kopVlak: {
    backgroundColor: EkoColors.primaryDark,
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  accent: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: EkoColors.primary,
    marginBottom: 14,
  },
  paginaTitel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 30,
    lineHeight: 36,
    color: EkoColors.white,
    marginBottom: 10,
  },
  intro: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.85)',
  },

  sectie: { paddingHorizontal: 16, paddingVertical: 28, backgroundColor: EkoColors.white },
  sectieLicht: { paddingHorizontal: 16, paddingVertical: 28, backgroundColor: EkoColors.lightGray },
  icoonVlak: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: EkoColors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  titel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 20,
    lineHeight: 26,
    color: EkoColors.primaryDark,
    marginBottom: 8,
  },
  tekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    lineHeight: 22,
    color: EkoColors.paragraphGray,
    marginBottom: 12,
  },
  puntRij: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  puntTekst: {
    flex: 1,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    color: EkoColors.primaryDark,
  },

  noot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F7EFE6',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 14,
  },
  nootTekst: {
    flex: 1,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 13,
    lineHeight: 19,
    color: EkoColors.primaryDark,
  },
});
