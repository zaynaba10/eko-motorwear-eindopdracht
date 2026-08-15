import { Groep, MenuRij, Scherm } from '@/components/account-ui';

const ITEMS = [
  'Privacy en cookies',
  'Privacybeleid',
  'Gebruiksvoorwaarden app',
  'Duurzaam ondernemen',
  'Toegankelijkheid',
];

export default function Privacy() {
  return (
    <Scherm titel="Privacy en voorwaarden">
      <Groep>
        {ITEMS.map((i) => (
          <MenuRij key={i} label={i} />
        ))}
      </Groep>
    </Scherm>
  );
}
