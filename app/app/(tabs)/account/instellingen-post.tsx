import { useState } from 'react';
import { Groep, Scherm, VinkRij } from '@/components/account-ui';

export default function PostVoorkeuren() {
  const [info, setInfo] = useState(true);
  const [magazine, setMagazine] = useState(true);
  return (
    <Scherm titel="Postvoorkeuren">
      <Groep>
        <VinkRij
          label="Informatie en aanbiedingen via post ontvangen"
          aan={info}
          onToggle={() => setInfo(!info)}
        />
        <VinkRij label="Magazine via post ontvangen" aan={magazine} onToggle={() => setMagazine(!magazine)} />
      </Groep>
    </Scherm>
  );
}
