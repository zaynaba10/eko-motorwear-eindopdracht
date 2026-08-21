import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCardData } from '@/components/product-card';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { useGebruiker } from '@/lib/auth';
import { prijsKort } from '@/lib/format';
import { matenVoorProduct } from '@/lib/maten';
import {
  useVerlanglijst,
  VERLANGLIJST_LIMIET,
  verwijderVanVerlanglijst,
  zetVerlanglijstMaat,
} from '@/lib/verlanglijst';
import { fetchCategorieIds } from '@/lib/webflow-categories';
import { fetchWebflowProducts } from '@/lib/webflow-products';
import { vindHoofdcategorie } from '@/lib/winkel-boom';
import { voegToeAanMand } from '@/lib/winkelmand';

/**
 * Verlanglijst in warenhuisstijl: per artikel een foto, merk, kleur en prijs,
 * met een maatkeuze via een onderschuifpaneel en een knop om het meteen in de
 * winkelmand te leggen. Artikelen zonder onlineprijs tonen "uitverkocht" en
 * krijgen een knop om een bericht te vragen zodra ze weer binnen zijn.
 */

type Regel = {
  product: ProductCardData;
  maat?: string;
  maten?: string[];
  uitverkocht: boolean;
};

export default function VerlanglijstScherm() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const lijst = useVerlanglijst();
  const gebruiker = useGebruiker();

  const [producten, setProducten] = useState<ProductCardData[]>([]);
  const [catIds, setCatIds] = useState<Record<string, string>>({});
  const [laden, setLaden] = useState(true);

  const [maatVoor, setMaatVoor] = useState<Regel | null>(null);
  const [melding, setMelding] = useState<string | null>(null);
  const meldingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    Promise.all([fetchWebflowProducts(), fetchCategorieIds()])
      .then(([items, ids]) => {
        setProducten(items.map((i) => i.card));
        setCatIds(ids);
        setLaden(false);
      })
      .catch(() => setLaden(false));
    return () => {
      if (meldingTimer.current) clearTimeout(meldingTimer.current);
    };
  }, []);

  const regels = useMemo<Regel[]>(() => {
    return lijst
      .map((item) => {
        const product = producten.find((p) => p.id === item.productId);
        if (!product) return null;
        const ids = new Set(product.categorieIds || []);
        const slug = Object.keys(catIds).find((s) => ids.has(catIds[s]));
        const hoofd = slug ? vindHoofdcategorie(slug) : undefined;
        return {
          product,
          maat: item.maat,
          maten: matenVoorProduct(product, hoofd?.slug),
          uitverkocht: typeof product.priceEuro !== 'number',
        };
      })
      .filter(Boolean) as Regel[];
  }, [lijst, producten, catIds]);

  function toon(tekst: string) {
    setMelding(tekst);
    if (meldingTimer.current) clearTimeout(meldingTimer.current);
    meldingTimer.current = setTimeout(() => setMelding(null), 2600);
  }

  function inMand(regel: Regel) {
    if (regel.maten && !regel.maat) {
      setMaatVoor(regel);
      return;
    }
    voegToeAanMand(regel.product.id, regel.maat);
    toon('Artikel toegevoegd aan winkelmand');
  }

  const bijnaVol = regels.length >= VERLANGLIJST_LIMIET - 10;

  return (
    <View style={styles.scherm}>
      <View style={[styles.kop, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.kopTitel}>Verlanglijst</Text>
      </View>

      {laden ? (
        <View style={styles.midden}>
          <ActivityIndicator size="large" color={EkoColors.primary} />
        </View>
      ) : regels.length === 0 ? (
        <View style={styles.midden}>
          <Ionicons name="heart-outline" size={40} color={EkoColors.darkGray} />
          <Text style={styles.leegTitel}>
            {gebruiker ? 'Je verlanglijst is leeg' : 'Bewaar je favorieten'}
          </Text>
          <Text style={styles.leegTekst}>
            {gebruiker
              ? 'Tik op het hartje bij een product om het hier te bewaren. Zo vind je het later makkelijk terug.'
              : 'Log in of maak een account aan om je favorieten te bewaren en terug te vinden.'}
          </Text>
          <Pressable
            style={styles.leegKnop}
            onPress={() => router.push(gebruiker ? '/explore' : '/inloggen')}>
            <Text style={styles.leegKnopTekst}>
              {gebruiker ? 'Verder winkelen' : 'Inloggen of registreren'}
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={regels}
          keyExtractor={(r) => r.product.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          ItemSeparatorComponent={() => <View style={styles.scheiding} />}
          ListHeaderComponent={
            bijnaVol ? (
              <View style={styles.waarschuwing}>
                <Ionicons name="warning-outline" size={20} color={EkoColors.primary} />
                <Text style={styles.waarschuwingTekst}>
                  Je nadert het limiet van je verlanglijst ({regels.length}/{VERLANGLIJST_LIMIET}).
                </Text>
              </View>
            ) : null
          }
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
                {item.uitverkocht && (
                  <View style={styles.uitverkochtLabel}>
                    <Text style={styles.uitverkochtTekst}>UITVERKOCHT</Text>
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
                    accessibilityLabel={`${item.product.name} van verlanglijst halen`}
                    onPress={() => verwijderVanVerlanglijst(item.product.id)}>
                    <Ionicons name="close" size={24} color={EkoColors.primaryDark} />
                  </Pressable>
                </View>

                <Text style={styles.variant} numberOfLines={1}>
                  {[item.product.kleur, item.product.materiaal].filter(Boolean).join(' • ') ||
                    item.product.name}
                </Text>

                {typeof item.product.priceEuro === 'number' ? (
                  <>
                    <Text style={styles.prijs}>{prijsKort(item.product.priceEuro)}</Text>
                    {typeof item.product.vergelijkPrijsEuro === 'number' &&
                      item.product.vergelijkPrijsEuro > item.product.priceEuro && (
                        <Text style={styles.advies}>
                          Adviesprijs {prijsKort(item.product.vergelijkPrijsEuro)}
                        </Text>
                      )}
                  </>
                ) : (
                  <Text style={styles.advies}>Alleen in de winkel</Text>
                )}

                <View style={styles.actieRij}>
                  <Pressable
                    style={styles.maatVeld}
                    onPress={() => item.maten && setMaatVoor(item)}>
                    <Text style={item.maat ? styles.maatWaarde : styles.maatPlaceholder}>
                      {item.maat ?? (item.maten ? 'Selecteer maat' : 'Eén maat')}
                    </Text>
                    {item.maten && (
                      <Ionicons name="chevron-down" size={18} color={EkoColors.primaryDark} />
                    )}
                  </Pressable>

                  {item.uitverkocht ? (
                    <Pressable
                      style={styles.knopLicht}
                      accessibilityLabel="Bericht bij terugkomst"
                      onPress={() => toon('We brengen je op de hoogte zodra dit artikel er weer is')}>
                      <Ionicons name="mail-outline" size={22} color={EkoColors.primaryDark} />
                    </Pressable>
                  ) : (
                    <Pressable
                      style={styles.knopDonker}
                      accessibilityLabel="In winkelmand"
                      onPress={() => inMand(item)}>
                      <Ionicons name="bag-outline" size={22} color={EkoColors.white} />
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          )}
        />
      )}

      {/* Melding boven de tabbalk */}
      {melding && (
        <Pressable style={styles.melding} onPress={() => router.push('/winkelmand')}>
          <Text style={styles.meldingTekst} numberOfLines={1}>
            {melding}
          </Text>
          <Ionicons name="arrow-forward" size={20} color={EkoColors.primaryDark} />
        </Pressable>
      )}

      {/* Onderschuifpaneel: maat kiezen */}
      <Modal
        visible={!!maatVoor}
        transparent
        animationType="fade"
        onRequestClose={() => setMaatVoor(null)}>
        <Pressable style={styles.paneelAchter} onPress={() => setMaatVoor(null)} />
        <View style={[styles.paneel, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <View style={styles.paneelGreep} />
          <View style={styles.paneelKopRij}>
            <Text style={styles.paneelKop}>Maat</Text>
            <Pressable hitSlop={8} onPress={() => setMaatVoor(null)}>
              <Ionicons name="close" size={24} color={EkoColors.primaryDark} />
            </Pressable>
          </View>
          {(maatVoor?.maten ?? []).map((m) => (
            <Pressable
              key={m}
              style={styles.paneelRij}
              onPress={() => {
                if (maatVoor) zetVerlanglijstMaat(maatVoor.product.id, m);
                setMaatVoor(null);
              }}>
              <Text
                style={[styles.paneelRijTekst, maatVoor?.maat === m && styles.paneelRijTekstAan]}>
                {m}
                {maatVoor?.uitverkocht ? ' (online uitverkocht)' : ''}
              </Text>
              {maatVoor?.maat === m && (
                <Ionicons name="checkmark" size={20} color={EkoColors.primary} />
              )}
            </Pressable>
          ))}
        </View>
      </Modal>
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

  waarschuwing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F7EFE6',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  waarschuwingTekst: {
    flex: 1,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    lineHeight: 21,
    color: EkoColors.primaryDark,
  },

  scheiding: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: EkoColors.lightSteelBlue,
    marginHorizontal: 16,
    marginVertical: 22,
  },

  rij: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16,
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
  uitverkochtLabel: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(22,35,46,0.55)',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  uitverkochtTekst: {
    fontFamily: EkoFonts.headingMedium,
    fontSize: 11,
    letterSpacing: 0.8,
    color: EkoColors.white,
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
  advies: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    color: EkoColors.darkGray,
    marginTop: 4,
  },

  actieRij: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
    marginTop: 16,
  },
  maatVeld: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: EkoColors.lightSteelBlue,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  maatWaarde: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.primaryDark,
  },
  maatPlaceholder: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.paragraphGray,
  },
  knopDonker: {
    width: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: EkoColors.primaryDark,
  },
  knopLicht: {
    width: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: EkoColors.lightSteelBlue,
  },

  melding: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 92,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    flex: 1,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.primaryDark,
  },

  paneelAchter: {
    flex: 1,
    backgroundColor: 'rgba(22,35,46,0.18)',
  },
  paneel: {
    backgroundColor: EkoColors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 10,
  },
  paneelGreep: {
    alignSelf: 'center',
    width: 46,
    height: 5,
    borderRadius: 3,
    backgroundColor: EkoColors.lightSteelBlue,
    marginBottom: 16,
  },
  paneelKopRij: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  paneelKop: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 17,
    color: EkoColors.primaryDark,
  },
  paneelRij: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: EkoColors.lightSteelBlue,
  },
  paneelRijTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.primaryDark,
  },
  paneelRijTekstAan: {
    fontFamily: EkoFonts.bodyBold,
    color: EkoColors.primary,
  },
});
