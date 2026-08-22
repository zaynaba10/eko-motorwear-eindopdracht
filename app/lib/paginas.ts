/**
 * Teksten van de pagina's Over ons en Onze diensten, overgenomen van de
 * website. Eén bron, zodat de app en eko-motorwear hetzelfde vertellen.
 */

export type Blok = {
  titel: string;
  alineas: string[];
};

export const OVER_ONS_INTRO =
  'Al meer dan 30 jaar helpen we motorrijders uit België, Nederland en Luxemburg veilig, comfortabel en met vertrouwen de weg op.';

export const OVER_ONS_BLOKKEN: Blok[] = [
  {
    titel: 'Onze geschiedenis',
    alineas: [
      'EKO Motorwear begon 30 jaar geleden in Kontich met de verkoop van een eigen lijn motorkleding. In het prille begin waren we vooral onderweg en bouwden we onze klantenkring op via salons en lokale beurzen. In de loop der jaren breidden we ons assortiment uit met topmerken in motorkledij, motorhelmen, motorlaarzen en tal van accessoires.',
      'Vandaag heeft ons familiebedrijf met meer dan 3.500 m² de grootste showroom van de Benelux. We ontvangen dagelijks motorrijders uit heel België, Nederland en Luxemburg die naar Kontich afzakken voor een nieuwe outfit of accessoire. Aan de basis van dat succes ligt de persoonlijke service en professionele begeleiding waarop iedere klant mag rekenen bij de zoektocht naar de perfecte motoroutfit.',
    ],
  },
  {
    titel: 'Ontdek onze showroom van 3.500 m²',
    alineas: [
      "Voel materialen, pas verschillende modellen en vergelijk topmerken zoals REV'IT!, Rukka, Schuberth, Alpinestars, Scorpion en vele andere. Alles onder één dak in Kontich.",
    ],
  },
  {
    titel: 'Ons eigen huismerk: G&F',
    alineas: [
      'Uitstekende prijs-kwaliteitverhouding, een ruime keuze aan maten van XXS tot 8XL en meerdere beenlengtes. Zo vindt iedere motorrijder een outfit die perfect zit en optimale bescherming biedt.',
    ],
  },
];

/** Kerncijfers uit het verhaal, als korte balk bovenaan Over ons. */
export const OVER_ONS_CIJFERS: { waarde: string; label: string }[] = [
  { waarde: '30+', label: 'jaar ervaring' },
  { waarde: '3.500', label: 'm² showroom' },
  { waarde: '48', label: 'topmerken' },
];

/** De vier pijlers onder "Onze missie". */
export const MISSIE: Blok[] = [
  {
    titel: 'Veilig & comfortabel',
    alineas: ['Iedere motorrijder veilig, comfortabel en met vertrouwen de weg op laten gaan.'],
  },
  {
    titel: 'Eerlijk advies',
    alineas: ['Persoonlijk en onafhankelijk advies op basis van je rijstijl, budget en gebruik.'],
  },
  {
    titel: 'Topkwaliteit',
    alineas: [
      'Kwalitatieve motorkleding, helmen en accessoires van de beste merken, aangevuld met ons huismerk G&F.',
    ],
  },
  {
    titel: 'Service na aankoop',
    alineas: ['Uitstekende service die niet stopt bij je aankoop — ook daarna staan we voor je klaar.'],
  },
];

export const CITAAT =
  '"Iedere motorrijder die onze showroom binnenstapt, behandelen we zoals we zelf geholpen willen worden: met aandacht, eerlijk en professioneel advies en respect voor ieders budget. Dat is al meer dan 30 jaar onze manier van werken."';

export const CITAAT_BRON = 'Zaakvoerders EKO Motorwear';

export type Dienst = {
  titel: string;
  tekst: string;
  punten: string[];
};

export const DIENSTEN_INTRO =
  'Herstellingen, ozonreiniging en cadeaubonnen — bij EKO Motorwear ben je voor meer dan enkel motorkledij aan het juiste adres.';

export const DIENSTEN: Dienst[] = [
  {
    titel: 'Herstellingen & aanpassingen',
    tekst:
      'Werkt de rits van je motorjas niet meer, of zijn je broekspijpen te kort of te lang? Wij herstellen en passen zowel leder als textiel motorkleding vakkundig aan.',
    punten: [
      'Ritsen en sluitingen vervangen of herstellen',
      'Textiele en lederen motorkleding, ook lederen motorpakken',
      'Mouwen of broekspijpen verkorten of verlengen',
      'Innemen of verbreden van jas, pak of broek',
    ],
  },
  {
    titel: 'Reinigen met Ozon',
    tekst:
      'Wij behandelen helmen, laarzen en kledij hygiënisch met ozon. Alles wordt volledig ontgeurd en bacterievrij gemaakt, zodat het weer fris en als nieuw ruikt.',
    punten: [
      'Werkt op alle motorhelmen, ook met communicatiesysteem',
      'Ontgeurt en ontsmet motorkledij en -laarzen',
      'Geen water of reinigingsproduct nodig',
      'één item: ± 15 minuten — meerdere producten: ± 30 tot 45 minuten',
    ],
  },
  {
    titel: 'Cadeaubon',
    tekst:
      'Niet zeker wat je moet kiezen? Met een EKO-cadeaubon laat je de motorrijder zelf de perfecte uitrusting uitzoeken.',
    punten: [
      'Zelf te bepalen bedrag',
      'Onbeperkt geldig',
      'Te besteden in één of meerdere keren',
      'Verkrijgbaar in de winkel of via onze webshop, verstuurd of afgedrukt',
    ],
  },
];

/** Zo verloopt een herstelling of reiniging in de winkel. */
export const DIENSTEN_STAPPEN: { titel: string; tekst: string }[] = [
  {
    titel: 'Breng je stuk binnen',
    tekst: 'Kom langs in Kontich met je jas, broek, helm of laarzen — een afspraak is niet nodig.',
  },
  {
    titel: 'Gratis inschatting',
    tekst: 'We bekijken het samen en geven je meteen een eerlijke prijs en een termijn.',
  },
  {
    titel: 'Klaar? Je krijgt bericht',
    tekst: 'Zodra alles klaar is, laten we het weten en kan je je stuk komen ophalen.',
  },
];

export const DIENSTEN_NOOT =
  'We kunnen geen prijzen doorgeven via telefoon of e-mail — breng je kledij gerust langs voor een gratis inschatting.';
