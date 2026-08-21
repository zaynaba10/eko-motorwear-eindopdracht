import { useRouter } from 'expo-router';
import { useState } from 'react';

import { Scherm, Veld } from '@/components/account-ui';
import { useGebruiker, werkBij } from '@/lib/auth';

/** Telefoonnummer van het ingelogde account aanpassen. */
export default function WijzigTelefoon() {
  const router = useRouter();
  const gebruiker = useGebruiker();
  const [tel, setTel] = useState(gebruiker?.telefoon ?? '');

  return (
    <Scherm
      titel="Telefoonnummer"
      knop="Opslaan"
      onKnop={() => {
        werkBij({ telefoon: tel.trim() });
        router.back();
      }}>
      <Veld label="Telefoonnummer" waarde={tel} onChange={setTel} toetsenbord="phone-pad" />
    </Scherm>
  );
}
