import { useRouter } from 'expo-router';

import { Groep, MenuRij, Scherm } from '@/components/account-ui';
import { useGebruiker } from '@/lib/auth';

/** Mijn gegevens — alles komt uit het account waarmee je bent ingelogd. */
export default function Gegevens() {
  const router = useRouter();
  const gebruiker = useGebruiker();

  if (!gebruiker) {
    return (
      <Scherm titel="Mijn gegevens">
        <Groep>
          <MenuRij label="Log in om je gegevens te bekijken" pijl={false} />
        </Groep>
      </Scherm>
    );
  }

  const naam = [gebruiker.aanhef, gebruiker.voornaam, gebruiker.tussenvoegsel, gebruiker.achternaam]
    .filter(Boolean)
    .join(' ');

  const adres = gebruiker.straat
    ? `${naam}\n${gebruiker.straat} ${gebruiker.huisnummer ?? ''}${
        gebruiker.bus ? ` bus ${gebruiker.bus}` : ''
      }\n${gebruiker.postcode ?? ''} ${gebruiker.plaats ?? ''}\n${gebruiker.land}`
    : 'Nog geen factuuradres ingevuld';

  return (
    <Scherm titel="Mijn gegevens">
      <Groep>
        <MenuRij
          icoon="mail-outline"
          label="E-mailadres"
          extra={gebruiker.email}
          onPress={() => router.push('/account/gegevens-email')}
        />
        <MenuRij
          icoon="lock-closed-outline"
          label="Wachtwoord"
          extra="••••••••••••"
          onPress={() => router.push('/account/gegevens-wachtwoord')}
        />
        <MenuRij
          icoon="call-outline"
          label="Telefoonnummer"
          extra={gebruiker.telefoon || 'Nog niet ingevuld'}
          onPress={() => router.push('/account/gegevens-telefoon')}
        />
        <MenuRij
          icoon="calendar-outline"
          label="Geboortedatum"
          extra={gebruiker.geboortedatum || 'Nog niet ingevuld'}
          onPress={() => router.push('/account/gegevens-geboortedatum')}
        />
        <MenuRij
          icoon="document-text-outline"
          label="Factuuradres"
          extra={adres}
          onPress={() => router.push('/account/gegevens-factuuradres')}
        />
        <MenuRij
          icoon="car-outline"
          label="Bezorgadressen"
          onPress={() => router.push('/account/gegevens-bezorgadressen')}
        />
      </Groep>
    </Scherm>
  );
}
