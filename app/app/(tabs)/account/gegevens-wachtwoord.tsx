import { useState } from 'react';
import { Scherm, Veld } from '@/components/account-ui';

export default function WijzigWachtwoord() {
  const [huidig, setHuidig] = useState('');
  const [nieuw, setNieuw] = useState('');
  const [bevestig, setBevestig] = useState('');
  return (
    <Scherm titel="Wachtwoord" knop="Opslaan">
      <Veld label="Huidig wachtwoord" waarde={huidig} onChange={setHuidig} wachtwoord />
      <Veld label="Nieuw wachtwoord" waarde={nieuw} onChange={setNieuw} wachtwoord />
      <Veld label="Bevestig nieuw wachtwoord" waarde={bevestig} onChange={setBevestig} wachtwoord />
    </Scherm>
  );
}
