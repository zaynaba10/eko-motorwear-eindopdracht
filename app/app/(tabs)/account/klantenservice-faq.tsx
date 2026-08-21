import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Scherm } from '@/components/account-ui';
import { Uitklap } from '@/components/uitklap';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { FAQ } from '@/lib/juridisch';

/**
 * Veelgestelde vragen — dezelfde vragen en antwoorden als op de FAQ-pagina
 * van de website, hier als uitklapblokken.
 */
export default function Faq() {
  const router = useRouter();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Scherm titel="Veelgestelde vragen">
      <View style={styles.inhoud}>
        <Text style={styles.intro}>
          Vind snel antwoord op je vragen over bestellen, verzending, betalen en retourneren.
        </Text>

        {FAQ.map((v, i) => (
          <Uitklap
            key={v.vraag}
            titel={v.vraag}
            open={open === i}
            onPress={() => setOpen(open === i ? null : i)}>
            <Text style={styles.antwoord}>{v.antwoord}</Text>
          </Uitklap>
        ))}

        <Text style={styles.nogVragen}>Nog vragen?</Text>
        <Pressable
          style={styles.knop}
          onPress={() => router.push('/account/klantenservice-bericht')}>
          <Text style={styles.knopTekst}>Stuur ons een bericht</Text>
        </Pressable>
      </View>
    </Scherm>
  );
}

const styles = StyleSheet.create({
  inhoud: { paddingHorizontal: 16, paddingTop: 4 },
  intro: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    lineHeight: 21,
    color: EkoColors.paragraphGray,
    marginBottom: 14,
  },
  antwoord: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    lineHeight: 21,
    color: EkoColors.paragraphGray,
  },
  nogVragen: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 15,
    color: EkoColors.primaryDark,
    marginTop: 26,
    marginBottom: 12,
  },
  knop: {
    backgroundColor: EkoColors.primaryDark,
    paddingVertical: 15,
    alignItems: 'center',
  },
  knopTekst: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 15,
    color: EkoColors.white,
  },
});
