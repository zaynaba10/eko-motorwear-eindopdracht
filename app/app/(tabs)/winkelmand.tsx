import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
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
import { plaatsBestelling } from '@/lib/bestellingen';
import { prijsKort } from '@/lib/format';
import { staatOpVerlanglijst, useVerlanglijst, wisselVerlanglijst } from '@/lib/verlanglijst';
import { fetchWebflowProducts } from '@/lib/webflow-products';
import {
  berekenTotalen,
  GRATIS_VERZENDING_VANAF,
  leegMand,
  mandSleutel,
  MAX_PER_ARTIKEL,
  useMandStaat,
  verwijderUitMand,
  wijzigAantal,
  wisVoucher,
} from '@/lib/winkelmand';

/**
 * Winkelmand in warenhuisstijl: artikelen gegroepeerd per levermanier, per
 * regel een teller met − en +, een hartje om het artikel te bewaren, daaronder
 * de blokken Voucher, Cadeaukaart en Cadeauverpakking en het betaaloverzicht.
 */

type Regel = {
  sleutel: string;
  product: ProductCardData;
  maat?: string;
  aantal: number;
};

export default function WinkelmandScherm() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, voucher } = useMandStaat();
  useVerlanglijst(); // hartjes op de regels lezen mee met de verlanglijst

  const [producten, setProducten] = useState<ProductCardData[]>([]);
  const [laden, setLaden] = useState(true);
  const [melding, setMelding] = useState<string | null>(null);
  const meldingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchWebflowProducts()
      .then((lijst) => {
        setProducten(lijst.map((i) => i.card));
        setLaden(false);
      })
      .catch(() => setLaden(false));
    return () => {
      if (meldingTimer.current) clearTimeout(meldingTimer.current);
    };
  }, []);

  const regels = useMemo<Regel[]>(
    () =>
      items
        .map((item) => {
          const product = producten.find((p) => p.id === item.productId);
          return product
            ? { sleutel: mandSleutel(item), product, maat: item.maat, aantal: item.aantal }
            : null;
        })
        .filter(Boolean) as Regel[],
    [items, producten]
  );

  /* Bijenkorf groepeert per levermanier; hier: online verzonden of enkel in de winkel. */
  const online = regels.filter((r) => typeof r.product.priceEuro === 'number');
  const winkel = regels.filter((r) => typeof r.product.priceEuro !== 'number');

  const subtotaal = online.reduce((som, r) => som + (r.product.priceEuro ?? 0) * r.aantal, 0);
  const { korting, verzending, totaal } = berekenTotalen(subtotaal);

  function toon(tekst: string) {
    setMelding(tekst);
    if (meldingTimer.current) clearTimeout(meldingTimer.current);
    meldingTimer.current = setTimeout(() => setMelding(null), 2600);
  }

  function bestellen() {
    if (online.length === 0) {
      toon('Deze artikelen zijn alleen in de winkel verkrijgbaar');
      return;
    }
    const bestelling = plaatsBestelling({
      regels: online.map((r) => ({
        productId: r.product.id,
        naam: r.product.name,
        merk: r.product.merk,
        maat: r.maat,
        aantal: r.aantal,
        stukPrijs: r.product.priceEuro ?? 0,
        imageUrl: r.product.imageUrl,
      })),
      subtotaal,
      korting,
      verzending,
      totaal,
    });
    leegMand();
    router.push(`/bestelling/${bestelling.nummer}`);
  }

  if (laden) {
    return (
      <View style={styles.scherm}>
        <Kop insetTop={insets.top} />
        <View style={styles.midden}>
          <ActivityIndicator size="large" color={EkoColors.primary} />
        </View>
      </View>
    );
  }

  if (regels.length === 0) {
    return (
      <View style={styles.scherm}>
        <Kop insetTop={insets.top} />
        <View style={styles.midden}>
          <Ionicons name="bag-outline" size={40} color={EkoColors.darkGray} />
          <Text style={styles.leegTitel}>Je winkelmand is leeg</Text>
          <Text style={styles.leegTekst}>
            Leg een artikel in je mand vanuit de winkel of je verlanglijst.
          </Text>
          <Pressable style={styles.leegKnop} onPress={() => router.push('/explore')}>
            <Text style={styles.leegKnopTekst}>Verder winkelen</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.scherm}>
      <Kop insetTop={insets.top} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        {/* Bezorgmelding bovenaan */}
        <View style={styles.infobalk}>
          <Ionicons name="information-circle-outline" size={20} color={EkoColors.primary} />
          <Text style={styles.infobalkTekst}>
            Alle bestellingen vertrekken uit onze winkel in Kontich. Gratis verzending vanaf{' '}
            {prijsKort(GRATIS_VERZENDING_VANAF)}
          </Text>
        </View>

        {online.length > 0 && (
          <Groep
            titel="Gratis bezorging, binnen 1-5 werkdagen geleverd"
            aantal={online.reduce((s, r) => s + r.aantal, 0)}>
            {online.map((r) => (
              <MandRegel key={r.sleutel} regel={r} router={router} />
            ))}
          </Groep>
        )}

        {winkel.length > 0 && (
          <Groep
            titel="Enkel af te halen in onze winkel in Kontich"
            aantal={winkel.reduce((s, r) => s + r.aantal, 0)}>
            {winkel.map((r) => (
              <MandRegel key={r.sleutel} regel={r} router={router} />
            ))}
          </Groep>
        )}

        {/* Voucher / cadeaukaart / cadeauverpakking */}
        <View style={styles.blokken}>
          <OptieRij
            icoon="pricetag-outline"
            titel="Voucher"
            tekst={voucher ? `Code ${voucher.code} — ${voucher.procent}% korting` : 'Voeg een kortingscode toe'}
            onPress={() => router.push('/voucher')}
          />
          <OptieRij
            icoon="card-outline"
            titel="Cadeaukaart"
            tekst="Verzilver je cadeaukaart"
            onPress={() => router.push('/cadeaukaart')}
          />
          <OptieRij
            icoon="gift-outline"
            titel="Cadeauverpakking"
            tekst="Niet beschikbaar voor jouw artikelen"
            uit
          />
        </View>

        {/* Betaaloverzicht */}
        <View style={styles.overzicht}>
          <Text style={styles.overzichtKop}>Betaaloverzicht</Text>

          <View style={styles.overzichtRij}>
            <Text style={styles.overzichtLabel}>Subtotaal</Text>
            <Text style={styles.overzichtWaarde}>{prijsKort(subtotaal)}</Text>
          </View>

          {korting > 0 && (
            <View style={styles.overzichtRij}>
              <Pressable onPress={wisVoucher} hitSlop={8}>
                <Text style={[styles.overzichtLabel, styles.kortingLabel]}>
                  Korting {voucher?.code} ✕
                </Text>
              </Pressable>
              <Text style={[styles.overzichtWaarde, styles.kortingLabel]}>
                − {prijsKort(korting)}
              </Text>
            </View>
          )}

          <View style={styles.overzichtRij}>
            <Text style={styles.overzichtLabel}>Verzendkosten</Text>
            <Text style={styles.overzichtWaarde}>
              {verzending === 0 ? 'Gratis' : prijsKort(verzending)}
            </Text>
          </View>

          <View style={[styles.overzichtRij, styles.totaalRij]}>
            <Text style={styles.totaalLabel}>Totaal</Text>
            <Text style={styles.totaalWaarde}>{prijsKort(totaal)}</Text>
          </View>

          <Pressable style={styles.bestelKnop} onPress={bestellen}>
            <Text style={styles.bestelTekst}>Bestellen</Text>
          </Pressable>

          <Pressable style={styles.leegKnopKlein} onPress={leegMand}>
            <Text style={styles.leegKnopKleinTekst}>Winkelmand leegmaken</Text>
          </Pressable>
        </View>
      </ScrollView>

      {melding && (
        <View style={styles.melding}>
          <Text style={styles.meldingTekst} numberOfLines={2}>
            {melding}
          </Text>
        </View>
      )}
    </View>
  );
}

/* ------------------------------------------------------------- onderdelen -- */

function Kop({ insetTop }: { insetTop: number }) {
  return (
    <View style={[styles.kop, { paddingTop: insetTop + 8 }]}>
      <Text style={styles.kopTitel}>Winkelmand</Text>
    </View>
  );
}

function Groep({
  titel,
  aantal,
  children,
}: {
  titel: string;
  aantal: number;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.groep}>
      <Text style={styles.groepTitel}>{titel}</Text>
      <Text style={styles.groepAantal}>
        {aantal} {aantal === 1 ? 'artikel' : 'artikelen'}
      </Text>
      {children}
    </View>
  );
}

function MandRegel({
  regel,
  router,
}: {
  regel: Regel;
  router: ReturnType<typeof useRouter>;
}) {
  const { product, maat, aantal, sleutel } = regel;
  const prijs = product.priceEuro ?? 0;
  const favoriet = staatOpVerlanglijst(product.id);
  const opMax = aantal >= MAX_PER_ARTIKEL;

  return (
    <View style={styles.regel}>
      <View style={styles.regelBoven}>
        <Pressable style={styles.fotoVlak} onPress={() => router.push(`/product/${product.id}`)}>
          {product.imageUrl ? (
            <Image source={{ uri: product.imageUrl }} style={styles.foto} contentFit="cover" />
          ) : (
            <View style={[styles.foto, styles.fotoLeeg]}>
              <Ionicons name="image-outline" size={26} color={EkoColors.darkGray} />
            </View>
          )}
        </Pressable>

        <View style={styles.gegevens}>
          <View style={styles.titelRij}>
            <Text style={styles.merk} numberOfLines={1}>
              {product.merk || product.name}
            </Text>
            <Pressable
              hitSlop={10}
              accessibilityLabel={`${product.name} uit winkelmand halen`}
              onPress={() => verwijderUitMand(sleutel)}>
              <Ionicons name="close" size={24} color={EkoColors.primaryDark} />
            </Pressable>
          </View>

          <Text style={styles.variant} numberOfLines={1}>
            {[product.kleur, maat].filter(Boolean).join(' • ') || product.name}
          </Text>

          {typeof product.priceEuro === 'number' ? (
            <>
              <Text style={styles.prijs}>{prijsKort(prijs * aantal)}</Text>
              {aantal > 1 && (
                <Text style={styles.perStuk}>
                  ({aantal} x {prijsKort(prijs)})
                </Text>
              )}
            </>
          ) : (
            <Text style={styles.perStuk}>Alleen in de winkel</Text>
          )}

          <View style={styles.actieRij}>
            <View style={styles.teller}>
              <Pressable
                style={styles.tellerKnop}
                accessibilityLabel="Aantal verlagen"
                onPress={() => wijzigAantal(sleutel, -1)}>
                <Ionicons
                  name="remove"
                  size={20}
                  color={aantal > 1 ? EkoColors.primaryDark : EkoColors.gray}
                />
              </Pressable>
              <Text style={styles.tellerWaarde}>{aantal}</Text>
              <Pressable
                style={styles.tellerKnop}
                accessibilityLabel="Aantal verhogen"
                onPress={() => wijzigAantal(sleutel, 1)}>
                <Ionicons
                  name="add"
                  size={20}
                  color={opMax ? EkoColors.gray : EkoColors.primaryDark}
                />
              </Pressable>
            </View>

            <Pressable
              style={styles.hartKnop}
              accessibilityLabel={`${product.name} bewaren`}
              onPress={() => wisselVerlanglijst(product.id)}>
              <Ionicons
                name={favoriet ? 'heart' : 'heart-outline'}
                size={22}
                color={favoriet ? EkoColors.primary : EkoColors.primaryDark}
              />
            </Pressable>
          </View>
        </View>
      </View>

      {opMax && (
        <View style={styles.regelWaarschuwing}>
          <Ionicons name="warning-outline" size={18} color={EkoColors.primary} />
          <Text style={styles.regelWaarschuwingTekst}>
            Je kan maximaal {MAX_PER_ARTIKEL} stuks van dit artikel bestellen
          </Text>
        </View>
      )}
    </View>
  );
}

function OptieRij({
  icoon,
  titel,
  tekst,
  onPress,
  uit,
}: {
  icoon: keyof typeof Ionicons.glyphMap;
  titel: string;
  tekst: string;
  onPress?: () => void;
  uit?: boolean;
}) {
  return (
    <Pressable style={styles.optieRij} onPress={uit ? undefined : onPress} disabled={uit}>
      <View style={styles.optieIcoon}>
        <Ionicons
          name={icoon}
          size={22}
          color={uit ? EkoColors.darkGray : EkoColors.primaryDark}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.optieTitel, uit && styles.optieUit]}>{titel}</Text>
        <Text style={[styles.optieTekst, uit && styles.optieUit]}>{tekst}</Text>
      </View>
      {!uit && <Ionicons name="chevron-forward" size={22} color={EkoColors.primaryDark} />}
    </Pressable>
  );
}

/* ----------------------------------------------------------------- styles -- */

const styles = StyleSheet.create({
  scherm: {
    flex: 1,
    backgroundColor: EkoColors.white,
  },
  kop: {
    paddingBottom: 14,
    alignItems: 'center',
    backgroundColor: EkoColors.white,
  },
  kopTitel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 22,
    letterSpacing: 0.5,
    color: EkoColors.primaryDark,
  },

  midden: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 10,
  },
  leegTitel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 20,
    color: EkoColors.primaryDark,
    marginTop: 6,
  },
  leegTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    lineHeight: 22,
    color: EkoColors.paragraphGray,
    textAlign: 'center',
  },
  leegKnop: {
    marginTop: 10,
    backgroundColor: EkoColors.primaryDark,
    borderRadius: 26,
    paddingVertical: 14,
    paddingHorizontal: 26,
  },
  leegKnopTekst: {
    fontFamily: EkoFonts.headingMedium,
    fontSize: 13,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: EkoColors.white,
  },

  infobalk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F7EFE6',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 16,
  },
  infobalkTekst: {
    flex: 1,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    color: EkoColors.primaryDark,
  },

  groep: {
    paddingHorizontal: 16,
    paddingTop: 26,
  },
  groepTitel: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 15,
    color: EkoColors.primaryDark,
  },
  groepAantal: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    color: EkoColors.paragraphGray,
    marginBottom: 18,
  },

  regel: {
    marginBottom: 26,
  },
  regelBoven: {
    flexDirection: 'row',
    gap: 16,
  },
  fotoVlak: {
    width: 118,
    backgroundColor: '#F4F4F2',
  },
  foto: {
    width: '100%',
    aspectRatio: 3 / 4,
  },
  fotoLeeg: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gegevens: {
    flex: 1,
  },
  titelRij: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  merk: {
    flex: 1,
    fontFamily: EkoFonts.headingBold,
    fontSize: 21,
    letterSpacing: 0.3,
    color: EkoColors.primaryDark,
  },
  variant: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.paragraphGray,
    marginTop: 6,
  },
  prijs: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 16,
    color: EkoColors.primaryDark,
    marginTop: 10,
  },
  perStuk: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 15,
    color: EkoColors.paragraphGray,
    marginTop: 2,
  },

  actieRij: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
    marginTop: 16,
  },
  teller: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: EkoColors.lightSteelBlue,
    paddingHorizontal: 6,
    height: 52,
  },
  tellerKnop: {
    width: 44,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tellerWaarde: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 16,
    color: EkoColors.primaryDark,
  },
  hartKnop: {
    width: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: EkoColors.lightSteelBlue,
  },

  regelWaarschuwing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F7EFE6',
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginTop: 14,
  },
  regelWaarschuwingTekst: {
    flex: 1,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    color: EkoColors.primaryDark,
  },

  blokken: {
    paddingHorizontal: 16,
    paddingTop: 6,
    gap: 12,
  },
  optieRij: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: EkoColors.lightSteelBlue,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  optieIcoon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F7F4F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optieTitel: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 16,
    color: EkoColors.primaryDark,
  },
  optieTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    color: EkoColors.paragraphGray,
    marginTop: 2,
  },
  optieUit: {
    color: EkoColors.darkGray,
  },

  overzicht: {
    marginTop: 26,
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 20,
    backgroundColor: EkoColors.lightGray,
  },
  overzichtKop: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 17,
    color: EkoColors.primaryDark,
    marginBottom: 14,
  },
  overzichtRij: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  overzichtLabel: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.primaryDark,
  },
  overzichtWaarde: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.primaryDark,
  },
  kortingLabel: {
    color: EkoColors.primary,
  },
  totaalRij: {
    marginTop: 6,
    marginBottom: 18,
  },
  totaalLabel: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 17,
    color: EkoColors.primaryDark,
  },
  totaalWaarde: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 17,
    color: EkoColors.primaryDark,
  },
  bestelKnop: {
    backgroundColor: EkoColors.primary,
    paddingVertical: 18,
    alignItems: 'center',
  },
  bestelTekst: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 16,
    color: EkoColors.white,
  },
  leegKnopKlein: {
    marginTop: 14,
    alignItems: 'center',
  },
  leegKnopKleinTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    textDecorationLine: 'underline',
    color: EkoColors.paragraphGray,
  },

  melding: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 92,
    backgroundColor: '#EDF2EE',
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 22,
    shadowColor: EkoColors.primaryDark,
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  meldingTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.primaryDark,
  },
});
