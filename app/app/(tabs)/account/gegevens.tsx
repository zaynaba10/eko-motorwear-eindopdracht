import { useRouter } from 'expo-router';
import { Groep, MenuRij, Scherm } from '@/components/account-ui';

export default function Gegevens() {
  const router = useRouter();
  return (
    <Scherm titel="Mijn gegevens">
      <Groep>
        <MenuRij
          icoon="mail-outline"
          label="E-mailadres"
          extra="zaynaba_alkodase@hotmail.com"
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
          onPress={() => router.push('/account/gegevens-telefoon')}
        />
        <MenuRij
          icoon="calendar-outline"
          label="Geboortedatum"
          extra="9 oktober 1996"
          onPress={() => router.push('/account/gegevens-geboortedatum')}
        />
        <MenuRij
          icoon="document-text-outline"
          label="Factuuradres"
          extra={'Mevr. zaynaba alkodase\nGestichtstraat 69 bus 202\n9000 Gent\nBelgië'}
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
