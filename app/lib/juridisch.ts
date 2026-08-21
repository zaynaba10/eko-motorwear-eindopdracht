/**
 * Teksten van de website: de veelgestelde vragen (FAQ) en het privacybeleid
 * met de algemene verkoopsvoorwaarden. Eén bron voor de app, zodat de
 * klantenservice in het dashboard hetzelfde toont als eko-motorwear.
 */

export type Vraag = {
  vraag: string;
  antwoord: string;
};

/** Veelgestelde vragen, in dezelfde volgorde als op de FAQ-pagina. */
export const FAQ: Vraag[] = [
  {
    vraag: 'Wat kost verzending?',
    antwoord:
      'Gratis verzending in België vanaf €40. Onder €40 betaal je €7,50 verzendkosten. Voor Nederland, Frankrijk, Luxemburg en Duitsland is verzending gratis vanaf €40 (anders €13,50), en voor de rest van Europa gratis vanaf €40 (anders €20). Verzending buiten Europa kan enkel na overleg met ons.',
  },
  {
    vraag: 'Wat zijn de leveringstermijnen?',
    antwoord:
      'Bestel en betaal je op een werkdag vóór 11 uur, dan versturen we je pakket meestal dezelfde dag nog. Bestel je in het weekend of op een feestdag, dan verzenden we de eerstvolgende werkdag. Is een product tijdelijk niet op voorraad, dan laten we je dat per e-mail weten en kan je je bestelling aanpassen of annuleren.',
  },
  {
    vraag: 'Hoe zit het met garantie op mijn aankoop?',
    antwoord:
      'Vertoont een product na levering een fabricagefout? Stuur het gratis naar ons terug en we bezorgen je kosteloos een nieuw exemplaar of, in overleg, een gelijkwaardig alternatief. Meld dit binnen de 30 dagen na vaststelling – wij bezorgen je een gratis retourlabel.',
  },
  {
    vraag: 'Hoe pas ik mijn accountgegevens aan?',
    antwoord:
      "Log in op 'Mijn Account' om je gegevens te bekijken of aan te passen. Wachtwoord vergeten? Klik op de inlogpagina op 'Wachtwoord vergeten' en volg de instructies om een nieuw wachtwoord in te stellen. Een account aanmaken bij EKO Motorwear is volledig gratis.",
  },
  {
    vraag: 'Hoe kan ik betalen?',
    antwoord:
      'Online betaal je veilig via Mollie of PayPal. Je kan kiezen voor je persoonlijke PayPal-rekening of betalen met Bancontact, Maestro, Visa of Mastercard. Zodra de betaling is goedgekeurd, verwerken we je bestelling meteen. Betaal je met een kredietkaart, dan gelden de voorwaarden van je kaartuitgever.',
  },
  {
    vraag: 'Hoe retourneer of ruil ik een bestelling?',
    antwoord:
      'Je kan een online aankoop binnen 14 dagen na levering gratis ruilen voor een andere maat of product, of terugbrengen naar onze winkel in Kontich. Koos je liever voor terugbetaling? Stuur het artikel dan binnen 14 dagen terug – de retourkosten zijn voor eigen rekening. Zorg dat het product ongebruikt is, met alle labels en originele verpakking. Kocht je in de winkel? Dan ruil je gratis binnen de 14 dagen (kasticket meebrengen); voor terugbetaling krijg je een waardebon in de plaats. Let op: onderhoudsproducten, oordopjes, motoroliën en cadeaubonnen kan je niet terugsturen, en afgeprijsde artikelen worden niet terugbetaald of geruild.',
  },
  {
    vraag: 'Hoe kies ik de juiste maat?',
    antwoord:
      'Twijfel je over je maat? Neem gerust contact met ons op via het contactformulier of kom langs in onze winkel in Kontich – we helpen je graag met persoonlijk maatadvies voor motorkleding en -uitrusting.',
  },
  {
    vraag: 'Kan ik mijn bestelling nog annuleren of wijzigen?',
    antwoord:
      'Neem zo snel mogelijk contact met ons op via het contactformulier of telefonisch. Is je bestelling nog niet verzonden, dan passen we ze graag aan of annuleren we ze voor je. Is ze al onderweg, dan kan je ze na levering binnen de 14 dagen gratis retourneren.',
  },
];

export type JuridischeSectie = {
  titel: string;
  alineas: string[];
};

/** Geldigheid van de voorwaarden, zoals bovenaan de website-pagina. */
export const VOORWAARDEN_VERSIE = 'Geldig vanaf 24/03/2025 – versie 019';

/** Privacybeleid en algemene verkoopsvoorwaarden, sectie per sectie. */
export const PRIVACY_SECTIES: JuridischeSectie[] = [
  {
    titel: '1. Inleidende bepaling',
    alineas: [
      'De rechtsverhouding tussen EKO Motorwear BV, met maatschappelijke zetel te Singel 4c, 2550 Kontich, België, ingeschreven in de Kruispuntbank van Ondernemingen onder het nummer 0424.332.933 en eenieder die een aankoop wenst te verrichten via de Website ("de Koper") wordt uitsluitend beheerst door de onderhavige Algemene Verkoopsvoorwaarden, geldig vanaf 24/03/2025 - versie 019. Alle andere voorwaarden of aanpassingen van onderhavige Voorwaarden zijn slechts van toepassing wanneer deze schriftelijk door EKO Motorwear BV zijn goedgekeurd.',
      'Indien u vragen of klachten heeft met betrekking tot de website, de aangeboden producten of de onderhavige algemene verkoopsvoorwaarden, gelieve dan contact op te nemen met EKO Motorwear:',
      '– Door middel van het voorziene contactformulier op de website;',
      '– Door het zenden van een brief naar: EKO Motorwear BV, Singel 4c, 2550 Kontich, België;',
      '– Door het zenden van een e-mail naar: vraag@eko-motorwear.be;',
      '– Telefonisch naar +32(0)3/457.11.28, van maandag tot en met vrijdag van 09u00 tot 18u00 en op zaterdag van 10u00 tot 18u00.',
      'Om een bestelling te plaatsen, dient u minstens 18 jaar oud te zijn.',
      'Door het plaatsen van een bestelling op de Website bevestigt de Koper uitdrukkelijk de onderhavige Algemene Verkoopsvoorwaarden te hebben gelezen, goedgekeurd en aanvaard.',
      'EKO Motorwear behoudt zich het recht deze algemene voorwaarden op ieder ogenblik te wijzigen en/of aan te vullen voor toekomstige bestellingen. Op lopende overeenkomsten gelden de voorwaarden die van toepassing waren op het moment van de totstandkoming van de overeenkomst.',
    ],
  },
  {
    titel: '2. Definities',
    alineas: [
      'In deze algemene voorwaarden wordt verstaan onder:',
      '"Webshop – EKO Motorwear": de website van EKO Motorwear BV waarop de producten worden aangeboden en verkocht aan de klanten.',
      '"Klant": iedere natuurlijke persoon of rechtspersoon die een bestelling doorgeeft via de website "Webshop – EKO Motorwear".',
      '"Bestelling": sluiting van een verkoopovereenkomst tussen EKO Motorwear en de klant met betrekking tot de producten die worden aangeboden op Webshop – EKO Motorwear.',
      '"Producten": alle goederen aangeboden door EKO Motorwear via Webshop – EKO Motorwear die het onderwerp kunnen vormen van één of meerdere overeenkomsten.',
    ],
  },
  {
    titel: '3. Aanbiedingen en totstandkoming van overeenkomsten',
    alineas: [
      'Aanbiedingen zijn geldig zolang de voorraad strekt. Een overeenkomst komt tot stand op het moment dat er een e-mail wordt verzonden naar het door de klant opgegeven e-mailadres ter bevestiging van zijn bestelling.',
      'De klant en EKO Motorwear komen uitdrukkelijk overeen dat er een geldige overeenkomst tot stand kan komen door gebruik te maken van elektronische communicatievormen. Met name ook het ontbreken van een gewone handtekening doet geen afbreuk aan de verbindende kracht van de overeenkomst. Voor zover de wet het toelaat gelden de elektronische bestanden van EKO Motorwear hiervoor als een vermoeden van bewijs.',
      'Webshop – EKO Motorwear behoudt zich het recht bestellingen te weigeren in volgende gevallen:',
      '– Bij ernstig vermoeden van rechtsmisbruik of kwade trouw van de klant, o.a. veelvuldig goederen bestellen en retourneren zonder effectieve aankoop.',
      '– Bij overmacht, o.a. brand of natuurrampen.',
      'In deze gevallen zal EKO Motorwear aan de klant laten weten dat de bestelling wordt geweigerd.',
      'Behoudens fouten is het in zeldzame gevallen mogelijk dat niet-leverbare artikels toch worden aangeboden in de webshop. In dit geval wordt de klant altijd persoonlijk en zo spoedig mogelijk op de hoogte gebracht. De betaling wordt desgevallend zo snel mogelijk en uiterlijk binnen de 14 dagen en zonder kosten terugbetaald.',
    ],
  },
  {
    titel: '4. Prijzen',
    alineas: [
      'Alle prijzen zijn uitgedrukt in euro en zijn inclusief btw. De prijs vermeld in de e-mail ter bevestiging van een bestelling is de prijs verschuldigd door de klant.',
      'Webshop – EKO Motorwear behoudt zich het recht om de prijs van een product te wijzigen op elk moment, maar de producten worden steeds gefactureerd op basis van de geldende tarieven op het moment van de totstandkoming van de overeenkomst.',
    ],
  },
  {
    titel: '5. Garantie op fabricagefouten',
    alineas: [
      'Mocht na levering blijken dat een product fabricagefouten vertoont, vragen wij u dit product terug te sturen en sturen wij u kosteloos een nieuw product (hetzelfde product of een in overleg bepaald alternatief product) ter vervanging. EKO Motorwear bezorgt u een retourlabel om het product gratis retour te sturen.',
      'Wij vragen u deze onregelmatigheid binnen de 30 dagen te melden.',
    ],
  },
  {
    titel: '6. Herroepingsrecht en retourneren',
    alineas: [
      'Als consument heeft u het recht om uw online aankoop binnen de 14 kalenderdagen na ontvangst van het product te herroepen, zonder opgave van reden. U meldt dit binnen die termijn via de pagina Retour Aanmelden op de website, per e-mail naar vraag@eko-motorwear.be of in onze winkel in Kontich.',
      'Het product stuurt u vervolgens binnen de 14 dagen na uw melding terug in de originele, onbeschadigde verpakking, ongedragen en voorzien van alle labels. Na ontvangst en controle betalen wij het volledige aankoopbedrag zo snel mogelijk en uiterlijk binnen de 14 dagen terug via dezelfde betaalmethode waarmee u betaalde.',
      'Omruilen kan uiteraard ook: geef bij uw retourmelding aan welke maat of welk artikel u in de plaats wenst. Cadeaubonnen en artikelen die om hygiënische redenen niet teruggenomen kunnen worden, zijn uitgesloten van het herroepingsrecht.',
    ],
  },
  {
    titel: "7. Productfoto's en omschrijving",
    alineas: [
      "Het kan gebeuren dat de foto's op onze website afwijken van het originele product. Door eventuele aanpassingen die gebeuren tijdens de productie is het mogelijk dat kleine veranderingen ontstaan. Dit kan onder andere voorkomen in de kleur van het product, het model en de afwerking. Ook kan de productinformatie onvolledig zijn. Omdat productfoto's en productomschrijvingen aangeleverd worden door de fabrikant, is EKO Motorwear hiervoor niet aansprakelijk.",
    ],
  },
  {
    titel: '8. Privacy',
    alineas: [
      'EKO Motorwear BV, ingeschreven in het RPR te Antwerpen onder het nummer BE0424.332.933, neemt de nodige maatregelen om uw privacy te beschermen overeenkomstig de wetgeving inzake de verwerking van persoonsgegevens.',
      'Wij gebruiken cookies; voor meer informatie hierover verwijzen wij naar onze website.',
    ],
  },
  {
    titel: '8.1 Welke persoonsgegevens verzamelen en verwerken we?',
    alineas: [
      'Wanneer u zich inschrijft op een nieuwsbrief, een bestelling plaatst via onze webshop of ons op een andere wijze persoonsgegevens over uzelf bezorgt, verzamelen en verwerken we volgende persoonsgegevens: voornaam, naam, adres, (mobiel) telefoonnummer en e-mailadres. Uw e-mailadres geven we enkel door aan derden als u hierin toestemt.',
    ],
  },
  {
    titel: '8.2 Waarom verwerken wij persoonsgegevens?',
    alineas: [
      'Uw persoonsgegevens kunnen gebruikt worden:',
      '– Om de inhoud van onze producten en onze website te verbeteren;',
      '– Voor onze klantenadministratie;',
      '– Voor direct marketingdoeleinden;',
      '– Voor de verkoop en de promotie van onze producten en diensten;',
      '– Om marktonderzoek te verrichten;',
      '– Voor het beheer van onze website;',
      '– Voor het beheer van onze wedstrijden en promotionele acties.',
      'Wij kunnen uw persoonsgegevens gebruiken voor nieuwe doeleinden die nog niet voorzien zijn in ons privacybeleid. In dat geval zullen wij u contacteren alvorens uw gegevens te gebruiken voor deze nieuwe doeleinden.',
    ],
  },
  {
    titel: '8.3 Met wie delen wij uw persoonsgegevens?',
    alineas: [
      'Deze persoonsgegevens worden verwerkt door EKO Motorwear BV, die de verantwoordelijke is voor de verwerking. Wij kunnen deze gegevens delen binnen onze organisatie.',
    ],
  },
  {
    titel: '8.4 Wat zijn uw rechten?',
    alineas: [
      'U heeft het recht op inzage en verbetering van uw gegevens. Contacteer ons hiervoor schriftelijk op het adres vermeld bovenaan dit privacybeleid, of per e-mail via vraag@eko-motorwear.be.',
      'U heeft ook steeds het recht om u te verzetten tegen de verwerking van uw persoonsgegevens voor direct-marketingdoeleinden, en tegen de doorgifte ervan aan derden.',
      'Als u ons uw telefoonnummer meedeelt, kan u van ons telefonische oproepen krijgen met informatie over bestellingen of herstellingen. Als u ons uw e-mailadres meedeelt, kan u van ons e-mails ontvangen met informatie over producten, diensten en evenementen. Als u ons uw postadres meedeelt, kan u van ons mailings ontvangen met informatie over producten, diensten en evenementen.',
      'Wij hebben de nodige veiligheidsmaatregelen ingevoerd om verlies, onrechtmatig gebruik of wijziging te voorkomen van informatie die wij ontvangen via onze website.',
    ],
  },
  {
    titel: '9. Copyright',
    alineas: [
      "Op alle foto's en beelden getoond op de website van Webshop – EKO Motorwear is copyright van toepassing.",
      'Dit geldt voor alle afbeeldingen, ongeacht de manier van verspreiden of de vorm waarin ze geleverd zijn.',
      'Geen enkele foto mag worden verveelvoudigd en/of openbaar gemaakt worden door middel van druk, fotokopie, foto van foto, microfilm, digitaal of op welke andere wijze ook, zonder voorafgaande schriftelijke toestemming van EKO Motorwear BV.',
      'Indien u zonder voorafgaande toestemming gebruikmaakt van een foto van deze website, wordt u aangemaand het gebruik te staken en wordt een schadeclaim bij u ingediend.',
    ],
  },
  {
    titel: '10. Toepasselijk recht',
    alineas: [
      'Indien er moeilijkheden ontstaan tijdens de uitvoering van een overeenkomst, verbinden de klant en EKO Motorwear BV zich ertoe om, alvorens gerechtelijke stappen te ondernemen, de mogelijkheid tot een minnelijke schikking te onderzoeken.',
      'De overeenkomsten en alle juridische verslagen tussen de klant en EKO Motorwear BV zijn onderworpen aan het Belgisch recht.',
      'Alle geschillen vallen onder de exclusieve bevoegdheid van de rechtbanken bevoegd voor onze maatschappelijke zetel. Voor alternatieve geschillenbeslechting kan je terecht bij de Belgische Consumentenombudsdienst.',
    ],
  },
];
