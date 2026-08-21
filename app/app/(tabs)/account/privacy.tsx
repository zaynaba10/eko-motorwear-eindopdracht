import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Scherm } from '@/components/account-ui';
import { Uitklap } from '@/components/uitklap';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { PRIVACY_SECTIES, VOORWAARDEN_VERSIE } from '@/lib/juridisch';

/**
 * Privacy en voorwaarden — het volledige privacybeleid en de algemene
 * verkoopsvoorwaarden van de website, per hoofdstuk uitklapbaar.
 */
export default function Privacy() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Scherm titel="Privacy en voorwaarden">
      <View style={styles.inhoud}>
        <Text style={styles.intro}>
          Lees hier ons privacybeleid en de algemene verkoopsvoorwaarden van EKO Motorwear.
        </Text>
        <Text style={styles.versie}>{VOORWAARDEN_VERSIE}</Text>

        {PRIVACY_SECTIES.map((sectie, i) => (
          <Uitklap
            key={sectie.titel}
            titel={sectie.titel}
            open={open === i}
            onPress={() => setOpen(open === i ? null : i)}>
            {sectie.alineas.map((alinea, j) => (
              <Text key={j} style={styles.alinea}>
                {alinea}
              </Text>
            ))}
          </Uitklap>
        ))}

        <Text style={styles.voet}>
          EKO Motorwear BV · Singel 4c, 2550 Kontich · BE 0424.332.933 · vraag@eko-motorwear.be
        </Text>
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
  },
  versie: {
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 13,
    color: EkoColors.primary,
    marginTop: 6,
    marginBottom: 14,
  },
  alinea: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    lineHeight: 21,
    color: EkoColors.paragraphGray,
    marginBottom: 10,
  },
  voet: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 12,
    lineHeight: 18,
    color: EkoColors.darkGray,
    marginTop: 22,
  },
});
