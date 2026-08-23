import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCardData } from '@/components/product-card';
import { ProductTegel } from '@/components/winkel/product-tegel';
import { EkoColors, EkoFonts, EkoRadius } from '@/constants/eko-theme';
import { laatstBekeken, markeerBekeken, verwijderBekeken } from '@/lib/laatst-bekeken';
import { matenVoorProduct } from '@/lib/maten';
import { parseRichText } from '@/lib/rich-text';
import { staatOpVerlanglijst, useVerlanglijst, wisselVerlanglijst } from '@/lib/verlanglijst';
import { fetchCategorieIds } from '@/lib/webflow-categories';
import { fetchWebflowProducts } from '@/lib/webflow-products';
import { HOOFDCATEGORIEEN, vindHoofdcategorie, vindSubcategorie } from '@/lib/winkel-boom';
import { voegToeAanMand } from '@/lib/winkelmand';

/**
 * Productpagina in warenhuisstijl: fotogalerij met bladeren, merk, naam en
 * prijs, kleur- en maatkeuze (onderschuifpaneel), winkelvoorraad, maatadvies,
 * inklapbare informatieblokken en de secties "Anderen bekeken ook",
 * "Laatst bekeken" en "Bekijk meer", met onderaan een vaste
 * In winkelmand-knop.
 */

function isSale(p: ProductCardData): boolean {
  return (
    typeof p.vergelijkPrijsEuro === 'number' &&
    typeof p.priceEuro === 'number' &&
    p.vergelijkPrijsEuro > p.priceEuro
  );
}

export default function ProductScherm() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  /* Hoogte van de zwevende tabbalk + marge: de winkelmand-balk zweeft daarboven. */
  const tabRuimte = 62 + Math.max(insets.bottom, 12) + 8;
  const { width: schermBreedte } = useWindowDimensions();

  const [producten, setProducten] = useState<ProductCardData[]>([]);
  const [catIds, setCatIds] = useState<Record<string, string>>({});
  const [laden, setLaden] = useState(true);

  const [fotoIndex, setFotoIndex] = useState(0);
  const [maat, setMaat] = useState<string | null>(null);
  const [maatOpen, setMaatOpen] = useState(false);
  const [voorraadOpen, setVoorraadOpen] = useState(false);
  const [galerijOpen, setGalerijOpen] = useState(false);
  const [grootIndex, setGrootIndex] = useState(0);
  const groteLijst = useRef<FlatList<string>>(null);
  const [openBlok, setOpenBlok] = useState<string | null>(null);
  const [toegevoegd, setToegevoegd] = useState(false);
  const [tik, verversTik] = useState(0);
  const toegevoegdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    Promise.all([fetchWebflowProducts(), fetchCategorieIds()])
      .then(([items, ids]) => {
        setProducten(items.map((i) => i.card));
        setCatIds(ids);
        setLaden(false);
      })
      .catch(() => setLaden(false));
    return () => {
      if (toegevoegdTimer.current) clearTimeout(toegevoegdTimer.current);
    };
  }, []);

  useVerlanglijst(); // laat de pagina meelezen met de gedeelde verlanglijst

  const product = producten.find((p) => p.id === id);
  const favoriet = product ? staatOpVerlanglijst(product.id) : false;

  /* Bij welke categorieën hoort dit product (slugs uit de winkelboom)? */
  const eigenSlugs = useMemo(() => {
    if (!product) return [];
    const ids = new Set(product.categorieIds || []);
    return Object.keys(catIds).filter((slug) => ids.has(catIds[slug]));
  }, [product, catIds]);

  const subcategorie = eigenSlugs.map((s) => vindSubcategorie(s)).find(Boolean);
  const hoofd =
    eigenSlugs.map((s) => vindHoofdcategorie(s)).find(Boolean) ??
    (subcategorie ? vindHoofdcategorie(subcategorie.slug) : undefined);
  const maten = product ? matenVoorProduct(product, hoofd?.slug) : undefined;

  /* Laatst bekeken bijhouden. */
  useEffect(() => {
    if (product) markeerBekeken(product.id);
  }, [product]);

  /* Anderen bekeken ook: producten uit dezelfde categorie. */
  const verwant = useMemo(() => {
    if (!product) return [];
    const ids = new Set(product.categorieIds || []);
    return producten
      .filter((p) => p.id !== product.id && (p.categorieIds || []).some((c) => ids.has(c)))
      .slice(0, 6);
  }, [product, producten]);

  const eerderBekeken = useMemo(
    () =>
      laatstBekeken()
        .filter((bid) => bid !== id)
        .map((bid) => producten.find((p) => p.id === bid))
        .filter((p): p is ProductCardData => !!p),
    // 'tik' dwingt een verversing af wanneer een tegel met het kruisje wordt verwijderd.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, producten, tik]
  );

  if (laden) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={EkoColors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.grijsTekst}>Product niet gevonden.</Text>
      </View>
    );
  }

  const fotos = product.imageUrls?.length
    ? product.imageUrls
    : product.imageUrl
      ? [product.imageUrl]
      : [];
  const sale = isSale(product);
  const specBlokken = parseRichText(product.specificaties);
  const meerInfoBlokken = parseRichText(product.meerInfo);

  function deel() {
    Share.share({
      message: `${product!.name} — EKO Motorwear\nhttps://eko-exampenopdracht.webflow.io/product/${product!.slug ?? ''}`,
    }).catch(() => {});
  }

  function inWinkelmand() {
    if (maten && !maat) {
      setMaatOpen(true);
      return;
    }
    voegToeAanMand(product!.id, maat ?? undefined);
    setToegevoegd(true);
    if (toegevoegdTimer.current) clearTimeout(toegevoegdTimer.current);
    toegevoegdTimer.current = setTimeout(() => setToegevoegd(false), 6000);
  }

  return (
    <View style={styles.scherm}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        {/* Fotogalerij met bladeren */}
        <View>
          <FlatList
            data={fotos}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(uri, i) => `${i}-${uri}`}
            onMomentumScrollEnd={(e) =>
              setFotoIndex(Math.round(e.nativeEvent.contentOffset.x / schermBreedte))
            }
            renderItem={({ item }) => (
              <Pressable
                style={[styles.fotoVlak, { width: schermBreedte }]}
                accessibilityLabel="Foto vergroten"
                onPress={() => {
                  setGrootIndex(fotoIndex);
                  setGalerijOpen(true);
                }}>
                <Image
                  source={{ uri: item }}
                  style={styles.foto}
                  contentFit="contain"
                  transition={150}
                />
              </Pressable>
            )}
            ListEmptyComponent={
              <View style={[styles.fotoVlak, styles.fotoLeeg, { width: schermBreedte }]}>
                <Ionicons name="image-outline" size={48} color={EkoColors.darkGray} />
              </View>
            }
          />
          {fotos.length > 1 && (
            <View style={styles.fotoBalkjes}>
              {fotos.map((_, i) => (
                <View key={i} style={[styles.balkje, i === fotoIndex && styles.balkjeAan]} />
              ))}
            </View>
          )}
        </View>

        {/* Merk, naam en prijs */}
        <View style={styles.info}>
          {!!product.merk && <Text style={styles.merk}>{product.merk}</Text>}
          <Text style={styles.naam}>{product.name}</Text>
          {typeof product.priceEuro === 'number' && (
            <View style={styles.prijsRij}>
              {sale && (
                <Text style={styles.adviesPrijs}>
                  € {product.vergelijkPrijsEuro!.toFixed(2)}
                </Text>
              )}
              <Text style={[styles.prijs, sale && styles.prijsSale]}>
                € {product.priceEuro.toFixed(2)}
              </Text>
            </View>
          )}
          <View style={styles.scheiding} />

          {/* Kleur */}
          {!!product.kleur && (
            <View style={styles.kleurRij}>
              <Text style={styles.kleurLabel}>Kleur</Text>
              <Text style={styles.kleurWaarde}>{product.kleur}</Text>
            </View>
          )}

          {/* Maat */}
          {maten && (
            <View style={{ marginTop: 14 }}>
              <Text style={styles.kleurLabel}>Maat</Text>
              <Pressable style={styles.maatVeld} onPress={() => setMaatOpen(true)}>
                <Text style={maat ? styles.maatWaarde : styles.maatPlaceholder}>
                  {maat ?? 'Selecteer maat'}
                </Text>
                <Ionicons name="chevron-down" size={18} color={EkoColors.primaryDark} />
              </Pressable>
              <View style={styles.infoVlak}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={EkoColors.primaryDark}
                />
                <Text style={styles.infoVlakTekst}>
                  Twijfel je tussen twee maten? Onze artikelen vallen normaal op maat.
                </Text>
              </View>
            </View>
          )}

          {/* Winkelvoorraad */}
          <Pressable style={styles.voorraadKnop} onPress={() => setVoorraadOpen((v) => !v)}>
            <Text style={styles.voorraadKnopTekst}>Bekijk winkelvoorraad</Text>
          </Pressable>
          {voorraadOpen && (
            <View style={styles.infoVlak}>
              <Ionicons name="storefront-outline" size={20} color={EkoColors.primaryDark} />
              <Text style={styles.infoVlakTekst}>
                Dit artikel ligt in onze showroom. Kom gerust langs om het te passen — onze
                medewerkers helpen je met de juiste maat.
              </Text>
            </View>
          )}

          {/* Maatadvies */}
          {maten && (
            <View style={styles.meetKaart}>
              <View style={styles.meetIcoon}>
                <Ionicons name="resize-outline" size={26} color={EkoColors.white} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.meetKop}>Hoe kies ik de juiste maat?</Text>
                <Text style={styles.meetTekst}>
                  Meet je lichaam op en vergelijk met de maattabel van het merk, zo bepaal je de
                  perfecte pasvorm voor op de motor.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Inklapbare informatieblokken */}
        <View style={{ marginTop: 10 }}>
          {!!product.description && (
            <InfoBlok
              label="Beschrijving"
              open={openBlok === 'beschrijving'}
              onPress={() => setOpenBlok(openBlok === 'beschrijving' ? null : 'beschrijving')}>
              <Text style={styles.blokTekst}>{product.description}</Text>
            </InfoBlok>
          )}
          {meerInfoBlokken.length > 0 && (
            <InfoBlok
              label="Meer over dit artikel"
              open={openBlok === 'meer-info'}
              onPress={() => setOpenBlok(openBlok === 'meer-info' ? null : 'meer-info')}>
              {meerInfoBlokken.map((blok, i) =>
                blok.type === 'h2' || blok.type === 'h3' ? (
                  <Text key={i} style={styles.blokKopje}>
                    {blok.text}
                  </Text>
                ) : (
                  <Text key={i} style={styles.blokTekst}>
                    {blok.text}
                  </Text>
                )
              )}
            </InfoBlok>
          )}
          {(specBlokken.length > 0 || product.materiaal || product.geslacht || product.seizoen) && (
            <InfoBlok
              label="Samenstelling en specificaties"
              open={openBlok === 'specificaties'}
              onPress={() => setOpenBlok(openBlok === 'specificaties' ? null : 'specificaties')}>
              {specBlokken.map((blok, i) =>
                blok.type === 'h2' || blok.type === 'h3' ? (
                  <Text key={i} style={styles.blokKopje}>
                    {blok.text}
                  </Text>
                ) : (
                  <Text key={i} style={styles.blokTekst}>
                    {blok.text}
                  </Text>
                )
              )}
              {specBlokken.length === 0 && (
                <>
                  {!!product.materiaal && (
                    <Text style={styles.blokTekst}>Materiaal: {product.materiaal}</Text>
                  )}
                  {!!product.geslacht && (
                    <Text style={styles.blokTekst}>Geslacht: {product.geslacht}</Text>
                  )}
                  {!!product.seizoen && (
                    <Text style={styles.blokTekst}>Seizoen: {product.seizoen}</Text>
                  )}
                </>
              )}
            </InfoBlok>
          )}
          <InfoBlok
            label="Bestellen en retourneren"
            open={openBlok === 'bestellen'}
            onPress={() => setOpenBlok(openBlok === 'bestellen' ? null : 'bestellen')}>
            <Text style={styles.blokKopje}>Bezorgen</Text>
            <Text style={styles.blokTekst}>
              Je bestelling wordt zorgvuldig verpakt en binnen 1 tot 3 werkdagen thuis geleverd.
              Zodra je pakket onderweg is, ontvang je een track & trace-code.
            </Text>
            <Text style={styles.blokKopje}>Retourneren</Text>
            <Text style={styles.blokTekst}>
              Online aankopen kan je binnen 30 dagen gratis retourneren in de showroom of via een
              retourzending. Zo bestel je zonder zorgen.
            </Text>
          </InfoBlok>
        </View>

        {/* Anderen bekeken ook */}
        {verwant.length > 0 && (
          <View style={styles.sectie}>
            <Text style={styles.sectieKop}>Anderen bekeken ook</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sectieRij}>
              {verwant.map((p) => (
                <ProductTegel
                  key={p.id}
                  product={p}
                  breedte={170}
                  onPress={() => router.push(`/product/${p.id}`)}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Laatst bekeken */}
        {eerderBekeken.length > 0 && (
          <View style={styles.sectie}>
            <Text style={styles.sectieKop}>Laatst bekeken</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sectieRij}>
              {eerderBekeken.map((p) => (
                <View key={p.id} style={{ width: 170 }}>
                  <ProductTegel
                    product={p}
                    breedte={170}
                    onPress={() => router.push(`/product/${p.id}`)}
                  />
                  <Pressable
                    style={styles.verwijderKnop}
                    hitSlop={8}
                    onPress={() => {
                      verwijderBekeken(p.id);
                      verversTik((t) => t + 1);
                    }}>
                    <Ionicons name="close" size={16} color={EkoColors.primaryDark} />
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Bekijk meer */}
        <View style={styles.sectie}>
          <Text style={styles.sectieKop}>Bekijk meer</Text>
          <View style={styles.meerRij}>
            {!!product.merk && (
              <View style={styles.meerChipStil}>
                <Text style={styles.meerChipTekst}>{product.merk}</Text>
              </View>
            )}
            {subcategorie && (
              <Pressable
                style={styles.meerChip}
                onPress={() => router.push(`/lijst/${subcategorie.slug}`)}>
                <Text style={styles.meerChipTekst}>{subcategorie.naam}</Text>
              </Pressable>
            )}
            {hoofd && (
              <Pressable
                style={styles.meerChip}
                onPress={() => router.push(`/categorie/${hoofd.slug}`)}>
                <Text style={styles.meerChipTekst}>{hoofd.naam}</Text>
              </Pressable>
            )}
            {!subcategorie && !hoofd && (
              <Pressable
                style={styles.meerChip}
                onPress={() => router.push(`/categorie/${HOOFDCATEGORIEEN[0].slug}`)}>
                <Text style={styles.meerChipTekst}>Winkel</Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Zwevende knoppen boven de foto */}
      <View style={[styles.kopOverlay, { top: insets.top + 6 }]}>
        <Pressable style={styles.rondeKnop} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={EkoColors.primaryDark} />
        </Pressable>
        <View style={styles.kopPil}>
          <Pressable hitSlop={8} onPress={deel}>
            <Ionicons name="share-outline" size={20} color={EkoColors.primaryDark} />
          </Pressable>
          <Pressable hitSlop={8} onPress={() => product && wisselVerlanglijst(product.id)}>
            <Ionicons
              name={favoriet ? 'heart' : 'heart-outline'}
              size={20}
              color={favoriet ? EkoColors.primary : EkoColors.primaryDark}
            />
          </Pressable>
        </View>
      </View>

      {/* Vaste In winkelmand-knop, zwevend boven de tabbalk. Na het toevoegen
          verschijnt er meteen een tweede knop om naar de winkelmand te gaan. */}
      <View style={[styles.mandBalk, { bottom: tabRuimte, paddingBottom: 12 }]}>
        <View style={styles.mandRij}>
          <Pressable
            style={[styles.mandKnop, toegevoegd && styles.mandKnopKlaar]}
            onPress={inWinkelmand}>
            <Text style={styles.mandKnopTekst}>
              {toegevoegd ? 'Toegevoegd ✓' : 'In winkelmand'}
            </Text>
          </Pressable>
          {toegevoegd && (
            <Pressable
              style={styles.naarMandKnop}
              accessibilityLabel="Naar winkelmand"
              onPress={() => router.push('/winkelmand')}>
              <Text style={styles.mandKnopTekst}>Naar winkelmand</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Schermvullende fotogalerij */}
      <Modal
        visible={galerijOpen}
        animationType="fade"
        onRequestClose={() => setGalerijOpen(false)}>
        <View style={styles.galerij}>
          <View style={[styles.galerijKop, { paddingTop: insets.top + 6 }]}>
            <Pressable
              style={styles.rondeKnop}
              accessibilityLabel="Sluiten"
              onPress={() => setGalerijOpen(false)}>
              <Ionicons name="close" size={22} color={EkoColors.primaryDark} />
            </Pressable>
          </View>

          <FlatList
            ref={groteLijst}
            data={fotos}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(uri, i) => `groot-${i}-${uri}`}
            initialScrollIndex={grootIndex}
            getItemLayout={(_, i) => ({
              length: schermBreedte,
              offset: schermBreedte * i,
              index: i,
            })}
            onMomentumScrollEnd={(e) =>
              setGrootIndex(Math.round(e.nativeEvent.contentOffset.x / schermBreedte))
            }
            renderItem={({ item }) => (
              <View style={[styles.grooteFotoVlak, { width: schermBreedte }]}>
                <Image source={{ uri: item }} style={styles.foto} contentFit="contain" />
              </View>
            )}
          />

          {fotos.length > 1 && (
            <View style={[styles.duimBalk, { paddingBottom: Math.max(insets.bottom, 12) }]}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.duimRij}>
                {fotos.map((uri, i) => (
                  <Pressable
                    key={`duim-${i}-${uri}`}
                    accessibilityLabel={`Foto ${i + 1}`}
                    onPress={() => {
                      setGrootIndex(i);
                      groteLijst.current?.scrollToIndex({ index: i, animated: true });
                    }}>
                    <View style={styles.duimVlak}>
                      <Image source={{ uri }} style={styles.duim} contentFit="contain" />
                    </View>
                    <View style={[styles.duimStreep, i === grootIndex && styles.duimStreepAan]} />
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </Modal>

      {/* Onderschuifpaneel: maat kiezen */}
      <Modal
        visible={maatOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMaatOpen(false)}>
        <Pressable style={styles.paneelAchter} onPress={() => setMaatOpen(false)} />
        <View style={[styles.paneel, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <View style={styles.paneelGreep} />
          <View style={styles.paneelKopRij}>
            <Text style={styles.paneelKop}>Maat</Text>
            <Pressable hitSlop={8} onPress={() => setMaatOpen(false)}>
              <Ionicons name="close" size={24} color={EkoColors.primaryDark} />
            </Pressable>
          </View>
          {(maten ?? []).map((m) => (
            <Pressable
              key={m}
              style={styles.paneelRij}
              onPress={() => {
                setMaat(m);
                setMaatOpen(false);
              }}>
              <Text style={[styles.paneelRijTekst, maat === m && styles.paneelRijTekstAan]}>
                {m}
              </Text>
              {maat === m && <Ionicons name="checkmark" size={20} color={EkoColors.primary} />}
            </Pressable>
          ))}
        </View>
      </Modal>
    </View>
  );
}

function InfoBlok({
  label,
  open,
  onPress,
  children,
}: {
  label: string;
  open: boolean;
  onPress: () => void;
  children: ReactNode;
}) {
  return (
    <View style={styles.infoBlok}>
      <Pressable style={styles.infoBlokKop} onPress={onPress}>
        <Ionicons
          name={open ? 'remove' : 'add'}
          size={22}
          color={EkoColors.primaryDark}
        />
        <Text style={styles.infoBlokLabel}>{label}</Text>
      </Pressable>
      {open && <View style={styles.infoBlokInhoud}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  scherm: {
    flex: 1,
    backgroundColor: EkoColors.white,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: EkoColors.white,
  },
  grijsTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.paragraphGray,
  },
  fotoVlak: {
    height: 400,
    backgroundColor: '#F4F4F2',
  },
  foto: {
    width: '100%',
    height: '100%',
  },
  fotoLeeg: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fotoBalkjes: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  balkje: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: EkoColors.lightSteelBlue,
  },
  balkjeAan: {
    backgroundColor: EkoColors.primaryDark,
  },
  info: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  merk: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 20,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: EkoColors.primaryDark,
  },
  naam: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.paragraphGray,
    marginTop: 4,
  },
  prijsRij: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  prijs: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 17,
    color: EkoColors.primaryDark,
  },
  prijsSale: {
    color: EkoColors.primary,
  },
  adviesPrijs: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.darkGray,
    textDecorationLine: 'line-through',
  },
  scheiding: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: EkoColors.lightSteelBlue,
    marginVertical: 18,
  },
  kleurRij: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  kleurLabel: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 14,
    color: EkoColors.primaryDark,
  },
  kleurWaarde: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    color: EkoColors.paragraphGray,
  },
  maatVeld: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: EkoColors.lightSteelBlue,
    borderRadius: 0,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  maatWaarde: {
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 14,
    color: EkoColors.primaryDark,
  },
  maatPlaceholder: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    color: EkoColors.paragraphGray,
  },
  infoVlak: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#F7F4F1',
    padding: 12,
    marginTop: 10,
  },
  infoVlakTekst: {
    flex: 1,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 13,
    lineHeight: 19,
    color: EkoColors.primaryDark,
  },
  voorraadKnop: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: EkoColors.lightSteelBlue,
    paddingVertical: 13,
    alignItems: 'center',
  },
  voorraadKnopTekst: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 14,
    color: EkoColors.primaryDark,
  },
  meetKaart: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#F7F4F1',
    padding: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  meetIcoon: {
    width: 44,
    height: 44,
    borderRadius: EkoRadius.small,
    backgroundColor: EkoColors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meetKop: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 14,
    color: EkoColors.primaryDark,
    marginBottom: 4,
  },
  meetTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 13,
    lineHeight: 19,
    color: EkoColors.paragraphGray,
  },
  infoBlok: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: EkoColors.lightSteelBlue,
    marginHorizontal: 16,
  },
  infoBlokKop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 15,
  },
  infoBlokLabel: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 15,
    color: EkoColors.primaryDark,
  },
  infoBlokInhoud: {
    paddingBottom: 18,
  },
  blokKopje: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 14,
    color: EkoColors.primaryDark,
    marginTop: 10,
    marginBottom: 4,
  },
  blokTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 13,
    lineHeight: 20,
    color: EkoColors.paragraphGray,
    marginBottom: 6,
  },
  sectie: {
    marginTop: 26,
  },
  sectieKop: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 20,
    letterSpacing: 0.3,
    color: EkoColors.primaryDark,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  sectieRij: {
    paddingHorizontal: 16,
    gap: 14,
  },
  verwijderKnop: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: EkoColors.whiteTranslucent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meerRij: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
  },
  meerChip: {
    borderWidth: 1,
    borderColor: EkoColors.primaryDark,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  meerChipStil: {
    borderWidth: 1,
    borderColor: EkoColors.lightSteelBlue,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  meerChipTekst: {
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 13,
    color: EkoColors.primaryDark,
  },
  galerij: {
    flex: 1,
    backgroundColor: EkoColors.white,
  },
  galerijKop: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    alignItems: 'flex-start',
  },
  grooteFotoVlak: {
    flex: 1,
    backgroundColor: '#F4F4F2',
    justifyContent: 'center',
  },
  duimBalk: {
    paddingTop: 12,
    backgroundColor: EkoColors.white,
  },
  duimRij: {
    paddingHorizontal: 12,
    gap: 8,
  },
  duimVlak: {
    width: 84,
    height: 104,
    backgroundColor: '#F4F4F2',
    padding: 6,
  },
  duim: {
    width: '100%',
    height: '100%',
  },
  duimStreep: {
    height: 3,
    marginTop: 4,
    backgroundColor: 'transparent',
  },
  duimStreepAan: {
    backgroundColor: EkoColors.primaryDark,
  },
  kopOverlay: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  kopPil: {
    flexDirection: 'row',
    gap: 18,
    backgroundColor: EkoColors.white,
    borderRadius: EkoRadius.pill,
    paddingHorizontal: 18,
    paddingVertical: 11,
    shadowColor: EkoColors.primaryDark,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  mandBalk: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: EkoColors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: EkoColors.lightSteelBlue,
    shadowColor: EkoColors.primaryDark,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },
  mandRij: {
    flexDirection: 'row',
    gap: 10,
  },
  mandKnop: {
    flex: 1,
    backgroundColor: EkoColors.primary,
    paddingVertical: 15,
    alignItems: 'center',
  },
  naarMandKnop: {
    flex: 1,
    backgroundColor: EkoColors.primary,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mandKnopKlaar: {
    backgroundColor: EkoColors.primaryDark,
  },
  mandKnopTekst: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 15,
    color: EkoColors.white,
  },
  paneelAchter: {
    flex: 1,
    backgroundColor: 'rgba(22,35,46,0.18)',
  },
  paneel: {
    backgroundColor: EkoColors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  paneelGreep: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: EkoColors.lightSteelBlue,
    marginBottom: 14,
  },
  paneelKopRij: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  paneelKop: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 17,
    letterSpacing: 0.5,
    color: EkoColors.primaryDark,
  },
  paneelRij: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
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
