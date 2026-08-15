import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Groep, Scherm, VinkRij, VolleKnop } from '@/components/account-ui';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';

export default function Push() {
  const [bestelling, setBestelling] = useState(true);
  const [nieuws, setNieuws] = useState(false);
  return (
    <Scherm titel="Pushmeldingen">
      <View style={st.top}>
        <Text style={st.uitleg}>
          Meldingen zijn uitgeschakeld op je apparaat. Zet ze aan in je instellingen om ze te
          ontvangen.
        </Text>
        <VolleKnop label="Meldingen inschakelen" />
      </View>
      <Groep>
        <VinkRij
          label="Updates over je bestellingen en winkelmand"
          aan={bestelling}
          onToggle={() => setBestelling(!bestelling)}
        />
        <VinkRij
          label="Nieuws, persoonlijke aanbevelingen en events"
          aan={nieuws}
          onToggle={() => setNieuws(!nieuws)}
        />
      </Groep>
    </Scherm>
  );
}

const st = StyleSheet.create({
  top: { paddingHorizontal: 16, paddingTop: 20, gap: 16 },
  uitleg: { fontFamily: EkoFonts.bodyRegular, fontSize: 14, lineHeight: 21, color: EkoColors.paragraphGray },
});
