/**
 * Winkelboom — dezelfde warenhuis-structuur als op de website (winkel →
 * hoofdcategorie → subcategorie → artikeltype), overgenomen van EKO Motorwear.
 * De foto's komen uit de Webflow-assets van de site zodat app en website
 * hetzelfde beeld tonen.
 */

const CDN = 'https://cdn.prod.website-files.com/6a7260ea77f40c20eaaa7ebc';

export type Subcategorie = {
  naam: string;
  slug: string;
  foto?: string;
};

export type Hoofdcategorie = {
  naam: string;
  slug: string;
  foto: string;
  subs: Subcategorie[];
};

/** Foto per subcategorie (zelfde assets als de tegels op de website). */
const SUBFOTO: Record<string, string> = {
  jassen: `${CDN}/6a835c3dbfa8327a400d0013_114646_01_106019BLACKLC_STOUR_MOTORCYCLE_JACKET_BLACK_01.jpeg`,
  broeken: `${CDN}/6a83676ca6092d690cd86b72_114579_01_94568_Cruiser_Lueft-offen_front_0925-056-600x600.jpeg`,
  motorhandschoenen: `${CDN}/6a8377ddb425641a6cc68829_114557_01_1.png`,
  motorhelmen: `${CDN}/6a836b1ef8b1974b59424bc1_114584_01_HJC_Rpha12_Anti_Venom_2_135-0525_1_b385.jpeg`,
  communicatie: `${CDN}/6a837fd76814966d875629c2_114576_01_1.png`,
  motorlaarzen: `${CDN}/6a836bc0b04b4556ab4ed04d_114130_01_2040126-10-fr-corozal-v2-adventure-drystar-boot.png`,
  motorschoenen: `${CDN}/6a836cf5b425641a6cc2c7f2_114034_01_090725153236_217298682043797297.jpeg`,
  rugprotectors: `${CDN}/6a8380b641b487388c951693_114626_01_1.png`,
  beschermingsjacks: `${CDN}/6a837ab7eb9282f7ed64197a_114095_01_1.png`,
  protectoren: `${CDN}/6a8380b641b487388c951693_114626_01_1.png`,
  motorbagage: `${CDN}/6a8394a061c20f1317742053_114635_01_Macna_Vortero_165-6535-101_1_bbf7.png`,
};

function sub(naam: string, slug: string): Subcategorie {
  return { naam, slug, foto: SUBFOTO[slug] };
}

/** Hoofdcategorieën met al hun subcategorieën (volledige EKO-structuur). */
export const HOOFDCATEGORIEEN: Hoofdcategorie[] = [
  {
    naam: 'Motorkledij',
    slug: 'motorkledij',
    foto: SUBFOTO.jassen,
    subs: [
      sub('Jassen', 'jassen'),
      sub('Broeken', 'broeken'),
      sub('Motorpakken', 'motorpakken'),
      sub('Protectoren', 'protectoren'),
      sub('Motorkleding Accessoires', 'motorkleding-accessoires'),
      sub('Vrijetijdskledij', 'vrijetijdskledij'),
      sub('Regenkledij', 'regenkledij'),
      sub('Onderkledij', 'onderkledij'),
      sub('Motorcross', 'motorcross'),
      sub('Kinder motorkledij', 'kinder-motorkledij'),
    ],
  },
  {
    naam: 'Handschoenen',
    slug: 'handschoenen',
    foto: SUBFOTO.motorhandschoenen,
    subs: [
      sub('Motorhandschoenen', 'motorhandschoenen'),
      sub('Onderhandschoenen', 'onderhandschoenen'),
      sub('Verwarmde handschoenen', 'verwarmde-handschoenen'),
      sub('Crosshandschoenen', 'crosshandschoenen'),
    ],
  },
  {
    naam: 'Helmen',
    slug: 'helmet',
    foto: `${CDN}/6a8381bc63a669cc259758d6_111342_01_7-1.jpeg`,
    subs: [
      sub('Motorhelmen', 'motorhelmen'),
      sub('Helm vizieren', 'helm-vizieren'),
      sub('Communicatie', 'communicatie'),
      sub('Helmaccessoires', 'helmaccessoires'),
    ],
  },
  {
    naam: 'Laarzen',
    slug: 'laarzen',
    foto: SUBFOTO.motorlaarzen,
    subs: [
      sub('Motorlaarzen', 'motorlaarzen'),
      sub('Motorschoenen', 'motorschoenen'),
      sub('Accessoires laarzen', 'accessoires-laarzen'),
    ],
  },
  {
    naam: 'Beschermingssets',
    slug: 'protection-set',
    foto: SUBFOTO.beschermingsjacks,
    subs: [sub('Rugprotectors', 'rugprotectors'), sub('Beschermingsjacks', 'beschermingsjacks')],
  },
  {
    naam: 'Bagage',
    slug: 'bagage',
    foto: SUBFOTO.motorbagage,
    subs: [sub('Motorbagage', 'motorbagage'), sub('Accessoires bagage', 'accessoires-bagage')],
  },
  {
    naam: 'Accessoires',
    slug: 'accessoires',
    foto: SUBFOTO.communicatie,
    subs: [
      sub('Sloten', 'sloten'),
      sub('GPS / Smartphone', 'gps-smartphone'),
      sub('Motoraccessoires', 'motoraccessoires'),
      sub('Onderhoudsproducten', 'onderhoudsproducten'),
      sub('Geschenken', 'geschenken'),
      sub('Motoronderdelen', 'motoronderdelen'),
    ],
  },
];

export type Artikeltypes = {
  kop: string;
  types: [string, string[]][];
};

/**
 * Artikeltypes per subcategorie (overgenomen van EKO Motorwear). De kop is de
 * lijsttitel; de kernwoorden koppelen eigen producten aan het juiste type.
 */
export const ARTIKELTYPES: Record<string, Artikeltypes> = {
  jassen: { kop: 'Motorjassen', types: [['Airbagvest', ['airbag']], ['Gilet', ['gilet']], ['Motorhoodie', ['hoodie']], ['Motorjas', ['motorjas']]] },
  broeken: { kop: 'Motorbroeken', types: [['Motorbroek', ['motorbroek']], ['Overbroek', ['overbroek']]] },
  motorpakken: { kop: 'Motorpakken', types: [['Eéndelig leder motorpak', ['motorpak']]] },
  protectoren: { kop: 'Protectoren', types: [['Borstbeschermer', ['borst']], ['Elleboogbeschermer', ['elleboog']], ['Kneesliders', ['slider']], ['Knie/heupbeschermer', ['knie']], ['Rugbeschermer', ['rugprotector', 'rugbeschermer']]] },
  'motorkleding-accessoires': { kop: 'Motorkleding Accessoires', types: [['Bretellen', ['bretel']], ['Ceintuur / Riem', ['ceintuur', 'riem']], ['Helm muts / Buff', ['muts', 'buff']], ['Niergordels', ['niergordel']]] },
  vrijetijdskledij: { kop: 'Vrijetijdskledij', types: [['Petten/mutsen', ['pet ', 'muts']], ['Sweaters', ['sweater']], ['T-Shirts', ['shirt']]] },
  regenkledij: { kop: 'Regenkledij', types: [['Regen overhandschoenen', ['overhandschoen']], ['Regen overlaarzen', ['overlaars']], ['Regenbroek', ['regenbroek']], ['Regenjas', ['regenjas']], ['Regenoverall', ['overall']]] },
  onderkledij: { kop: 'Onderkledij', types: [['Beschermend onderkledij', ['beschermend']], ['Koelvest', ['koelvest']], ['Sokken', ['sok']], ['Verwarmde onderkledij', ['verwarmd']], ['Winter onderkledij', ['winter']], ['Zomer onderkledij', ['zomer']]] },
  motorcross: { kop: 'Motorcross', types: [['Broeken', ['broek']], ['Shirts', ['shirt']]] },
  motorhelmen: { kop: 'Motorhelmen', types: [['ANC helmen', ['anc']], ['Cross helmen', ['crosshelm']], ['Integraal helmen', ['integraalhelm']], ['Jet helmen', ['jethelm']], ['Systeem helmen', ['systeemhelm']]] },
  'helm-vizieren': { kop: 'Helm vizieren', types: [['Pinlock', ['pinlock']], ['Vizier', ['vizier']]] },
  helmaccessoires: { kop: 'Helmaccessoires', types: [['Helmaccessoires', ['helmaccessoire']], ['Helmstickers', ['sticker']], ['Motorbrillen', ['bril']], ['Oordoppen', ['oordop']]] },
  communicatie: { kop: 'Communicatie', types: [['Communicatie onderdelen', ['onderdelen']], ['Intercom systeem', ['intercom']]] },
  motorlaarzen: { kop: 'Motorlaarzen', types: [['Adventure laars', ['adventure', 'corozal']], ['Chopper laars', ['chopper']], ['Cross laars', ['crosslaars']], ['Sport laars', ['sportlaars']], ['Touring laars', ['touring']]] },
  motorschoenen: { kop: 'Motorschoenen', types: [['Sportieve motorschoen', ['sportie']], ['Urban motorschoen', ['urban', 'grit']]] },
  'accessoires-laarzen': { kop: 'Accessoires laarzen', types: [['Motorlaarzen onderdelen', ['onderdelen', 'zool']]] },
  motorbagage: { kop: 'Motorbagage', types: [['Binnentas', ['binnentas']], ['Heuptas/Beentas', ['heuptas', 'beentas']], ['Koffer', ['koffer']], ['Roltas', ['roltas']], ['Rugzak', ['rugzak']], ['Tanktas', ['tanktas']], ['Zadeltas', ['zadeltas']]] },
  'accessoires-bagage': { kop: 'Accessoires bagage', types: [['Bagagebinder', ['binder']], ['Bagagenet', ['bagagenet']]] },
  sloten: { kop: 'Sloten', types: [['Geheugenkabel', ['geheugen']], ['Grondanker', ['anker']], ['Kettingslot', ['ketting']], ['Schijfremslot', ['schijfrem']], ['Stuurslot', ['stuurslot']], ['U-Lock', ['u-lock']]] },
  onderhoudsproducten: { kop: 'Onderhoudsproducten', types: [['Onderhoud helm', ['helm']], ['Onderhoud motor', ['motor ']], ['Onderhoud motoroutfit', ['outfit']]] },
  'gps-smartphone': { kop: 'GPS / Smartphone', types: [['Accessoires GPS', ['gps']], ['Accessoires Smartphone', ['smartphone']], ['Navigatiesysteem', ['navigatie']], ['Smartphone houder', ['houder']]] },
  geschenken: { kop: 'Geschenken', types: [['Motorgadgets', ['gadget']], ['Sleutelhangers', ['sleutelhanger']]] },
  motoraccessoires: { kop: 'Motoraccessoires', types: [['Acculaders', ['acculader']], ['Allerlei', ['allerlei']], ['Elektronische accessoires', ['elektro']], ['Montage materiaal', ['montage']], ['Motorhoezen', ['hoes']], ['Nummerplaathouders', ['nummerplaat']], ['Paddockstands', ['paddock']], ['Tankpads / Stickers', ['tankpad', 'sticker']], ['Zadelkussen', ['zadelkussen']]] },
  motoronderdelen: { kop: 'Motoronderdelen', types: [['Batterijen', ['batterij']], ['Bougies', ['bougie']], ['Olie/Luchtfilters', ['filter', 'olie']], ['Remblokken', ['remblok']]] },
};

/** Merken uit het merkenoverzicht op de website. */
export const MERKEN = [
  'Airoh', 'Alpinestars', 'Belstaff', 'Forma', 'HJC', 'Macna', 'Pando', 'Racer',
  "Rev'it!", 'Rokker', 'Schuberth', 'Scorpion', 'Sena', 'Shark', 'Stadler',
];

/** Zoekt de hoofdcategorie bij een hoofd- of subcategorieslug. */
export function vindHoofdcategorie(slug: string): Hoofdcategorie | undefined {
  return HOOFDCATEGORIEEN.find(
    (h) => h.slug === slug || h.subs.some((s) => s.slug === slug)
  );
}

/** Zoekt een subcategorie op slug. */
export function vindSubcategorie(slug: string): Subcategorie | undefined {
  for (const h of HOOFDCATEGORIEEN) {
    const s = h.subs.find((x) => x.slug === slug);
    if (s) return s;
  }
  return undefined;
}

/** Controleert of een productnaam bij een artikeltype hoort (kernwoorden). */
export function pastBijType(productNaam: string, subSlug: string, typeNaam: string): boolean {
  const types = ARTIKELTYPES[subSlug];
  if (!types) return true;
  const optie = types.types.find(([naam]) => naam === typeNaam);
  if (!optie) return true;
  const naam = productNaam.toLowerCase();
  return optie[1].some((kw) => naam.includes(kw));
}
