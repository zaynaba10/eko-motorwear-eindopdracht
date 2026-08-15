import { Groep, MenuRij, Scherm } from '@/components/account-ui';

const VRAGEN = [
  'Bestellen en bezorgen',
  'Ruilen en retourneren',
  'Betalen',
  'Garantie en reparatie',
  'Maten en pasvorm',
  "Meer veelgestelde vragen",
];

export default function Faq() {
  return (
    <Scherm titel="Veelgestelde vragen">
      <Groep>
        {VRAGEN.map((v) => (
          <MenuRij key={v} label={v} />
        ))}
      </Groep>
    </Scherm>
  );
}
