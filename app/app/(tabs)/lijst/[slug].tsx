import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCardData } from '@/components/product-card';
import { ProductTegel } from '@/components/winkel/product-tegel';
import { EkoColors, EkoFonts, EkoRadius } from '@/constants/eko-theme';
import { fetchCategorieIds } from '@/lib/webflow-categories';
import { fetchWebflowProducts } from '@/lib/webflow-products';
import {
  ARTIKELTYPES,
  pastBijType,
  vindHoofdcategorie,
  vindSubcategorie,
} from '@/lib/winkel-boom';

/**
 * Productlijst in warenhuisstijl: kop met terugknop, titel, artikelaantal en
 * filterknop; daaronder de artikeltypes van de subcategorie als chips
 * (overgenomen van EKO Motorwear) en het productrooster. De filterknop opent
 * een volledig filterscherm met sorteren, eigenschappen, prijs en sale.
 */

const SORTEEROPTIES: [string, string][] = [
  ['standaard', 'Aanbevolen'],
  ['prijs-op', 'Prijs laag - hoog'],
  ['prijs-af', 'Prijs hoog - laag'],
  ['naam', 'Naam A - Z'],
];

const PRIJSKLASSEN = [
  { min: 0, max: 100, tekst: 'Tot € 100' },
  { min: 100, max: 200, tekst: '€ 100 - € 200' },
  { min: 200, max: 300, tekst: '€ 200 - € 300' },
  { min: 300, max: Infinity, tekst: 'Vanaf € 300' },
];

const EIGENSCHAPGROEPEN: [keyof ProductCardData, string][] = [
  ['merk', 'Merk'],
  ['geslacht', 'Geslacht'],
  ['kleur', 'Kleur'],
  ['materiaal', 'Materiaal'],
  ['eigenschappen', 'Eigenschappen'],
  ['seizoen', 'Seizoen'],
];

function isSale(p: ProductCardData): boolean {
  return (
    typeof p.vergelijkPrijsEuro === 'number' &&
    typeof p.priceEuro === 'number' &&
    p.vergelijkPrijsEuro > p.priceEuro
  );
}

export default function LijstScherm() {
  const { slug } = useLocalSearchParams<{ slug: string; alles?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  /* Vaste tegelbreedte: zo blijft een oneven laatste product even groot als de
     rest, in plaats van de volledige rij te vullen. */
  const { width: schermBreedte } = useWindowDimensions();
  const tegelBreedte = Math.floor((schermBreedte - 16 * 2 - 12) / 2);

  const subcategorie = vindSubcategorie(slug ?? '');
  const hoofd = vindHoofdcategorie(slug ?? '');
  const isHoofdLijst = !!hoofd && hoofd.slug === slug;
  const titel = subcategorie
    ? subcategorie.naam
    : isHoofdLijst
      ? hoofd!.naam
      : slug === 'nieuw'
        ? 'Nieuw'
        : slug === 'on-sale'
          ? 'Sale'
          : 'Alle producten';
  const types = slug ? ARTIKELTYPES[slug] : undefined;

  const [producten, setProducten] = useState<ProductCardData[]>([]);
  const [catIds, setCatIds] = useState<Record<string, string>>({});
  const [laden, setLaden] = useState(true);
  const [fout, setFout] = useState<string | null>(null);

  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openGroep, setOpenGroep] = useState<string | null>('Sorteren');
  const [sorteer, setSorteer] = useState('standaard');
  const [keuzes, setKeuzes] = useState<Record<string, string[]>>({});
  const [prijsKeuzes, setPrijsKeuzes] = useState<number[]>([]);
  const [alleenSale, setAlleenSale] = useState(false);

  useEffect(() => {
    Promise.all([fetchWebflowProducts(), fetchCategorieIds()])
      .then(([items, ids]) => {
        setProducten(items.map((i) => i.card));
        setCatIds(ids);
        setLaden(false);
      })
      .catch((err) => {
        setFout(err.message);
        setLaden(false);
      });
  }, []);

  /* Basisset: alle producten die bij deze categorie horen. */
  const basis = useMemo(() => {
    if (!slug) return producten;
    if (slug === 'on-sale') {
      const saleId = catIds['on-sale'];
      return producten.filter(
        (p) => isSale(p) || (saleId ? (p.categorieIds || []).includes(saleId) : false)
      );
    }
    let slugs: string[];
    if (isHoofdLijst) slugs = [hoofd!.slug, ...hoofd!.subs.map((s) => s.slug)];
    else slugs = [slug];
    const ids = new Set(slugs.map((s) => catIds[s]).filter(Boolean));
    if (!ids.size) return [];
    return producten.filter((p) => (p.categorieIds || []).some((id) => ids.has(id)));
  }, [producten, catIds, slug, isHoofdLijst, hoofd]);

  /* Beschikbare waarden per eigenschapgroep, met aantallen. */
  const groepWaarden = useMemo(() => {
    const uit: Record<string, [string, number][]> = {};
    EIGENSCHAPGROEPEN.forEach(([sleutel, label]) => {
      const tellers: Record<string, number> = {};
      basis.forEach((p) => {
        const w = p[sleutel];
        const lijst = Array.isArray(w) ? w : w ? [String(w)] : [];
        lijst.forEach((x) => {
          tellers[x] = (tellers[x] || 0) + 1;
        });
      });
      const namen = Object.keys(tellers).sort((a, b) => a.localeCompare(b, 'nl'));
      if (namen.length) uit[label] = namen.map((n) => [n, tellers[n]]);
    });
    return uit;
  }, [basis]);

  /* Filters en sortering toepassen. */
  const zichtbaar = useMemo(() => {
    let uit = basis;
    if (typeFilter && slug) uit = uit.filter((p) => pastBijType(p.name, slug, typeFilter));
    EIGENSCHAPGROEPEN.forEach(([sleutel, label]) => {
      const gekozen = keuzes[label];
      if (!gekozen || !gekozen.length) return;
      uit = uit.filter((p) => {
        const w = p[sleutel];
        const lijst = Array.isArray(w) ? w : w ? [String(w)] : [];
        return gekozen.some((x) => lijst.includes(x));
      });
    });
    if (prijsKeuzes.length) {
      uit = uit.filter((p) =>
        prijsKeuzes.some((idx) => {
          const kl = PRIJSKLASSEN[idx];
          return typeof p.priceEuro === 'number' && p.priceEuro >= kl.min && p.priceEuro < kl.max;
        })
      );
    }
    if (alleenSale) uit = uit.filter(isSale);

    const arr = [...uit];
    if (sorteer === 'prijs-op') arr.sort((a, b) => (a.priceEuro ?? 0) - (b.priceEuro ?? 0));
    else if (sorteer === 'prijs-af') arr.sort((a, b) => (b.priceEuro ?? 0) - (a.priceEuro ?? 0));
    else if (sorteer === 'naam') arr.sort((a, b) => a.name.localeCompare(b.name, 'nl'));
    return arr;
  }, [basis, typeFilter, slug, keuzes, prijsKeuzes, alleenSale, sorteer]);

  const ietsGekozen =
    Object.values(keuzes).some((v) => v.length) || prijsKeuzes.length > 0 || alleenSale;

  function wisselKeuze(label: string, waarde: string) {
    setKeuzes((oud) => {
      const huidig = oud[label] || [];
      const nieuw = huidig.includes(waarde)
        ? huidig.filter((x) => x !== waarde)
        : [...huidig, waarde];
      return { ...oud, [label]: nieuw };
    });
  }

  function wisAlles() {
    setKeuzes({});
    setPrijsKeuzes([]);
    setAlleenSale(false);
    setSorteer('standaard');
  }

  const leegTekst =
    basis.length && !typeFilter
      ? 'Geen producten gevonden met deze filters.'
      : 'Er zijn in deze categorie nog geen producten beschikbaar.';

  return (
    <View style={styles.scherm}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Kop: terugknop, titel + aantal, filterknop */}
      <View style={[styles.kop, { paddingTop: insets.top + 6 }]}>
        <Pressable style={styles.rondeKnop} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={EkoColors.primaryDark} />
        </Pressable>
        <View style={styles.kopMidden}>
          <Text style={styles.kopTitel}>{titel}</Text>
          <Text style={styles.kopAantal}>
            {zichtbaar.length} {zichtbaar.length === 1 ? 'artikel' : 'artikelen'}
          </Text>
        </View>
        <Pressable style={styles.rondeKnop} onPress={() => setFiltersOpen(true)}>
          <Ionicons name="options-outline" size={20} color={EkoColors.primaryDark} />
        </Pressable>
      </View>

      {/* Balk met subcategorieën (hoofdcategorie) of artikeltypes (subcategorie) */}
      {isHoofdLijst && hoofd!.subs.length > 0 && (
        <View style={styles.chipsBalk}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.typeRij}>
            {hoofd!.subs.map((sub) => (
              <Pressable
                key={sub.slug}
                style={styles.typeChip}
                onPress={() => router.push(`/lijst/${sub.slug}`)}>
                <Text style={styles.typeChipTekst} numberOfLines={1}>
                  {sub.naam}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {!isHoofdLijst && types && (
        <View style={styles.chipsBalk}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.typeRij}>
            {types.types.map(([naam]) => {
              const aan = typeFilter === naam;
              return (
                <Pressable
                  key={naam}
                  style={[styles.typeChip, aan && styles.typeChipAan]}
                  onPress={() => setTypeFilter(aan ? null : naam)}>
                  <Text
                    style={[styles.typeChipTekst, aan && styles.typeChipTekstAan]}
                    numberOfLines={1}>
                    {naam}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {laden ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={EkoColors.primary} />
        </View>
      ) : fout ? (
        <View style={styles.center}>
          <Text style={styles.leegTekst}>Fout: {fout}</Text>
        </View>
      ) : (
        <FlatList
          data={zichtbaar}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 60 }}
          renderItem={({ item }) => (
            <ProductTegel
              product={item}
              breedte={tegelBreedte}
              onPress={() => router.push(`/product/${item.id}`)}
            />
          )}
          ListEmptyComponent={<Text style={[styles.leegTekst, { padding: 16 }]}>{leegTekst}</Text>}
        />
      )}

      {/* Filterscherm */}
      <Modal visible={filtersOpen} animationType="slide" onRequestClose={() => setFiltersOpen(false)}>
        <View style={[styles.filterScherm, { paddingTop: insets.top + 6 }]}>
          <View style={styles.filterKop}>
            <Pressable style={styles.rondeKnop} onPress={() => setFiltersOpen(false)}>
              <Ionicons name="close" size={22} color={EkoColors.primaryDark} />
            </Pressable>
            <Text style={styles.filterTitel}>Filteren</Text>
            {ietsGekozen ? (
              <Pressable hitSlop={8} onPress={wisAlles}>
                <Text style={styles.wisTekst}>Wis alles</Text>
              </Pressable>
            ) : (
              <View style={styles.rondeKnopRuimte} />
            )}
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
            {/* Sorteren */}
            <FilterRij
              label="Sorteren"
              waarde={SORTEEROPTIES.find(([w]) => w === sorteer)?.[1]}
              open={openGroep === 'Sorteren'}
              onPress={() => setOpenGroep(openGroep === 'Sorteren' ? null : 'Sorteren')}>
              {SORTEEROPTIES.map(([waarde, label]) => (
                <Pressable key={waarde} style={styles.optieRij} onPress={() => setSorteer(waarde)}>
                  <View style={[styles.rondje, sorteer === waarde && styles.rondjeAan]} />
                  <Text style={styles.optieTekst}>{label}</Text>
                </Pressable>
              ))}
            </FilterRij>

            {/* Eigenschapgroepen */}
            {EIGENSCHAPGROEPEN.map(([, label]) => {
              const waarden = groepWaarden[label];
              if (!waarden) return null;
              const gekozen = keuzes[label] || [];
              return (
                <FilterRij
                  key={label}
                  label={label}
                  waarde={gekozen.length ? gekozen.join(', ') : undefined}
                  open={openGroep === label}
                  onPress={() => setOpenGroep(openGroep === label ? null : label)}>
                  {waarden.map(([naam, aantal]) => (
                    <Pressable
                      key={naam}
                      style={styles.optieRij}
                      onPress={() => wisselKeuze(label, naam)}>
                      <View style={[styles.vinkje, gekozen.includes(naam) && styles.vinkjeAan]}>
                        {gekozen.includes(naam) && (
                          <Ionicons name="checkmark" size={13} color={EkoColors.white} />
                        )}
                      </View>
                      <Text style={styles.optieTekst}>{naam}</Text>
                      <Text style={styles.optieAantal}>{aantal}</Text>
                    </Pressable>
                  ))}
                </FilterRij>
              );
            })}

            {/* Prijs */}
            <FilterRij
              label="Prijs"
              waarde={prijsKeuzes.length ? prijsKeuzes.map((i) => PRIJSKLASSEN[i].tekst).join(', ') : undefined}
              open={openGroep === 'Prijs'}
              onPress={() => setOpenGroep(openGroep === 'Prijs' ? null : 'Prijs')}>
              {PRIJSKLASSEN.map((kl, idx) => {
                const aantal = basis.filter(
                  (p) => typeof p.priceEuro === 'number' && p.priceEuro >= kl.min && p.priceEuro < kl.max
                ).length;
                if (!aantal) return null;
                const aan = prijsKeuzes.includes(idx);
                return (
                  <Pressable
                    key={kl.tekst}
                    style={styles.optieRij}
                    onPress={() =>
                      setPrijsKeuzes((oud) =>
                        aan ? oud.filter((x) => x !== idx) : [...oud, idx]
                      )
                    }>
                    <View style={[styles.vinkje, aan && styles.vinkjeAan]}>
                      {aan && <Ionicons name="checkmark" size={13} color={EkoColors.white} />}
                    </View>
                    <Text style={styles.optieTekst}>{kl.tekst}</Text>
                    <Text style={styles.optieAantal}>{aantal}</Text>
                  </Pressable>
                );
              })}
            </FilterRij>

            {/* Sale */}
            <FilterRij
              label="Sale"
              waarde={alleenSale ? 'Alleen afgeprijsde artikelen' : undefined}
              open={openGroep === 'Sale'}
              onPress={() => setOpenGroep(openGroep === 'Sale' ? null : 'Sale')}>
              <Pressable style={styles.optieRij} onPress={() => setAlleenSale((v) => !v)}>
                <View style={[styles.vinkje, alleenSale && styles.vinkjeAan]}>
                  {alleenSale && <Ionicons name="checkmark" size={13} color={EkoColors.white} />}
                </View>
                <Text style={styles.optieTekst}>Alleen afgeprijsde artikelen</Text>
                <Text style={styles.optieAantal}>{basis.filter(isSale).length}</Text>
              </Pressable>
            </FilterRij>
          </ScrollView>

          {/* Toepassen */}
          <View style={[styles.toepassenBalk, { paddingBottom: Math.max(insets.bottom, 14) }]}>
            <Pressable style={styles.toepassenKnop} onPress={() => setFiltersOpen(false)}>
              <Text style={styles.toepassenTekst}>
                Bekijk {zichtbaar.length === 1 ? '1 artikel' : `alle artikelen (${zichtbaar.length})`}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function FilterRij({
  label,
  waarde,
  open,
  onPress,
  children,
}: {
  label: string;
  waarde?: string;
  open: boolean;
  onPress: () => void;
  children: ReactNode;
}) {
  return (
    <View style={styles.filterRij}>
      <Pressable style={styles.filterRijKop} onPress={onPress}>
        <View style={{ flex: 1 }}>
          <Text style={styles.filterRijLabel}>{label}</Text>
          {!!waarde && (
            <Text style={styles.filterRijWaarde} numberOfLines={1}>
              {waarde}
            </Text>
          )}
        </View>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={EkoColors.paragraphGray}
        />
      </Pressable>
      {open && <View style={styles.filterRijInhoud}>{children}</View>}
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
  },
  kop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
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
  rondeKnopRuimte: {
    width: 42,
  },
  kopMidden: {
    flex: 1,
    alignItems: 'center',
  },
  kopTitel: {
    fontFamily: EkoFonts.headingMedium,
    fontSize: 17,
    letterSpacing: 0.5,
    color: EkoColors.primaryDark,
  },
  kopAantal: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 12,
    color: EkoColors.paragraphGray,
    marginTop: 1,
  },
  chipsBalk: { flexGrow: 0, flexShrink: 0 },
  typeRij: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 6,
    gap: 10,
    alignItems: 'center',
  },
  typeChip: {
    flexGrow: 0,
    flexShrink: 0,
    borderWidth: 1,
    borderColor: EkoColors.lightSteelBlue,
    backgroundColor: EkoColors.white,
    paddingHorizontal: 16,
    height: 40,
    justifyContent: 'center',
    borderRadius: EkoRadius.small,
  },
  typeChipAan: {
    backgroundColor: EkoColors.primaryDark,
  },
  typeChipTekst: {
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 13,
    color: EkoColors.primaryDark,
  },
  typeChipTekstAan: {
    color: EkoColors.white,
  },
  leegTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.paragraphGray,
  },
  filterScherm: {
    flex: 1,
    backgroundColor: EkoColors.white,
  },
  filterKop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  filterTitel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: EkoFonts.headingMedium,
    fontSize: 17,
    letterSpacing: 0.5,
    color: EkoColors.primaryDark,
  },
  wisTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    color: EkoColors.primary,
    textDecorationLine: 'underline',
  },
  filterRij: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: EkoColors.lightSteelBlue,
    paddingHorizontal: 16,
  },
  filterRijKop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
  },
  filterRijLabel: {
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 16,
    color: EkoColors.primaryDark,
  },
  filterRijWaarde: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 13,
    color: EkoColors.paragraphGray,
    marginTop: 2,
  },
  filterRijInhoud: {
    paddingBottom: 14,
  },
  optieRij: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    gap: 12,
  },
  optieTekst: {
    flex: 1,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.primaryDark,
  },
  optieAantal: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 13,
    color: EkoColors.darkGray,
  },
  vinkje: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: EkoColors.darkGray,
    backgroundColor: EkoColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vinkjeAan: {
    backgroundColor: EkoColors.primary,
    borderColor: EkoColors.primary,
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
  toepassenBalk: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: EkoColors.white,
  },
  toepassenKnop: {
    backgroundColor: EkoColors.primaryDark,
    borderRadius: EkoRadius.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  toepassenTekst: {
    fontFamily: EkoFonts.headingMedium,
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: EkoColors.white,
  },
});
