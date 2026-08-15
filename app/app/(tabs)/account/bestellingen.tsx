import { useState } from 'react';
import { LegeStaat, Scherm, Schakelaar } from '@/components/account-ui';

export default function Bestellingen() {
  const [waar, setWaar] = useState('Online');
  return (
    <Scherm titel="Mijn bestellingen">
      <Schakelaar opties={['Online', 'Winkel']} gekozen={waar} onKies={setWaar} />
      {waar === 'Online' ? (
        <LegeStaat
          icoon="cube-outline"
          titel="Geen bestellingen gevonden"
          tekst="Je hebt nog niets online besteld. Zodra je iets bestelt, vind je hier je pakbon en je volgnummer."
        />
      ) : (
        <LegeStaat
          icoon="storefront-outline"
          titel="Geen aankopen gevonden"
          tekst="Je aankopen in de winkel in Kontich worden hier weergegeven."
        />
      )}
    </Scherm>
  );
}
