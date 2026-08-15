import { useState } from 'react';
import { Groep, Scherm, VinkRij } from '@/components/account-ui';

const OPTIES = ['Nieuwsbrief', 'Promoties, acties en sale', 'Nieuws over de EKO Club', 'Klantonderzoek'];

export default function EmailVoorkeuren() {
  const [aan, setAan] = useState<string[]>(['Promoties, acties en sale']);
  const wissel = (o: string) =>
    setAan(aan.includes(o) ? aan.filter((x) => x !== o) : [...aan, o]);
  return (
    <Scherm titel="E-mailvoorkeuren">
      <Groep>
        {OPTIES.map((o) => (
          <VinkRij key={o} label={o} aan={aan.includes(o)} onToggle={() => wissel(o)} />
        ))}
      </Groep>
    </Scherm>
  );
}
