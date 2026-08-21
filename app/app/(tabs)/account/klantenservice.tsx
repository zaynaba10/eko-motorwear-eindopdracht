import { useRouter } from 'expo-router';

import { Groep, MenuRij, Scherm } from '@/components/account-ui';

export default function Klantenservice() {
  const router = useRouter();
  return (
    <Scherm titel="Klantenservice">
      <Groep>
        <MenuRij
          icoon="create-outline"
          label="Stuur ons een bericht"
          extra={'Naam, e-mail, je vraag en eventueel een bijlage\nAntwoord binnen één werkdag'}
          onPress={() => router.push('/account/klantenservice-bericht')}
        />
        <MenuRij
          icoon="chatbubble-ellipses-outline"
          label="Chat"
          extra={'Maandag tot en met zaterdag bereikbaar van 9:00 – 18:00\nBinnen 1 minuut antwoord'}
          pijl={false}
        />
        <MenuRij
          icoon="business-outline"
          label="Gegevens servicekantoor"
          onPress={() => router.push('/account/klantenservice-contact')}
        />
        <MenuRij
          icoon="help-circle-outline"
          label="Veelgestelde vragen"
          onPress={() => router.push('/account/klantenservice-faq')}
        />
        <MenuRij icoon="star-outline" label="Geef feedback" />
      </Groep>
    </Scherm>
  );
}
