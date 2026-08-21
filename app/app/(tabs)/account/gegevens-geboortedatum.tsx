import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Scherm, Veld } from '@/components/account-ui';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { useGebruiker, werkBij } from '@/lib/auth';

/** Geboortedatum van het ingelogde account aanpassen. */
export default function WijzigGeboortedatum() {
  const router = useRouter();
  const gebruiker = useGebruiker();

  const [datum, setDatum] = useState(gebruiker?.geboortedatum ?? '');
  const [fout, setFout] = useState<string | null>(null);

  function opslaan() {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(datum.trim()))
      return setFout('Vul je geboortedatum in als dd/mm/jjjj.');
    werkBij({ geboortedatum: datum.trim() });
    router.back();
  }

  return (
    <Scherm titel="Geboortedatum" knop="Opslaan" onKnop={opslaan}>
      <Veld
        label="Geboortedatum (dd/mm/jjjj)"
        waarde={datum}
        onChange={(t) => {
          setDatum(t);
          setFout(null);
        }}
        toetsenbord="numeric"
      />
      {fout && <Text style={styles.fout}>{fout}</Text>}
    </Scherm>
  );
}

const styles = StyleSheet.create({
  fout: {
    paddingHorizontal: 16,
    paddingTop: 12,
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 14,
    color: EkoColors.primary,
  },
});
