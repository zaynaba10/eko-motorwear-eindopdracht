import { useState } from 'react';
import { Groep, Scherm, VinkRij } from '@/components/account-ui';

export default function SmsVoorkeuren() {
  const [aan, setAan] = useState(false);
  return (
    <Scherm titel="Sms-voorkeuren">
      <Groep>
        <VinkRij
          label="Blijf direct op de hoogte van unieke evenementen, exclusieve promoties en gelimiteerde collecties"
          aan={aan}
          onToggle={() => setAan(!aan)}
        />
      </Groep>
    </Scherm>
  );
}
