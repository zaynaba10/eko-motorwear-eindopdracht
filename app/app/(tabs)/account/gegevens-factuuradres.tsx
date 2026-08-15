import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Scherm, Veld } from '@/components/account-ui';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';

export default function WijzigFactuuradres() {
  const [v, setV] = useState({
    aanhef: 'Mevr.',
    voornaam: 'zaynaba',
    tussenvoegsel: '',
    achternaam: 'alkodase',
    bedrijf: '',
    btw: '',
    telefoon: '',
    land: 'België',
    postcode: '9000',
    plaats: 'Gent',
    straat: 'Gestichtstraat',
    huisnummer: '69',
    bus: '202',
  });
  const zet = (k: keyof typeof v) => (w: string) => setV({ ...v, [k]: w });

  return (
    <Scherm titel="Factuuradres" knop="Opslaan">
      <Veld label="Aanhef" waarde={v.aanhef} onChange={zet('aanhef')} verplicht />
      <Veld label="Voornaam" waarde={v.voornaam} onChange={zet('voornaam')} verplicht />
      <Veld label="Tussenvoegsel" waarde={v.tussenvoegsel} onChange={zet('tussenvoegsel')} />
      <Veld label="Achternaam" waarde={v.achternaam} onChange={zet('achternaam')} verplicht />
      <Veld label="Bedrijfsnaam" waarde={v.bedrijf} onChange={zet('bedrijf')} />
      <Veld label="BTW-nummer" waarde={v.btw} onChange={zet('btw')} />
      <Veld label="Telefoonnummer" waarde={v.telefoon} onChange={zet('telefoon')} toetsenbord="phone-pad" />
      <Veld label="Land" waarde={v.land} onChange={zet('land')} verplicht />
      <Veld label="Postcode" waarde={v.postcode} onChange={zet('postcode')} verplicht />
      <Veld label="Plaats" waarde={v.plaats} onChange={zet('plaats')} verplicht />
      <Veld label="Straat" waarde={v.straat} onChange={zet('straat')} verplicht />
      <View style={st.rij}>
        <View style={st.helft}>
          <Veld label="Huisnummer" waarde={v.huisnummer} onChange={zet('huisnummer')} verplicht />
        </View>
        <View style={st.helft}>
          <Veld label="Bus" waarde={v.bus} onChange={zet('bus')} />
        </View>
      </View>
      <Text style={st.voet}>Velden met een sterretje zijn verplicht.</Text>
    </Scherm>
  );
}

const st = StyleSheet.create({
  rij: { flexDirection: 'row' },
  helft: { flex: 1 },
  voet: {
    paddingHorizontal: 16,
    paddingTop: 14,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 13,
    color: EkoColors.paragraphGray,
  },
});
