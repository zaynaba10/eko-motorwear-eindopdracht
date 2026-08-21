import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Scherm, Veld } from '@/components/account-ui';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { wijzigWachtwoord } from '@/lib/auth';

/** Wachtwoord van het ingelogde account wijzigen. */
export default function WijzigWachtwoord() {
  const router = useRouter();

  const [huidig, setHuidig] = useState('');
  const [nieuw, setNieuw] = useState('');
  const [bevestig, setBevestig] = useState('');
  const [fout, setFout] = useState<string | null>(null);

  function opslaan() {
    if (nieuw !== bevestig) return setFout('De twee nieuwe wachtwoorden zijn niet gelijk.');
    const uitkomst = wijzigWachtwoord(huidig, nieuw);
    if (!uitkomst.ok) return setFout(uitkomst.fout ?? 'Wijzigen lukte niet.');
    router.back();
  }

  return (
    <Scherm titel="Wachtwoord" knop="Opslaan" onKnop={opslaan}>
      <Veld label="Huidig wachtwoord" waarde={huidig} onChange={setHuidig} wachtwoord />
      <Veld label="Nieuw wachtwoord" waarde={nieuw} onChange={setNieuw} wachtwoord />
      <Veld label="Bevestig nieuw wachtwoord" waarde={bevestig} onChange={setBevestig} wachtwoord />
      <Text style={styles.regels}>
        Minimaal 6 tekens · 1 cijfer · 1 hoofdletter · 1 kleine letter
      </Text>
      {fout && <Text style={styles.fout}>{fout}</Text>}
    </Scherm>
  );
}

const styles = StyleSheet.create({
  regels: {
    paddingHorizontal: 16,
    paddingTop: 12,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 12,
    color: EkoColors.paragraphGray,
  },
  fout: {
    paddingHorizontal: 16,
    paddingTop: 12,
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 14,
    color: EkoColors.primary,
  },
});
