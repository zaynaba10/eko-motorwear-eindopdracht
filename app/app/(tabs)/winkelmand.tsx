import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCardData } from '@/components/product-card';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { euro } from '@/lib/format';
import { fetchWebflowProducts } from '@/lib/webflow-products';
import {
  mandSleutel,
  useWinkelmand,
  verwijderUitMand,
  wijzigAantal,
} from '@/lib/winkelmand';

/**
 * Winkelmand: per regel het product met de gekozen maat, het aantal aanpasbaar
 * met − en + (minimum 1) en het regeltotaal. Onderaan het totaalbedrag.
 * Afrekenen is bewust niet actief.
 */
export default function WinkelmandScherm() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mand = useWinkelmand();

  const [producten, setProducten] = useState<ProductCardData[]>([]);
  const [laden, setLaden] = useState(true);

  useEffect(() => {
    fetchWebflowProducts()
      .then((items) => {
        setProducten(items.map((i) => i.card));
        setLaden(false);
      })
      .catch(() => setLaden(false));
  }, []);

  const regels = useMemo(
    () =>
      mand
        .map((item) => {
          const product = producten.find((p) => p.id === item.productId);
          return product ? { ...item, product, sleutel: mandSleutel(item) } : null;
        })
        .filter(Boolean) as {
        productId: string;
        maat?: string;
        aantal: number;
        product: ProductCardData;
        sleutel: string;
      }[],
    [mand, producten]
  );

  const totaal = regels.reduce(
    (som, r) => som + (r.product.priceEuro ?? 0) * r.aantal,
    0
  );
  const aantalArtikelen = regels.reduce((som, r) => som + r.aantal, 0);

  return (
    <View style={styles.scherm}>
      <View style={[styles.kop, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.kopTitel}>Winkelmand</Text>
      </View>

      {laden ? (
        <View style={styles.midden}>
          <ActivityIndicator size="large" color={EkoColors.primary} />
        </View>
      ) : regels.length === 0 ? (
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
      ) : (
        <>
          <FlatList
            data={regels}
            keyExtractor={(r) => r.sleutel}
            contentContainerStyle={{ paddingBottom: 24 }}
            ItemSeparatorComponent={() => <View style={styles.scheiding} />}
            renderItem={({ item }) => (
              <View style={styles.rij}>
                <Pressable
                  style={styles.fotoVlak}
                  onPress={() => router.push(`/product/${item.product.id}`)}>
                  {item.product.imageUrl ? (
                    <Image
                      source={{ uri: item.product.imageUrl }}
                      style={styles.foto}
                      contentFit="cover"
                    />
                  ) : (
                    <View style={[styles.foto, styles.fotoLeeg]}>
                      <Ionicons name="image-outline" size={26} color={EkoColors.darkGray} />
                    </View>
                  )}
                </Pressable>

                <View style={styles.gegevens}>
                  <View style={styles.titelRij}>
                    <Text style={styles.merk} numberOfLines={1}>
                      {item.product.merk || item.product.name}
                    </Text>
                    <Pressable
                      hitSlop={10}
                      accessibilityLabel={`${item.product.name} uit winkelmand halen`}
                      onPress={() => verwijderUitMand(item.sleutel)}>
                      <Ionicons name="close" size={24} color={EkoColors.primaryDark} />
                    </Pressable>
                  </View>

                  <Text style={styles.naam} numberOfLines={2}>
                    {item.product.name}
                  </Text>
                  {!!item.maat && <Text style={styles.maat}>Maat {item.maat}</Text>}

                  <View style={styles.onderRij}>
                    <View style={styles.teller}>
                      <Pressable
                        style={styles.tellerKnop}
                        accessibilityLabel="Aantal verlagen"
                        onPress={() => wijzigAantal(item.sleutel, -1)}>
                        <Ionicons
                          name="remove"
                          size={18}
                          color={item.aantal > 1 ? EkoColors.primaryDark : EkoColors.darkGray}
                        />
                      </Pressable>
                      <Text style={styles.tellerWaarde}>{item.aantal}</Text>
                      <Pressable
                        style={styles.tellerKnop}
                        accessibilityLabel="Aantal verhogen"
                        onPress={() => wijzigAantal(item.sleutel, 1)}>
                        <Ionicons name="add" size={18} color={EkoColors.primaryDark} />
                      </Pressable>
                    </View>

                    <Text style={styles.regelPrijs}>
                      {euro((item.product.priceEuro ?? 0) * item.aantal)}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          />

          <View style={[styles.balk, { paddingBottom: Math.max(insets.bottom, 14) }]}>
            <View style={styles.totaalRij}>
              <Text style={styles.totaalLabel}>
                Totaal ({aantalArtikelen} {aantalArtikelen === 1 ? 'artikel' : 'artikelen'})
              </Text>
              <Text style={styles.totaalBedrag}>{euro(totaal)}</Text>
            </View>
            <Pressable style={styles.afrekenKnop} onPress={() => {}}>
              <Text style={styles.afrekenTekst}>Afrekenen</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scherm: {
    flex: 1,
    backgroundColor: EkoColors.white,
  },
  kop: {
    paddingBottom: 14,
    alignItems: 'center',
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

  scheiding: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: EkoColors.lightSteelBlue,
    marginHorizontal: 16,
    marginVertical: 20,
  },
  rij: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16,
  },
  fotoVlak: {
    width: 100,
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
    fontSize: 19,
    color: EkoColors.primaryDark,
  },
  naam: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    color: EkoColors.paragraphGray,
    marginTop: 4,
  },
  maat: {
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 14,
    color: EkoColors.primaryDark,
    marginTop: 6,
  },
  onderRij: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  teller: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: EkoColors.lightSteelBlue,
  },
  tellerKnop: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tellerWaarde: {
    minWidth: 26,
    textAlign: 'center',
    fontFamily: EkoFonts.bodyBold,
    fontSize: 15,
    color: EkoColors.primaryDark,
  },
  regelPrijs: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 16,
    color: EkoColors.primaryDark,
  },

  balk: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: EkoColors.lightSteelBlue,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: EkoColors.white,
  },
  totaalRij: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  totaalLabel: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.paragraphGray,
  },
  totaalBedrag: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 22,
    color: EkoColors.primaryDark,
  },
  afrekenKnop: {
    backgroundColor: EkoColors.primaryDark,
    borderRadius: 28,
    paddingVertical: 17,
    alignItems: 'center',
  },
  afrekenTekst: {
    fontFamily: EkoFonts.headingMedium,
    fontSize: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: EkoColors.white,
  },
});
