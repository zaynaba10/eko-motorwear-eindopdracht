import { StyleSheet, Text, View } from 'react-native';
import { Groep, MenuRij, Scherm } from '@/components/account-ui';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';

const UREN = [
  ['Maandag', 'Gesloten'],
  ['Dinsdag', '10:00 – 18:00'],
  ['Woensdag', '10:00 – 18:00'],
  ['Donderdag', '10:00 – 18:00'],
  ['Vrijdag', '10:00 – 18:00'],
  ['Zaterdag', '10:00 – 17:00'],
  ['Zondag', 'Gesloten'],
];

export default function Winkel() {
  return (
    <Scherm titel="Winkel en openingsuren" knop="Route naar de winkel">
      <View style={st.adres}>
        <Text style={st.naam}>EKO Motorwear Kontich</Text>
        <Text style={st.regel}>Mechelsesteenweg 100</Text>
        <Text style={st.regel}>2550 Kontich</Text>
        <Text style={st.regel}>België</Text>
      </View>
      <Groep>
        {UREN.map(([dag, uur]) => (
          <MenuRij key={dag} label={dag} extra={uur} pijl={false} />
        ))}
      </Groep>
    </Scherm>
  );
}

const st = StyleSheet.create({
  adres: { paddingHorizontal: 16, paddingTop: 24, gap: 3 },
  naam: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: EkoColors.primaryDark,
    marginBottom: 6,
  },
  regel: { fontFamily: EkoFonts.bodyRegular, fontSize: 15, color: EkoColors.paragraphGray },
});
