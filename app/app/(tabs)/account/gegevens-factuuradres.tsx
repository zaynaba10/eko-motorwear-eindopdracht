import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Scherm, Veld } from '@/components/account-ui';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { useGebruiker, werkBij } from '@/lib/auth';

/** Factuuradres van het ingelogde account aanpassen. */
export default function WijzigFactuuradres() {
  const router = useRouter();
  const gebruiker = useGebruiker();

  const [v, setV] = useState({
    aanhef: gebruiker?.aanhef ?? '',
    voornaam: gebruiker?.voornaam ?? '',
    tussenvoegsel: gebruiker?.tussenvoegsel ?? '',
    achternaam: gebruiker?.achternaam ?? '',
    bedrijf: gebruiker?.bedrijf ?? '',
    btw: gebruiker?.btw ?? '',
    telefoon: gebruiker?.telefoon ?? '',
    land: gebruiker?.land ?? 'België',
    postcode: gebruiker?.postcode ?? '',
    plaats: gebruiker?.plaats ?? '',
    straat: gebruiker?.straat ?? '',
    huisnummer: gebruiker?.huisnummer ?? '',
    bus: gebruiker?.bus ?? '',
  });
  const [fout, setFout] = useState<string | null>(null);

  const zet = (k: keyof typeof v) => (w: string) => {
    setV({ ...v, [k]: w });
    setFout(null);
  };

  function opslaan() {
    if (!v.voornaam.trim() || !v.achternaam.trim())
      return setFout('Vul je voor- en achternaam in.');
    if (!v.postcode.trim() || !v.plaats.trim() || !v.straat.trim() || !v.huisnummer.trim())
      return setFout('Vul je volledige adres in.');
    werkBij({
      aanhef: v.aanhef.trim(),
      voornaam: v.voornaam.trim(),
      tussenvoegsel: v.tussenvoegsel.trim() || undefined,
      achternaam: v.achternaam.trim(),
      bedrijf: v.bedrijf.trim() || undefined,
      btw: v.btw.trim() || undefined,
      telefoon: v.telefoon.trim() || undefined,
      land: v.land.trim(),
      postcode: v.postcode.trim(),
      plaats: v.plaats.trim(),
      straat: v.straat.trim(),
      huisnummer: v.huisnummer.trim(),
      bus: v.bus.trim() || undefined,
    });
    router.back();
  }

  return (
    <Scherm titel="Factuuradres" knop="Opslaan" onKnop={opslaan}>
      <Veld label="Aanhef" waarde={v.aanhef} onChange={zet('aanhef')} verplicht />
      <Veld label="Voornaam" waarde={v.voornaam} onChange={zet('voornaam')} verplicht />
      <Veld label="Tussenvoegsel" waarde={v.tussenvoegsel} onChange={zet('tussenvoegsel')} />
      <Veld label="Achternaam" waarde={v.achternaam} onChange={zet('achternaam')} verplicht />
      <Veld label="Bedrijfsnaam" waarde={v.bedrijf} onChange={zet('bedrijf')} />
      <Veld label="BTW-nummer" waarde={v.btw} onChange={zet('btw')} />
      <Veld
        label="Telefoonnummer"
        waarde={v.telefoon}
        onChange={zet('telefoon')}
        toetsenbord="phone-pad"
      />
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
      {fout && <Text style={st.fout}>{fout}</Text>}
      <Text style={st.voet}>Velden met een sterretje zijn verplicht.</Text>
    </Scherm>
  );
}

const st = StyleSheet.create({
  rij: { flexDirection: 'row' },
  helft: { flex: 1 },
  fout: {
    paddingHorizontal: 16,
    paddingTop: 14,
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 14,
    color: EkoColors.primary,
  },
  voet: {
    paddingHorizontal: 16,
    paddingTop: 14,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 13,
    color: EkoColors.paragraphGray,
  },
});
