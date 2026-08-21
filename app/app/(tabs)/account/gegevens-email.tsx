import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Scherm, Veld } from '@/components/account-ui';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { login, useGebruiker, werkBij } from '@/lib/auth';

/** E-mailadres van het ingelogde account aanpassen. */
export default function WijzigEmail() {
  const router = useRouter();
  const gebruiker = useGebruiker();

  const [nieuw, setNieuw] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');
  const [fout, setFout] = useState<string | null>(null);

  function opslaan() {
    if (!gebruiker) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nieuw.trim()))
      return setFout('Vul een geldig e-mailadres in.');
    /* Controleren of het huidige wachtwoord klopt. */
    if (!login(gebruiker.email, wachtwoord).ok)
      return setFout('Je wachtwoord klopt niet.');
    werkBij({ email: nieuw.trim() });
    router.back();
  }

  return (
    <Scherm titel="E-mailadres" knop="Opslaan" onKnop={opslaan}>
      <Veld label="Huidig e-mailadres" waarde={gebruiker?.email ?? ''} vast />
      <Veld
        label="Nieuw e-mailadres"
        waarde={nieuw}
        onChange={(t) => {
          setNieuw(t);
          setFout(null);
        }}
        toetsenbord="email-address"
      />
      <Veld
        label="Huidig wachtwoord"
        waarde={wachtwoord}
        onChange={(t) => {
          setWachtwoord(t);
          setFout(null);
        }}
        wachtwoord
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
