import { useState } from 'react';
import { Scherm, Veld } from '@/components/account-ui';

export default function WijzigEmail() {
  const [nieuw, setNieuw] = useState('');
  const [pw, setPw] = useState('');
  return (
    <Scherm titel="E-mailadres" knop="Opslaan">
      <Veld label="Huidig e-mailadres" waarde="zaynaba_alkodase@hotmail.com" vast />
      <Veld label="Nieuw e-mailadres" waarde={nieuw} onChange={setNieuw} toetsenbord="email-address" />
      <Veld label="Huidig wachtwoord" waarde={pw} onChange={setPw} wachtwoord />
    </Scherm>
  );
}
