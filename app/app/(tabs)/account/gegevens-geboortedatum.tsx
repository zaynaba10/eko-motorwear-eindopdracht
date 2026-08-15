import { useState } from 'react';
import { Scherm, Veld } from '@/components/account-ui';

export default function WijzigGeboortedatum() {
  const [datum, setDatum] = useState('09/10/1996');
  return (
    <Scherm titel="Geboortedatum" knop="Opslaan">
      <Veld label="Geboortedatum" waarde={datum} onChange={setDatum} toetsenbord="numeric" />
    </Scherm>
  );
}
