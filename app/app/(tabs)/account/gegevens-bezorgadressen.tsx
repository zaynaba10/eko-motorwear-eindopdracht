import { LegeStaat, Scherm } from '@/components/account-ui';

export default function Bezorgadressen() {
  return (
    <Scherm titel="Bezorgadressen" knop="Nieuw adres toevoegen">
      <LegeStaat
        icoon="car-outline"
        titel="Klaar om te bestellen?"
        tekst="Voeg een bezorgadres toe zodat we weten waar we je bestelling mogen bezorgen."
      />
    </Scherm>
  );
}
