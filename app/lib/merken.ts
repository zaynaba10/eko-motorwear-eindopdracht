/**
 * Merken van EKO Motorwear met hun logo. Dezelfde PNG's als het
 * merkenoverzicht op de website, zodat app en site hetzelfde tonen.
 */

const CDN = 'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def';

export type Merk = {
  /** Naam zoals getoond en gebruikt als zoekterm. */
  naam: string;
  /** Logo (PNG) uit de Webflow-assets van de site. */
  logo: string;
};

export const MERKEN_MET_LOGO: Merk[] = [
  { naam: 'Airoh', logo: `${CDN}/6a85fe6af9e49c7c17579c63_merk-airoh.png` },
  { naam: 'Alpinestars', logo: `${CDN}/6a85fe6ac1165d6915fbb278_merk-alpinestars.png` },
  { naam: 'Belstaff', logo: `${CDN}/6a85fe6a3e27d4e200a564b1_merk-belstaff.png` },
  { naam: 'Bering', logo: `${CDN}/6a85fe6afd4f29b2cec28dbe_merk-bering.png` },
  { naam: 'Brembo', logo: `${CDN}/6a85fe6afd4f29b2cec28dd4_merk-brembo.png` },
  { naam: 'Büse', logo: `${CDN}/6a85fe6af6e034d5f90a48ae_merk-bu-se.png` },
  { naam: 'Cardo', logo: `${CDN}/6a85fe6acd088c9c4b7b4da1_merk-cardo.png` },
  { naam: 'Chigee', logo: `${CDN}/6a85fe6af5b6c007f1d80981_merk-chigee.png` },
  { naam: 'DANE', logo: `${CDN}/6a85fe6b8f47be27b6c3f0dd_merk-dane.png` },
  { naam: 'Daytona', logo: `${CDN}/6a85fe6b8f47be27b6c3f143_merk-daytona.png` },
  { naam: 'Falco', logo: `${CDN}/6a85fe6bfd4f29b2cec28e0c_merk-falco.png` },
  { naam: 'Forma', logo: `${CDN}/6a85fe6bf5b6c007f1d809c5_merk-forma.png` },
  { naam: 'Gaerne', logo: `${CDN}/6a85fe6c3e27d4e200a56635_merk-gaerne.png` },
  { naam: 'G&F', logo: `${CDN}/6a85fe6ccd088c9c4b7b4de7_merk-genf.png` },
  { naam: 'Helite', logo: `${CDN}/6a85fe6ccd088c9c4b7b4dfd_merk-helite.png` },
  { naam: 'Hepco&Becker', logo: `${CDN}/6a85fe6c439a7d64abe4b580_merk-hepcoenbecker.png` },
  { naam: 'Hiflo', logo: `${CDN}/6a85fe6c3e27d4e200a56694_merk-hiflo.png` },
  { naam: 'HJC', logo: `${CDN}/6a85fe6df5b01fb4e9aeda73_merk-hjc.png` },
  { naam: 'iPhone', logo: `${CDN}/6a85fe6d8f47be27b6c3f2b4_merk-iphone.png` },
  { naam: 'Ixon', logo: `${CDN}/6a85fe6df5b6c007f1d80a46_merk-ixon.png` },
  { naam: 'John Doe', logo: `${CDN}/6a85fe6e823e4c89901e827a_merk-johndoe.png` },
  { naam: 'Kovix', logo: `${CDN}/6a85fe6e3e27d4e200a567de_merk-kovix.png` },
  { naam: 'Kriega', logo: `${CDN}/6a85fe6e3552b212af13228b_merk-kriega.png` },
  { naam: 'Macna', logo: `${CDN}/6a85fe6f3af28b36a0c3363d_merk-macna.png` },
  { naam: 'MoniMoto', logo: `${CDN}/6a85fe9353f8fa536be25044_merk-monimoto.png` },
  { naam: 'Motul', logo: `${CDN}/6a85fe9399e6027a6185e81a_merk-motul.png` },
  { naam: 'Muc-Off', logo: `${CDN}/6a85fe94f9e49c7c1757afe7_merk-muc-off.png` },
  { naam: 'NGK', logo: `${CDN}/6a85fe9499e6027a6185e891_merk-ngk.png` },
  { naam: 'Noco', logo: `${CDN}/6a85fe953af28b36a0c34fc8_merk-noco.png` },
  { naam: 'Nolan', logo: `${CDN}/6a85fe963af28b36a0c35081_merk-nolan.png` },
  { naam: 'Ogio', logo: `${CDN}/6a85fe9699e6027a6185e946_merk-ogio.png` },
  { naam: 'Pando', logo: `${CDN}/6a85fe96974e321c477f3993_merk-pando.png` },
  { naam: 'Puig', logo: `${CDN}/6a85fe983af28b36a0c3519c_merk-puig.png` },
  { naam: 'Quad Lock', logo: `${CDN}/6a85fe98c78ef633bcc8e83b_merk-quad-lock.png` },
  { naam: "Rev'it", logo: `${CDN}/6a85fe981b8c7b61c049b685_merk-revit.png` },
  { naam: 'Rokker', logo: `${CDN}/6a85fe9899e6027a6185eae6_merk-rokker.png` },
  { naam: 'Rukka', logo: `${CDN}/6a85fe99974e321c477f3a43_merk-rukka.png` },
  { naam: 'Schuberth', logo: `${CDN}/6a85fe9a3af28b36a0c352d6_merk-schuberth.png` },
  { naam: 'Scorpion', logo: `${CDN}/6a85fe9abae04700a8e2fc59_merk-scorpion.png` },
  { naam: 'Segura', logo: `${CDN}/6a85fe9b53f8fa536be255dc_merk-segura.png` },
  { naam: 'Sena', logo: `${CDN}/6a85fe9b1b8c7b61c049b7f9_merk-sena.png` },
  { naam: 'Shark', logo: `${CDN}/6a85fe9b618dda7ef1fa174e_merk-shark.png` },
  { naam: 'SP Connect', logo: `${CDN}/6a85fe9cf5b01fb4e9aef93b_merk-sp-connect.png` },
  { naam: 'Stadler', logo: `${CDN}/6a85fe9cf5b01fb4e9aef98d_merk-stadler.png` },
  { naam: 'Styl Martin', logo: `${CDN}/6a85fe9cf5b01fb4e9aef9d6_merk-styl-martin.png` },
  { naam: 'SW Motech', logo: `${CDN}/6a85fe9cb0902db621026c2f_merk-sw-motech.png` },
  { naam: 'TomTom', logo: `${CDN}/6a85fe9df5b01fb4e9aefa3e_merk-tomtom.png` },
  { naam: 'XPD', logo: `${CDN}/6a85fe9d92ec805c7a44a9df_merk-xpd.png` },
];

/** Logo van één merk opzoeken (hoofdletterongevoelig). */
export function logoVanMerk(naam?: string): string | undefined {
  if (!naam) return undefined;
  const zoek = naam.toLowerCase().replace(/[^a-z0-9]/g, '');
  return MERKEN_MET_LOGO.find(
    (m) => m.naam.toLowerCase().replace(/[^a-z0-9]/g, '') === zoek
  )?.logo;
}
