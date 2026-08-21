import { StyleSheet, Text, View } from 'react-native';

import { Groep, MenuRij, Scherm } from '@/components/account-ui';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { useGebruiker } from '@/lib/auth';
import { useBestellingen } from '@/lib/bestellingen';

/** EKO Club — punten volgen uit de bestellingen van het ingelogde account. */
export default function Club() {
  const gebruiker = useGebruiker();
  const bestellingen = useBestellingen();
  const punten = Math.floor(bestellingen.reduce((som, b) => som + b.totaal, 0));
  const tekort = Math.max(0, 750 - punten);

  return (
    <Scherm titel="EKO Club">
      <View style={st.blok}>
        <Text style={st.groot}>{punten}</Text>
        <Text style={st.onder}>punten gespaard</Text>
        {!!gebruiker && (
          <Text style={st.naam}>
            {gebruiker.voornaam} {gebruiker.achternaam}
          </Text>
        )}
        <Text style={st.uitleg}>
          Je spaart één punt per euro. Bij 750 punten krijg je 25 euro korting op je volgende
          bestelling. Punten blijven twee jaar geldig.
          {tekort > 0 ? ` Nog ${tekort} punten te gaan.` : ' Je korting staat klaar!'}
        </Text>
      </View>
      <Groep>
        <MenuRij label="Hoe werkt sparen?" />
        <MenuRij label="Mijn spaargeschiedenis" />
        <MenuRij label="Voorwaarden EKO Club" />
      </Groep>
    </Scherm>
  );
}

const st = StyleSheet.create({
  blok: { alignItems: 'center', paddingTop: 40, paddingHorizontal: 32 },
  groot: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 64,
    color: EkoColors.primary,
    lineHeight: 70,
  },
  onder: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: EkoColors.primaryDark,
    marginBottom: 10,
  },
  naam: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 15,
    color: EkoColors.primaryDark,
    marginBottom: 10,
  },
  uitleg: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    lineHeight: 21,
    color: EkoColors.paragraphGray,
    textAlign: 'center',
  },
});
