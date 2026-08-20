import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LegeStaat, Scherm, Schakelaar } from '@/components/account-ui';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { useBestellingen } from '@/lib/bestellingen';
import { prijsKort } from '@/lib/format';

const MAANDEN = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december',
];

function langeDatum(ms: number) {
  const d = new Date(ms);
  return `${d.getDate()} ${MAANDEN[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Mijn bestellingen: de bestellingen die je in de app plaatste, nieuwste
 * eerst. Tik op een bestelling om de bevestiging opnieuw te bekijken.
 */
export default function Bestellingen() {
  const router = useRouter();
  const [waar, setWaar] = useState('Online');
  const bestellingen = useBestellingen();

  return (
    <Scherm titel="Mijn bestellingen">
      <Schakelaar opties={['Online', 'Winkel']} gekozen={waar} onKies={setWaar} />

      {waar === 'Winkel' ? (
        <LegeStaat
          icoon="storefront-outline"
          titel="Geen aankopen gevonden"
          tekst="Je aankopen in de winkel in Kontich worden hier weergegeven."
        />
      ) : bestellingen.length === 0 ? (
        <LegeStaat
          icoon="cube-outline"
          titel="Geen bestellingen gevonden"
          tekst="Je hebt nog niets online besteld. Zodra je iets bestelt, vind je hier je pakbon en je volgnummer."
        />
      ) : (
        <View style={styles.lijst}>
          {bestellingen.map((b) => (
            <Pressable
              key={b.nummer}
              style={styles.bestelling}
              onPress={() => router.push(`/bestelling/${b.nummer}`)}>
              <View style={styles.kopRij}>
                <Text style={styles.datum}>{langeDatum(b.datum)}</Text>
                <Text style={styles.totaal}>{prijsKort(b.totaal)}</Text>
              </View>

              <Text style={styles.nummer}>#{b.nummer}</Text>

              <View style={styles.fotoRij}>
                {b.regels.map((r, i) =>
                  r.imageUrl ? (
                    <Image
                      key={`${r.productId}-${i}`}
                      source={{ uri: r.imageUrl }}
                      style={styles.foto}
                      contentFit="contain"
                    />
                  ) : null
                )}
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </Scherm>
  );
}

const styles = StyleSheet.create({
  lijst: { paddingHorizontal: 16, paddingTop: 8 },
  bestelling: {
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: EkoColors.lightSteelBlue,
  },
  kopRij: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datum: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 16,
    color: EkoColors.primaryDark,
  },
  totaal: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 16,
    color: EkoColors.primaryDark,
  },
  nummer: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 13,
    color: EkoColors.paragraphGray,
    marginTop: 2,
  },
  fotoRij: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  foto: {
    width: 76,
    height: 96,
  },
});
