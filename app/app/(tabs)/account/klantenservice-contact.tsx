import { Groep, MenuRij, Scherm } from '@/components/account-ui';

export default function Contact() {
  return (
    <Scherm titel="Gegevens servicekantoor">
      <Groep>
        <MenuRij
          icoon="logo-whatsapp"
          label="WhatsApp"
          extra={'Maandag tot en met zaterdag bereikbaar van 9:00 – 18:00\nBinnen 1 uur antwoord'}
          pijl={false}
        />
        <MenuRij
          icoon="mail-outline"
          label="info@ekomotorwear.be"
          extra={'We antwoorden binnen één werkdag'}
          pijl={false}
        />
        <MenuRij
          icoon="call-outline"
          label="Bel ons"
          extra={'Maandag tot en met vrijdag bereikbaar van 9:00 – 18:00\nBinnen 1 minuut antwoord'}
          pijl={false}
        />
      </Groep>
    </Scherm>
  );
}
