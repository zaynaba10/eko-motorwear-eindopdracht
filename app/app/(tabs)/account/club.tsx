import { Groep, MenuRij, Scherm } from '@/components/account-ui';
import { StyleSheet, Text, View } from 'react-native';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';

export default function Club() {
  return (
    <Scherm titel="EKO Club">
      <View style={st.blok}>
        <Text style={st.groot}>0</Text>
        <Text style={st.onder}>punten gespaard</Text>
        <Text style={st.uitleg}>
          Je spaart één punt per euro. Bij 750 punten krijg je 25 euro korting op je volgende
          bestelling. Punten blijven twee jaar geldig.
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
  groot: { fontFamily: EkoFonts.headingBold, fontSize: 64, color: EkoColors.primary, lineHeight: 70 },
  onder: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: EkoColors.primaryDark,
    marginBottom: 16,
  },
  uitleg: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    lineHeight: 21,
    color: EkoColors.paragraphGray,
    textAlign: 'center',
  },
});
