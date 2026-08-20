import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { vindBestelling } from '@/lib/bestellingen';
import { prijsKort } from '@/lib/format';

/**
 * Bevestigingsscherm na het bestellen: de stappenbalk, het bestelnummer,
 * wat er nu gebeurt, de bestelde producten en de betaaldetails.
 */
export default function BestellingScherm() {
  const { nummer } = useLocalSearchParams<{ nummer: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const bestelling = vindBestelling(String(nummer));

  if (!bestelling) {
    return (
      <View style={styles.scherm}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.midden, { paddingTop: insets.top + 60 }]}>
          <Text style={styles.leegTekst}>Deze bestelling konden we niet terugvinden.</Text>
          <Pressable style={styles.omlijndeKnop} onPress={() => router.replace('/account/bestellingen')}>
            <Text style={styles.omlijndeKnopTekst}>Naar Mijn bestellingen</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const aantalArtikelen = bestelling.regels.reduce((som, r) => som + r.aantal, 0);

  return (
    <View style={styles.scherm}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Stappenbalk */}
      <View style={[styles.stappen, { paddingTop: insets.top + 12 }]}>
        <Stap label="Bezorging" af />
        <View style={styles.lijn} />
        <Stap label="Betaling" af />
        <View style={styles.lijn} />
        <Stap label="Bevestiging" nu />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Bevestiging */}
        <View style={styles.bevestiging}>
          <Text style={styles.bevestigingTitel}>We hebben je bestelling ontvangen</Text>
          <Text style={styles.bevestigingTekst}>
            Bedankt voor het winkelen bij EKO Motorwear. We gaan aan de slag met je bestelling
          </Text>
          <Text style={styles.bestelNummer}>#{bestelling.nummer}</Text>
        </View>

        {/* Wat gebeurt er nu */}
        <View style={styles.blok}>
          <Text style={styles.blokTitel}>Wat gebeurt er nu?</Text>
          <Ionicons
            name="mail-outline"
            size={30}
            color={EkoColors.primaryDark}
            style={styles.blokIcoon}
          />
          <Text style={styles.blokTekst}>
            Binnen enkele minuten ontvang je een bevestigingsmail op
          </Text>
          <Text style={styles.blokNadruk}>{bestelling.email}</Text>

          <Ionicons
            name="cube-outline"
            size={30}
            color={EkoColors.primaryDark}
            style={styles.blokIcoon}
          />
          <Text style={styles.blokTekst}>
            We maken je pakket klaar in onze winkel in Kontich. Zodra het vertrekt, krijg je een
            volgnummer per mail.
          </Text>
        </View>

        {/* Producten */}
        <View style={styles.blok}>
          <Text style={styles.blokTitel}>Producten</Text>
        </View>

        <View style={styles.regels}>
          {bestelling.regels.map((r, i) => (
            <View key={`${r.productId}-${r.maat ?? ''}-${i}`} style={styles.regel}>
              <View style={styles.fotoVlak}>
                {r.imageUrl ? (
                  <Image source={{ uri: r.imageUrl }} style={styles.foto} contentFit="cover" />
                ) : (
                  <View style={[styles.foto, styles.fotoLeeg]}>
                    <Ionicons name="image-outline" size={22} color={EkoColors.darkGray} />
                  </View>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.regelNaam} numberOfLines={2}>
                  {[r.merk, r.naam].filter(Boolean).join(' ')}
                </Text>
                {!!r.maat && <Text style={styles.regelDetail}>Maat {r.maat}</Text>}
                <Text style={styles.regelDetail}>Aantal {r.aantal}</Text>
                <Text style={styles.regelPrijs}>{prijsKort(r.stukPrijs * r.aantal)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Betaaldetails */}
        <View style={styles.blok}>
          <Text style={styles.blokTitel}>Betaaldetails</Text>
        </View>

        <View style={styles.details}>
          <Detail
            label={`Totaal artikelen (${aantalArtikelen})`}
            waarde={prijsKort(bestelling.subtotaal)}
          />
          {bestelling.korting > 0 && (
            <Detail label="Korting" waarde={`− ${prijsKort(bestelling.korting)}`} />
          )}
          <Detail
            label="Verzendkosten"
            waarde={bestelling.verzending === 0 ? 'GRATIS' : prijsKort(bestelling.verzending)}
          />
          <View style={styles.detailRij}>
            <Text style={styles.totaalLabel}>Totaal</Text>
            <Text style={styles.totaalWaarde}>{prijsKort(bestelling.totaal)}</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 24, gap: 12 }}>
          <Pressable
            style={styles.omlijndeKnop}
            onPress={() => router.replace('/account/bestellingen')}>
            <Text style={styles.omlijndeKnopTekst}>Bekijk in Mijn account</Text>
          </Pressable>
          <Pressable style={styles.tekstKnop} onPress={() => router.replace('/')}>
            <Text style={styles.tekstKnopTekst}>Verder winkelen</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function Stap({ label, af, nu }: { label: string; af?: boolean; nu?: boolean }) {
  return (
    <View style={styles.stap}>
      <View style={[styles.bol, af && styles.bolAf, nu && styles.bolNu]}>
        {af && <Ionicons name="checkmark" size={14} color={EkoColors.primary} />}
      </View>
      <Text style={[styles.stapLabel, nu && styles.stapLabelNu]}>{label}</Text>
    </View>
  );
}

function Detail({ label, waarde }: { label: string; waarde: string }) {
  return (
    <View style={styles.detailRij}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailWaarde}>{waarde}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scherm: { flex: 1, backgroundColor: EkoColors.white },
  midden: { flex: 1, alignItems: 'center', paddingHorizontal: 30, gap: 18 },
  leegTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 16,
    color: EkoColors.paragraphGray,
    textAlign: 'center',
  },

  /* STAPPENBALK */
  stappen: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: EkoColors.lightSteelBlue,
  },
  stap: { alignItems: 'center', width: 96 },
  lijn: {
    flex: 1,
    height: 1,
    backgroundColor: EkoColors.primary,
    marginTop: 11,
  },
  bol: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: EkoColors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bolAf: { borderColor: EkoColors.primary },
  bolNu: { backgroundColor: EkoColors.primary, borderColor: EkoColors.primary },
  stapLabel: {
    marginTop: 8,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 13,
    color: EkoColors.paragraphGray,
  },
  stapLabelNu: { fontFamily: EkoFonts.bodyBold, color: EkoColors.primaryDark },

  /* BEVESTIGING */
  bevestiging: {
    backgroundColor: '#F7F3ED',
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
  },
  bevestigingTitel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 30,
    lineHeight: 38,
    color: EkoColors.primaryDark,
    textAlign: 'center',
    marginBottom: 14,
  },
  bevestigingTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    lineHeight: 22,
    color: EkoColors.paragraphGray,
    textAlign: 'center',
  },
  bestelNummer: {
    marginTop: 12,
    fontFamily: EkoFonts.bodyBold,
    fontSize: 20,
    color: EkoColors.primaryDark,
  },

  /* BLOKKEN */
  blok: { paddingHorizontal: 24, paddingTop: 34, alignItems: 'center' },
  blokTitel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 26,
    color: EkoColors.primaryDark,
    marginBottom: 6,
  },
  blokIcoon: { marginTop: 22, marginBottom: 12 },
  blokTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    lineHeight: 22,
    color: EkoColors.paragraphGray,
    textAlign: 'center',
  },
  blokNadruk: {
    marginTop: 4,
    fontFamily: EkoFonts.bodyBold,
    fontSize: 15,
    color: EkoColors.primaryDark,
  },

  /* PRODUCTEN */
  regels: { paddingHorizontal: 16, paddingTop: 18, gap: 14 },
  regel: {
    flexDirection: 'row',
    gap: 14,
    borderWidth: 1,
    borderColor: EkoColors.lightSteelBlue,
    padding: 12,
  },
  fotoVlak: { width: 90, backgroundColor: '#F4F4F2' },
  foto: { width: '100%', aspectRatio: 3 / 4 },
  fotoLeeg: { alignItems: 'center', justifyContent: 'center' },
  regelNaam: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 15,
    lineHeight: 21,
    color: EkoColors.primaryDark,
    marginBottom: 6,
  },
  regelDetail: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    color: EkoColors.paragraphGray,
  },
  regelPrijs: {
    marginTop: 6,
    fontFamily: EkoFonts.bodyBold,
    fontSize: 16,
    color: EkoColors.primaryDark,
  },

  /* BETAALDETAILS */
  details: {
    marginTop: 18,
    marginHorizontal: 16,
    backgroundColor: EkoColors.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  detailRij: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.primaryDark,
  },
  detailWaarde: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.primaryDark,
  },
  totaalLabel: { fontFamily: EkoFonts.bodyBold, fontSize: 17, color: EkoColors.primaryDark },
  totaalWaarde: { fontFamily: EkoFonts.bodyBold, fontSize: 17, color: EkoColors.primaryDark },

  /* KNOPPEN */
  omlijndeKnop: {
    borderWidth: 1,
    borderColor: EkoColors.primaryDark,
    paddingVertical: 18,
    alignItems: 'center',
  },
  omlijndeKnopTekst: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 16,
    color: EkoColors.primaryDark,
  },
  tekstKnop: { paddingVertical: 8, alignItems: 'center' },
  tekstKnopTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    textDecorationLine: 'underline',
    color: EkoColors.paragraphGray,
  },
});
