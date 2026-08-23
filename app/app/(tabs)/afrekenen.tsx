import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCardData } from '@/components/product-card';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { useGebruiker } from '@/lib/auth';
import { BEVESTIGINGSMAIL, plaatsBestelling } from '@/lib/bestellingen';
import { prijsKort } from '@/lib/format';
import { fetchWebflowProducts } from '@/lib/webflow-products';
import {
  berekenTotalen,
  leegMand,
  mandSleutel,
  useMandStaat,
} from '@/lib/winkelmand';

/**
 * Afrekenen — de controlestap tussen winkelmand en bestelling, zoals de
 * checkout op de website. De klant kijkt hier alles nog eens na: de artikelen,
 * de eigen gegevens, de levermanier en de betaalmethode. Pas daarna wordt de
 * bestelling geplaatst. Betalen hoeft (net als op de website) niet echt te
 * werken: de keuze is een demo-stap.
 */

type Regel = {
  sleutel: string;
  product: ProductCardData;
  maat?: string;
  aantal: number;
};

const LEVERINGEN = [
  { id: 'verzenden', titel: 'Thuislevering', uitleg: 'Binnen 2 tot 5 werkdagen bij je thuis' },
  { id: 'afhalen', titel: 'Afhalen in de winkel', uitleg: 'Gratis — Singel 4C, 2550 Kontich' },
] as const;

const BETAALMETHODES = [
  { id: 'bancontact', titel: 'Bancontact' },
  { id: 'kaart', titel: 'Visa / Mastercard' },
  { id: 'paypal', titel: 'PayPal' },
] as const;

export default function AfrekenenScherm() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items } = useMandStaat();
  const gebruiker = useGebruiker();

  const [producten, setProducten] = useState<ProductCardData[]>([]);
  const [laden, setLaden] = useState(true);
  const [levering, setLevering] = useState<(typeof LEVERINGEN)[number]['id']>('verzenden');
  const [betaal, setBetaal] = useState<(typeof BETAALMETHODES)[number]['id']>('bancontact');

  useEffect(() => {
    fetchWebflowProducts()
      .then((lijst) => {
        setProducten(lijst.map((i) => i.card));
        setLaden(false);
      })
      .catch(() => setLaden(false));
  }, []);

  const regels = useMemo<Regel[]>(
    () =>
      items
        .map((item) => {
          const product = producten.find((p) => p.id === item.productId);
          return product && typeof product.priceEuro === 'number'
            ? { sleutel: mandSleutel(item), product, maat: item.maat, aantal: item.aantal }
            : null;
        })
        .filter(Boolean) as Regel[],
    [items, producten]
  );

  const subtotaal = regels.reduce((som, r) => som + (r.product.priceEuro ?? 0) * r.aantal, 0);
  const totalen = berekenTotalen(subtotaal);
  /* Bij afhalen in de winkel vervallen de verzendkosten. */
  const verzending = levering === 'afhalen' ? 0 : totalen.verzending;
  const totaal = subtotaal - totalen.korting + verzending;

  const naam = gebruiker
    ? [gebruiker.voornaam, gebruiker.tussenvoegsel, gebruiker.achternaam].filter(Boolean).join(' ')
    : null;
  const adres = gebruiker?.straat
    ? `${gebruiker.straat} ${gebruiker.huisnummer ?? ''}${gebruiker.bus ? ` bus ${gebruiker.bus}` : ''}\n${gebruiker.postcode ?? ''} ${gebruiker.plaats ?? ''}\n${gebruiker.land}`
    : null;

  function plaatsen() {
    if (!regels.length) return;
    const bestelling = plaatsBestelling({
      regels: regels.map((r) => ({
        productId: r.product.id,
        naam: r.product.name,
        merk: r.product.merk,
        maat: r.maat,
        aantal: r.aantal,
        stukPrijs: r.product.priceEuro ?? 0,
        imageUrl: r.product.imageUrl,
      })),
      subtotaal,
      korting: totalen.korting,
      verzending,
      totaal,
    });
    leegMand();
    router.push(`/bestelling/${bestelling.nummer}`);
  }

  return (
    <View style={styles.scherm}>
      {/* Kop */}
      <View style={[styles.kop, { paddingTop: insets.top + 6 }]}>
        <Pressable style={styles.rondeKnop} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={EkoColors.primaryDark} />
        </Pressable>
        <View style={styles.kopMidden}>
          <Text style={styles.kopTitel}>AFREKENEN</Text>
          <Text style={styles.kopSub}>Kijk alles nog even na</Text>
        </View>
        <View style={styles.rondeKnopRuimte} />
      </View>

      {laden ? (
        <View style={styles.midden}>
          <ActivityIndicator size="large" color={EkoColors.primary} />
        </View>
      ) : regels.length === 0 ? (
        <View style={styles.midden}>
          <Ionicons name="bag-outline" size={40} color={EkoColors.darkGray} />
          <Text style={styles.leegTekst}>Je winkelmand is leeg.</Text>
          <Pressable style={styles.plaatsKnop} onPress={() => router.push('/explore')}>
            <Text style={styles.plaatsTekst}>Verder winkelen</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          {/* Artikelen */}
          <Text style={styles.sectieKop}>Jouw artikelen</Text>
          <View style={styles.kaart}>
            {regels.map((r, i) => (
              <View key={r.sleutel} style={[styles.artikelRij, i > 0 && styles.artikelRand]}>
                <View style={styles.fotoVlak}>
                  {r.product.imageUrl ? (
                    <Image
                      source={{ uri: r.product.imageUrl }}
                      style={styles.foto}
                      contentFit="contain"
                    />
                  ) : (
                    <Ionicons name="image-outline" size={20} color={EkoColors.darkGray} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  {!!r.product.merk && <Text style={styles.artikelMerk}>{r.product.merk}</Text>}
                  <Text style={styles.artikelNaam} numberOfLines={2}>
                    {r.product.name}
                  </Text>
                  <Text style={styles.artikelDetail}>
                    {r.maat ? `Maat ${r.maat} · ` : ''}
                    {r.aantal} {r.aantal === 1 ? 'stuk' : 'stuks'}
                  </Text>
                </View>
                <Text style={styles.artikelPrijs}>
                  {prijsKort((r.product.priceEuro ?? 0) * r.aantal)}
                </Text>
              </View>
            ))}
            <Pressable style={styles.wijzigRij} onPress={() => router.push('/winkelmand')}>
              <Text style={styles.wijzigTekst}>Winkelmand aanpassen</Text>
              <Ionicons name="chevron-forward" size={16} color={EkoColors.primary} />
            </Pressable>
          </View>

          {/* Gegevens */}
          <Text style={styles.sectieKop}>Jouw gegevens</Text>
          <View style={styles.kaart}>
            {gebruiker ? (
              <View>
                <Text style={styles.gegevensNaam}>{naam}</Text>
                <Text style={styles.gegevensRegel}>{gebruiker.email}</Text>
                {!!gebruiker.telefoon && (
                  <Text style={styles.gegevensRegel}>{gebruiker.telefoon}</Text>
                )}
                {adres ? (
                  <Text style={[styles.gegevensRegel, { marginTop: 8 }]}>{adres}</Text>
                ) : (
                  <Text style={[styles.gegevensRegel, { marginTop: 8 }]}>
                    Nog geen bezorgadres ingevuld.
                  </Text>
                )}
                <Pressable
                  style={styles.wijzigRij}
                  onPress={() => router.push('/account/gegevens')}>
                  <Text style={styles.wijzigTekst}>Gegevens wijzigen</Text>
                  <Ionicons name="chevron-forward" size={16} color={EkoColors.primary} />
                </Pressable>
              </View>
            ) : (
              <View>
                <Text style={styles.gegevensRegel}>
                  Je bent niet ingelogd. De bevestiging sturen we naar {BEVESTIGINGSMAIL}.
                </Text>
                <Pressable style={styles.wijzigRij} onPress={() => router.push('/inloggen')}>
                  <Text style={styles.wijzigTekst}>Inloggen voor je eigen gegevens</Text>
                  <Ionicons name="chevron-forward" size={16} color={EkoColors.primary} />
                </Pressable>
              </View>
            )}
          </View>

          {/* Levering */}
          <Text style={styles.sectieKop}>Levering</Text>
          <View style={styles.kaart}>
            {LEVERINGEN.map((optie, i) => (
              <Pressable
                key={optie.id}
                style={[styles.keuzeRij, i > 0 && styles.artikelRand]}
                onPress={() => setLevering(optie.id)}>
                <View style={[styles.rondje, levering === optie.id && styles.rondjeAan]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.keuzeTitel}>{optie.titel}</Text>
                  <Text style={styles.keuzeUitleg}>
                    {optie.id === 'verzenden' && verzending === 0
                      ? 'Gratis vanaf € 40 — binnen 2 tot 5 werkdagen'
                      : optie.uitleg}
                  </Text>
                </View>
                {optie.id === 'verzenden' && (
                  <Text style={styles.keuzePrijs}>
                    {totalen.verzending === 0 ? 'Gratis' : prijsKort(totalen.verzending)}
                  </Text>
                )}
                {optie.id === 'afhalen' && <Text style={styles.keuzePrijs}>Gratis</Text>}
              </Pressable>
            ))}
          </View>

          {/* Betaalmethode (demo) */}
          <Text style={styles.sectieKop}>Betaalmethode</Text>
          <View style={styles.kaart}>
            {BETAALMETHODES.map((optie, i) => (
              <Pressable
                key={optie.id}
                style={[styles.keuzeRij, i > 0 && styles.artikelRand]}
                onPress={() => setBetaal(optie.id)}>
                <View style={[styles.rondje, betaal === optie.id && styles.rondjeAan]} />
                <Text style={[styles.keuzeTitel, { flex: 1 }]}>{optie.titel}</Text>
              </Pressable>
            ))}
            <Text style={styles.demoTekst}>
              Dit is een demo: er wordt niets echt betaald of afgeschreven.
            </Text>
          </View>

          {/* Overzicht */}
          <Text style={styles.sectieKop}>Overzicht</Text>
          <View style={styles.kaart}>
            <View style={styles.overzichtRij}>
              <Text style={styles.overzichtLabel}>Subtotaal</Text>
              <Text style={styles.overzichtWaarde}>{prijsKort(subtotaal)}</Text>
            </View>
            {totalen.korting > 0 && (
              <View style={styles.overzichtRij}>
                <Text style={styles.overzichtLabel}>Korting</Text>
                <Text style={[styles.overzichtWaarde, { color: EkoColors.primary }]}>
                  − {prijsKort(totalen.korting)}
                </Text>
              </View>
            )}
            <View style={styles.overzichtRij}>
              <Text style={styles.overzichtLabel}>Verzending</Text>
              <Text style={styles.overzichtWaarde}>
                {verzending === 0 ? 'Gratis' : prijsKort(verzending)}
              </Text>
            </View>
            <View style={[styles.overzichtRij, styles.totaalRij]}>
              <Text style={styles.totaalLabel}>Totaal</Text>
              <Text style={styles.totaalWaarde}>{prijsKort(totaal)}</Text>
            </View>

            <Pressable style={styles.plaatsKnop} onPress={plaatsen}>
              <Text style={styles.plaatsTekst}>Bestelling plaatsen</Text>
            </Pressable>
            <Text style={styles.voorwaardenTekst}>
              Door te bestellen ga je akkoord met onze algemene voorwaarden.
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scherm: {
    flex: 1,
    backgroundColor: EkoColors.primaryLight,
  },
  midden: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  kop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: EkoColors.primaryLight,
  },
  rondeKnop: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: EkoColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: EkoColors.primaryDark,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  rondeKnopRuimte: { width: 42 },
  kopMidden: { flex: 1, alignItems: 'center' },
  kopTitel: {
    fontFamily: EkoFonts.headingMedium,
    fontSize: 17,
    letterSpacing: 0.5,
    color: EkoColors.primaryDark,
  },
  kopSub: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 12,
    color: EkoColors.paragraphGray,
    marginTop: 1,
  },
  sectieKop: {
    fontFamily: EkoFonts.headingMedium,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: EkoColors.primaryDark,
    marginTop: 18,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  kaart: {
    backgroundColor: EkoColors.white,
    borderRadius: 16,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  artikelRij: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  artikelRand: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: EkoColors.lightSteelBlue,
  },
  fotoVlak: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F4F4F2',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  foto: { width: '100%', height: '100%' },
  artikelMerk: {
    fontFamily: EkoFonts.headingMedium,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: EkoColors.primaryDark,
  },
  artikelNaam: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    color: EkoColors.primaryDark,
  },
  artikelDetail: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 12,
    color: EkoColors.paragraphGray,
    marginTop: 2,
  },
  artikelPrijs: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 14,
    color: EkoColors.primaryDark,
  },
  wijzigRij: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: EkoColors.lightSteelBlue,
  },
  wijzigTekst: {
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 14,
    color: EkoColors.primary,
  },
  gegevensNaam: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 15,
    color: EkoColors.primaryDark,
    marginTop: 8,
  },
  gegevensRegel: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    lineHeight: 21,
    color: EkoColors.paragraphGray,
    marginTop: 2,
  },
  keuzeRij: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
  },
  rondje: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: EkoColors.darkGray,
  },
  rondjeAan: {
    borderWidth: 6,
    borderColor: EkoColors.primary,
  },
  keuzeTitel: {
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 15,
    color: EkoColors.primaryDark,
  },
  keuzeUitleg: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 12,
    color: EkoColors.paragraphGray,
    marginTop: 1,
  },
  keuzePrijs: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 13,
    color: EkoColors.primaryDark,
  },
  demoTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 12,
    color: EkoColors.darkGray,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: EkoColors.lightSteelBlue,
  },
  overzichtRij: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },
  overzichtLabel: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    color: EkoColors.paragraphGray,
  },
  overzichtWaarde: {
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 14,
    color: EkoColors.primaryDark,
  },
  totaalRij: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: EkoColors.lightSteelBlue,
    marginTop: 4,
    paddingTop: 12,
  },
  totaalLabel: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 16,
    color: EkoColors.primaryDark,
  },
  totaalWaarde: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 16,
    color: EkoColors.primaryDark,
  },
  plaatsKnop: {
    backgroundColor: EkoColors.primary,
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 12,
  },
  plaatsTekst: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 15,
    color: EkoColors.white,
  },
  voorwaardenTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 12,
    color: EkoColors.darkGray,
    textAlign: 'center',
    paddingVertical: 10,
  },
  leegTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.paragraphGray,
  },
});
