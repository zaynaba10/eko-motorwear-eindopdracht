import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCardData } from '@/components/product-card';
import { ProductTegel } from '@/components/winkel/product-tegel';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { prijsKort } from '@/lib/format';
import { fetchWebflowProducts } from '@/lib/webflow-products';

/**
 * Zoekresultaten voor één zoekterm: bovenaan de term met het aantal artikelen,
 * daaronder wisselknoppen per afdeling en het productraster. Rechtsboven opent
 * het paneel Filteren met sorteren, merken, kleuren en prijs.
 */

type Sortering = 'aanbevolen' | 'prijs-op' | 'prijs-af' | 'naam-az' | 'naam-za';

const SORTERINGEN: { waarde: Sortering; label: string }[] = [
  { waarde: 'aanbevolen', label: 'Aanbevolen' },
  { waarde: 'prijs-op', label: 'Prijs laag - hoog' },
  { waarde: 'prijs-af', label: 'Prijs hoog - laag' },
  { waarde: 'naam-az', label: 'Naam A - Z' },
  { waarde: 'naam-za', label: 'Naam Z - A' },
];

export default function ZoekresultatenScherm() {
  const { term } = useLocalSearchParams<{ term: string }>();
  const zoekterm = decodeURIComponent(String(term ?? ''));
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [producten, setProducten] = useState<ProductCardData[]>([]);
  const [laden, setLaden] = useState(true);

  const [afdeling, setAfdeling] = useState<string | null>(null);
  const [sortering, setSortering] = useState<Sortering>('aanbevolen');
  const [merken, setMerken] = useState<string[]>([]);
  const [kleuren, setKleuren] = useState<string[]>([]);
  const [maxPrijs, setMaxPrijs] = useState<number | null>(null);

  const [filterOpen, setFilterOpen] = useState(false);
  const [openGroep, setOpenGroep] = useState<string | null>('sorteren');

  useEffect(() => {
    fetchWebflowProducts()
      .then((items) => {
        setProducten(items.map((i) => i.card));
        setLaden(false);
      })
      .catch(() => setLaden(false));
  }, []);

  /* Alle producten die op de zoekterm passen. */
  const gevonden = useMemo(() => {
    const q = zoekterm.trim().toLowerCase();
    if (!q) return producten;
    return producten.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.merk || '').toLowerCase().includes(q) ||
        (p.kleur || '').toLowerCase().includes(q) ||
        (p.materiaal || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
    );
  }, [producten, zoekterm]);

  const afdelingen = useMemo(
    () => Array.from(new Set(gevonden.map((p) => p.geslacht).filter(Boolean) as string[])),
    [gevonden]
  );
  const alleMerken = useMemo(
    () => Array.from(new Set(gevonden.map((p) => p.merk).filter(Boolean) as string[])).sort(),
    [gevonden]
  );
  const alleKleuren = useMemo(
    () => Array.from(new Set(gevonden.map((p) => p.kleur).filter(Boolean) as string[])).sort(),
    [gevonden]
  );
  const prijsGrenzen = useMemo(() => {
    const prijzen = gevonden.map((p) => p.priceEuro ?? 0).filter((p) => p > 0);
    if (prijzen.length === 0) return [];
    const hoogste = Math.max(...prijzen);
    return [50, 100, 200, 400].filter((g) => g < hoogste).concat(Math.ceil(hoogste));
  }, [gevonden]);

  /* Filters en sortering toepassen. */
  const resultaten = useMemo(() => {
    let lijst = gevonden;
    if (afdeling) lijst = lijst.filter((p) => p.geslacht === afdeling);
    if (merken.length > 0) lijst = lijst.filter((p) => p.merk && merken.includes(p.merk));
    if (kleuren.length > 0) lijst = lijst.filter((p) => p.kleur && kleuren.includes(p.kleur));
    if (maxPrijs !== null) lijst = lijst.filter((p) => (p.priceEuro ?? 0) <= maxPrijs);

    const gesorteerd = [...lijst];
    switch (sortering) {
      case 'prijs-op':
        gesorteerd.sort((a, b) => (a.priceEuro ?? 0) - (b.priceEuro ?? 0));
        break;
      case 'prijs-af':
        gesorteerd.sort((a, b) => (b.priceEuro ?? 0) - (a.priceEuro ?? 0));
        break;
      case 'naam-az':
        gesorteerd.sort((a, b) => a.name.localeCompare(b.name, 'nl'));
        break;
      case 'naam-za':
        gesorteerd.sort((a, b) => b.name.localeCompare(a.name, 'nl'));
        break;
    }
    return gesorteerd;
  }, [gevonden, afdeling, merken, kleuren, maxPrijs, sortering]);

  const filtersActief =
    afdeling !== null ||
    merken.length > 0 ||
    kleuren.length > 0 ||
    maxPrijs !== null ||
    sortering !== 'aanbevolen';

  function wisAlles() {
    setAfdeling(null);
    setMerken([]);
    setKleuren([]);
    setMaxPrijs(null);
    setSortering('aanbevolen');
  }

  function wissel(lijst: string[], waarde: string, zet: (v: string[]) => void) {
    zet(lijst.includes(waarde) ? lijst.filter((x) => x !== waarde) : [...lijst, waarde]);
  }

  return (
    <View style={styles.scherm}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Kop */}
      <View style={[styles.kop, { paddingTop: insets.top + 6 }]}>
        <Pressable style={styles.rondeKnop} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={EkoColors.primaryDark} />
        </Pressable>

        <View style={styles.kopMidden}>
          <Text style={styles.kopTitel} numberOfLines={1}>
            ‘{zoekterm}’
          </Text>
          <Text style={styles.kopAantal}>
            {resultaten.length} {resultaten.length === 1 ? 'artikel' : 'artikelen'}
          </Text>
        </View>

        <Pressable
          style={[styles.rondeKnop, filtersActief && styles.rondeKnopAan]}
          accessibilityLabel="Filteren"
          onPress={() => setFilterOpen(true)}>
          <Ionicons
            name="options-outline"
            size={22}
            color={filtersActief ? EkoColors.white : EkoColors.primaryDark}
          />
        </Pressable>
      </View>

      {/* Afdelingen */}
      {afdelingen.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRij}>
          {afdelingen.map((a) => {
            const aan = a === afdeling;
            return (
              <Pressable
                key={a}
                style={[styles.vlakChip, aan && styles.vlakChipAan]}
                onPress={() => setAfdeling(aan ? null : a)}>
                <Text style={[styles.vlakChipTekst, aan && styles.vlakChipTekstAan]}>{a}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {/* Resultaten */}
      {laden ? (
        <View style={styles.midden}>
          <ActivityIndicator size="large" color={EkoColors.primary} />
        </View>
      ) : (
        <FlatList
          data={resultaten}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 16, paddingHorizontal: 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 26 }} />}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <ProductTegel product={item} onPress={() => router.push(`/product/${item.id}`)} />
          )}
          ListEmptyComponent={
            <View style={styles.leeg}>
              <Ionicons name="search-outline" size={36} color={EkoColors.darkGray} />
              <Text style={styles.leegTitel}>Geen resultaten gevonden</Text>
              <Text style={styles.leegTekst}>
                Probeer een andere zoekterm of zet je filters uit.
              </Text>
              {filtersActief && (
                <Pressable style={styles.leegKnop} onPress={wisAlles}>
                  <Text style={styles.leegKnopTekst}>Filters wissen</Text>
                </Pressable>
              )}
            </View>
          }
        />
      )}

      {/* Paneel Filteren */}
      <Modal visible={filterOpen} animationType="slide" onRequestClose={() => setFilterOpen(false)}>
        <View style={styles.scherm}>
          <View style={[styles.kop, { paddingTop: insets.top + 6 }]}>
            <Pressable style={styles.rondeKnop} onPress={() => setFilterOpen(false)}>
              <Ionicons name="close" size={22} color={EkoColors.primaryDark} />
            </Pressable>
            <View style={styles.kopMidden}>
              <Text style={styles.kopTitel}>Filteren</Text>
            </View>
            <Pressable style={styles.rondeKnop} accessibilityLabel="Alles wissen" onPress={wisAlles}>
              <Ionicons name="trash-outline" size={20} color={EkoColors.primaryDark} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
            <FilterGroep
              titel="Sorteren"
              samenvatting={SORTERINGEN.find((s) => s.waarde === sortering)?.label}
              open={openGroep === 'sorteren'}
              onPress={() => setOpenGroep(openGroep === 'sorteren' ? null : 'sorteren')}>
              {SORTERINGEN.map((s) => (
                <Pressable
                  key={s.waarde}
                  style={styles.keuzeRij}
                  onPress={() => setSortering(s.waarde)}>
                  <Text
                    style={[styles.keuzeTekst, sortering === s.waarde && styles.keuzeTekstAan]}>
                    {s.label}
                  </Text>
                  {sortering === s.waarde && (
                    <Ionicons name="checkmark" size={20} color={EkoColors.primary} />
                  )}
                </Pressable>
              ))}
            </FilterGroep>

            <FilterGroep
              titel="Merken"
              samenvatting={merken.length > 0 ? merken.join(', ') : undefined}
              open={openGroep === 'merken'}
              onPress={() => setOpenGroep(openGroep === 'merken' ? null : 'merken')}>
              <View style={styles.chipRaster}>
                {alleMerken.map((m) => {
                  const aan = merken.includes(m);
                  return (
                    <Pressable
                      key={m}
                      style={[styles.rondChip, aan && styles.rondChipAan]}
                      onPress={() => wissel(merken, m, setMerken)}>
                      <Text style={[styles.rondChipTekst, aan && styles.rondChipTekstAan]}>{m}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </FilterGroep>

            <FilterGroep
              titel="Kleur"
              samenvatting={kleuren.length > 0 ? kleuren.join(', ') : undefined}
              open={openGroep === 'kleur'}
              onPress={() => setOpenGroep(openGroep === 'kleur' ? null : 'kleur')}>
              <View style={styles.chipRaster}>
                {alleKleuren.map((k) => {
                  const aan = kleuren.includes(k);
                  return (
                    <Pressable
                      key={k}
                      style={[styles.rondChip, aan && styles.rondChipAan]}
                      onPress={() => wissel(kleuren, k, setKleuren)}>
                      <Text style={[styles.rondChipTekst, aan && styles.rondChipTekstAan]}>{k}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </FilterGroep>

            <FilterGroep
              titel="Prijs"
              samenvatting={maxPrijs !== null ? `tot ${prijsKort(maxPrijs)}` : undefined}
              open={openGroep === 'prijs'}
              onPress={() => setOpenGroep(openGroep === 'prijs' ? null : 'prijs')}>
              <View style={styles.chipRaster}>
                {prijsGrenzen.map((g) => {
                  const aan = maxPrijs === g;
                  return (
                    <Pressable
                      key={g}
                      style={[styles.rondChip, aan && styles.rondChipAan]}
                      onPress={() => setMaxPrijs(aan ? null : g)}>
                      <Text style={[styles.rondChipTekst, aan && styles.rondChipTekstAan]}>
                        tot {prijsKort(g)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </FilterGroep>
          </ScrollView>

          <View style={[styles.paneelBalk, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <Pressable style={styles.zwarteKnop} onPress={() => setFilterOpen(false)}>
              <Text style={styles.zwarteKnopTekst}>
                Bekijk alle artikelen ({resultaten.length})
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function FilterGroep({
  titel,
  samenvatting,
  open,
  onPress,
  children,
}: {
  titel: string;
  samenvatting?: string;
  open: boolean;
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.groep}>
      <Pressable style={styles.groepKop} onPress={onPress}>
        <View style={{ flex: 1 }}>
          <Text style={styles.groepTitel}>{titel}</Text>
          {!!samenvatting && (
            <Text style={styles.groepSamenvatting} numberOfLines={1}>
              {samenvatting}
            </Text>
          )}
        </View>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={EkoColors.primaryDark}
        />
      </Pressable>
      {open && <View style={styles.groepInhoud}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  scherm: { flex: 1, backgroundColor: EkoColors.white },

  kop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  rondeKnop: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: EkoColors.lightGray,
  },
  rondeKnopAan: { backgroundColor: EkoColors.primaryDark },
  kopMidden: { flex: 1, alignItems: 'center' },
  kopTitel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 20,
    letterSpacing: 0.3,
    color: EkoColors.primaryDark,
  },
  kopAantal: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 13,
    color: EkoColors.paragraphGray,
    marginTop: 2,
  },

  chipsRij: { paddingHorizontal: 16, paddingVertical: 10, gap: 10 },
  vlakChip: {
    borderWidth: 1,
    borderColor: EkoColors.lightSteelBlue,
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  vlakChipAan: { borderColor: EkoColors.primaryDark, backgroundColor: EkoColors.primaryDark },
  vlakChipTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.primaryDark,
  },
  vlakChipTekstAan: { color: EkoColors.white },

  midden: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  leeg: { alignItems: 'center', paddingHorizontal: 40, paddingTop: 60, gap: 8 },
  leegTitel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 19,
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
    marginTop: 12,
    backgroundColor: EkoColors.primaryDark,
    borderRadius: 26,
    paddingVertical: 13,
    paddingHorizontal: 24,
  },
  leegKnopTekst: {
    fontFamily: EkoFonts.headingMedium,
    fontSize: 13,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: EkoColors.white,
  },

  /* FILTERPANEEL */
  groep: {
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: EkoColors.lightSteelBlue,
  },
  groepKop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  groepTitel: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 17,
    color: EkoColors.primaryDark,
  },
  groepSamenvatting: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.paragraphGray,
    marginTop: 4,
  },
  groepInhoud: { paddingBottom: 18 },
  keuzeRij: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  keuzeTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 16,
    color: EkoColors.primaryDark,
  },
  keuzeTekstAan: { fontFamily: EkoFonts.bodyBold, color: EkoColors.primary },
  chipRaster: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  rondChip: {
    borderWidth: 1,
    borderColor: EkoColors.lightSteelBlue,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  rondChipAan: { backgroundColor: EkoColors.primaryDark, borderColor: EkoColors.primaryDark },
  rondChipTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.primaryDark,
  },
  rondChipTekstAan: { color: EkoColors.white },

  paneelBalk: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: EkoColors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: EkoColors.lightSteelBlue,
  },
  zwarteKnop: {
    backgroundColor: EkoColors.primaryDark,
    paddingVertical: 18,
    alignItems: 'center',
  },
  zwarteKnopTekst: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 16,
    color: EkoColors.white,
  },
});
