import { useState } from 'react';
import { Scherm, Veld } from '@/components/account-ui';

export default function WijzigTelefoon() {
  const [tel, setTel] = useState('');
  return (
    <Scherm titel="Telefoonnummer" knop="Opslaan">
      <Veld label="Telefoonnummer" waarde={tel} onChange={setTel} toetsenbord="phone-pad" />
    </Scherm>
  );
}
