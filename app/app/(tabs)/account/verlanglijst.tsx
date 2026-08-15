import { LegeStaat, Scherm } from '@/components/account-ui';

export default function Verlanglijst() {
  return (
    <Scherm titel="Verlanglijst">
      <LegeStaat
        icoon="heart-outline"
        titel="Je verlanglijst is leeg"
        tekst="Tik op het hartje bij een product om het hier te bewaren. Zo vind je het later makkelijk terug."
      />
    </Scherm>
  );
}
