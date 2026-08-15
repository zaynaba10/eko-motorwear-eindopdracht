import { LegeStaat, Scherm } from '@/components/account-ui';

export default function Kortingscodes() {
  return (
    <Scherm titel="Kortingscodes" knop="Code toevoegen">
      <LegeStaat
        icoon="pricetag-outline"
        titel="Nog geen kortingscodes"
        tekst="Codes uit onze nieuwsbrief of van een actie verschijnen hier. Je kunt ze ook zelf toevoegen."
      />
    </Scherm>
  );
}
