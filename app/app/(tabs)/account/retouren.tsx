import { LegeStaat, Scherm } from '@/components/account-ui';

export default function Retouren() {
  return (
    <Scherm titel="Retouren" knop="Retour aanmelden">
      <LegeStaat
        icoon="return-down-back-outline"
        titel="Je hebt geen retouren"
        tekst="Klik op retour aanmelden en volg de stappen om een artikel terug te sturen. Dat kan tot 30 dagen na ontvangst."
      />
    </Scherm>
  );
}
