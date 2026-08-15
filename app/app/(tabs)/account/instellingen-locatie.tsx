import { useState } from 'react';
import { Groep, KeuzeRij, Scherm } from '@/components/account-ui';

export default function Locatie() {
  const [land, setLand] = useState('België');
  return (
    <Scherm titel="Locatie">
      <Groep>
        <KeuzeRij vlag="🇳🇱" label="Nederland" aan={land === 'Nederland'} onPress={() => setLand('Nederland')} />
        <KeuzeRij vlag="🇧🇪" label="België" aan={land === 'België'} onPress={() => setLand('België')} />
      </Groep>
    </Scherm>
  );
}
