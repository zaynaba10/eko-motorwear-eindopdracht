/**
 * gameConfig.ts
 * Alle "knoppen" van de mini-game op één plek.
 * Wil je het spel makkelijker of moeilijker? Pas hier iets aan,
 * je hoeft de logica niet aan te raken.
 */

export const GAME = {
  duration: 60,          // seconden per ronde
  startSpeed: 190,       // px per seconde
  minSpeed: 170,       // de motor blijft altijd rollen
  maxSpeed: 620,         // veiligheidsplafond; de luchtweerstand houdt je normaal rond 448,
                         // maar met sprongboosts kom je daar tijdelijk boven
  accel: 260,            // gaskracht (pijl rechts)
  luchtweerstand: 0.58,  // remt harder naarmate je sneller gaat -> eindsnelheid ± 448
  brake: 360,            // remmen (pijl links)
  rolWeerstand: 0.42,    // uitrollen als je niets indrukt
  slopeForce: 420,       // helling duwt je mee (bergaf) of tegen (bergop)
  gravity: 980,          // lagere valversnelling = je blijft langer zweven
  jumpForce: 480,        // sprongkracht: top op ± 118 px, bijna 1 seconde in de lucht

  riderScreenRatio: 0.35,// speler staat op 35% van links: 65% van de baan is zichtbaar vóór je
  viewWidth: 700,        // hoeveel wereld-pixels er in beeld passen (zoom).
                         // Vast getal, dus de moeilijkheid is op elke telefoon gelijk.
};

export const TERRAIN = {
  baseY: 0.68,           // hoogte van de grondlijn (fractie van de beeldhoogte)
  step: 6,               // sample-afstand voor de heuvellijn (px)
  hills: [
    { amplitude: 46, length: 150, offset: 0 },
    { amplitude: 18, length: 70, offset: 320 },
    { amplitude: 6, length: 30, offset: 90 },
  ],
};

export type ChaserConfig = {
  id: string;
  startGap: number;      // afstand achter jou bij de start (px)
  speed: number;         // beginsnelheid
  stap: number;          // hoeveel sneller ze worden per versnelling
};

/**
 * De bende. Elke motor heeft een eigen startafstand en snelheid,
 * zodat ze niet als één blok achter je rijden.
 */
export const CHASERS: ChaserConfig[] = [
  { id: 'chaser-1', startGap: 150, speed: 190, stap: 36 },
  { id: 'chaser-2', startGap: 195, speed: 180, stap: 38 },
  { id: 'chaser-3', startGap: 240, speed: 170, stap: 40 },
];

/**
 * Om de hoeveel seconden de bende een tandje bijschakelt.
 * Bij 10 seconden zijn dat 6 versnellingen per ronde van 60 seconden,
 * dus je voelt het spel geleidelijk strakker worden.
 */
export const CHASER_STAP_INTERVAL = 10;

/**
 * Obstakels op de baan: kegels, olievaten en banden.
 * Jij moet er zelf overheen springen; de bende rijdt er moeiteloos over.
 */
export const OBSTACLES = {
  startAfter: 900,       // eerste obstakel pas na deze afstand (px)
  spacing: 780,          // gemiddelde afstand tussen obstakels
  jitter: 320,           // willekeurige spreiding daarbovenop
  penaltyFactor: 0.7,    // je houdt nog 70% van je snelheid over: korte terugval
  penaltyPoints: 80,     // puntenaftrek per botsing: botsen kost vooral score,
                         // niet je hele race
  hitCooldown: 1.1,      // seconden onkwetsbaar na een botsing
  waarschuwing: 1.8,     // toon een pijl zodra een obstakel binnen zoveel seconden komt
  boost: 55,             // snelheidswinst per geslaagde sprong over een obstakel
  boostPoints: 25,       // en de bijbehorende bonuspunten
  boostDuur: 0.9,        // hoelang de KM/U-meter oranje oplicht
};

export const SCORE = {
  perMeter: 1,           // 1 punt per meter
  pixelsPerMeter: 12,    // omrekening px -> meter
  airBonusPerSecond: 20, // stuntbonus voor tijd in de lucht
  catchGap: 28,          // dichterbij dan dit = gepakt
  maxGapAhead: 60,       // zoveel voorsprong kun je bovenop je startafstand opbouwen.
                         // Die buffer is je beloning voor foutloos rijden: hij vangt
                         // een botsing in de laatste seconden op.
};
