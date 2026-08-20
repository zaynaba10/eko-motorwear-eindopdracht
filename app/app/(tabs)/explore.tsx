import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCardData } from '@/components/product-card';
import { CategorieTegel } from '@/components/winkel/categorie-tegel';
import { ProductTegel } from '@/components/winkel/product-tegel';
import { EkoColors, EkoFonts, EkoRadius } from '@/constants/eko-theme';
import { fetchWebflowProducts } from '@/lib/webflow-products';
import { HOOFDCATEGORIEEN } from '@/lib/winkel-boom';
import {
  bewaarZoekterm,
  useZoekgeschiedenis,
  verwijderZoekterm,
  wisZoekgeschiedenis,
} from '@/lib/zoekgeschiedenis';

/**
 * Zoeken. In rust toont het scherm de winkelstructuur (hoofdcategorieën,
 * fototegels en subcategorieën). Zodra je de zoekbalk opent, verschijnt je
 * zoekgeschiedenis; typ je iets, dan krijg je de resultaten.
 * De zoekbalk zweeft onderaan en schuift mee met het toetsenbord.
 */

/** Hoogte van de zwevende tabbalk plus de ruimte eronder. */
const TABBALK_RUIMTE = 82;

export default function ZoekScherm() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const veld = useRef<TextInput>(null);

  const geschiedenis = useZoekgeschiedenis();

  const [actieveSlug, setActieveSlug] = useState(HOOFDCATEGORIEEN[0].slug);
  const [zoek, setZoek] = useState('');
  const [focus, setFocus] = useState(false);
  const [producten, setProducten] = useState<ProductCardData[]>([]);
  const [toetsenbord, setToetsenbord] = useState(0);

  useEffect(() => {
    fetchWebflowProducts()
      .then((items) => setProducten(items.map((i) => i.card)))
      .catch(() => {});
  }, []);

  /* De zoekbalk blijft net boven het toetsenbord staan. */
  useEffect(() => {
    const open = Keyboard.addListener('keyboardDidShow', (e) =>
      setToetsenbord(e.endCoordinates.height)
    );
    const dicht = Keyboard.addListener('keyboardDidHide', () => setToetsenbord(0));
    return () => {
      open.remove();
      dicht.remove();
    };
  }, []);

  const actief = HOOFDCATEGORIEEN.find((h) => h.slug === actieveSlug) ?? HOOFDCATEGORIEEN[0];
  const fotoSubs = actief.subs.filter((s) => s.foto).slice(0, 5);

  const zoekResultaten = useMemo(() => {
    const q = zoek.trim().toLowerCase();
    if (!q) return [];
    return producten.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.merk || '').toLowerCase().includes(q) ||
        (p.kleur || '').toLowerCase().includes(q)
    );
  }, [zoek, producten]);

  const aanHetZoeken = zoek.trim().length > 0;
  const toonGeschiedenis = focus && !aanHetZoeken && geschiedenis.length > 0;

  function sluitZoeken() {
    setZoek('');
    setFocus(false);
    Keyboard.dismiss();
  }

  function zoekOp(term: string) {
    setZoek(term);
    bewaarZoekterm(term);
    Keyboard.dismiss();
  }

  const balkOnder = toetsenbord > 0 ? Math.max(10, toetsenbord - TABBALK_RUIMTE + 8) : 10;

  return (
    <View style={[styles.scherm, { paddingTop: insets.top + 8 }]}>
      {toonGeschiedenis ? (
        /* ---------------------------------------------- zoekgeschiedenis */
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.geschiedenis}>
          <View style={styles.geschiedenisKop}>
            <Text style={styles.geschiedenisTitel}>Zoekgeschiedenis</Text>
            <Pressable hitSlop={10} onPress={wisZoekgeschiedenis}>
              <Text style={styles.wissen}>Wissen</Text>
            </Pressable>
          </View>

          {geschiedenis.map((term, i) => (
            <View key={`${term}-${i}`} style={styles.termRij}>
              <Pressable style={styles.termTekstVlak} onPress={() => zoekOp(term)}>
                <Text style={styles.termTekst}>{term}</Text>
              </Pressable>
              <Pressable
                hitSlop={12}
                accessibilityLabel={`${term} uit je zoekgeschiedenis halen`}
                onPress={() => verwijderZoekterm(i)}>
                <Ionicons name="close" size={22} color={EkoColors.primaryDark} />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      ) : aanHetZoeken ? (
        /* -------------------------------------------------- resultaten */
        <FlatList
          data={zoekResultaten}
          keyExtractor={(item) => item.id}
          numColumns={2}
          keyboardShouldPersistTaps="handled"
          columnWrapperStyle={{ gap: 16, paddingHorizontal: 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 140 }}
          ListHeaderComponent={
            <Text style={styles.zoekKop}>
              {zoekResultaten.length}
              {zoekResultaten.length === 1 ? ' resultaat' : ' resultaten'} voor “{zoek.trim()}”
            </Text>
          }
          renderItem={({ item }) => (
            <ProductTegel product={item} onPress={() => router.push(`/product/${item.id}`)} />
          )}
          ListEmptyComponent={
            <Text style={styles.leegTekst}>
              Geen producten gevonden. Probeer een andere zoekterm of blader door de categorieën.
            </Text>
          }
        />
      ) : (
        /* --------------------------------------------- winkelstructuur */
        <>
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsRij}>
              {HOOFDCATEGORIEEN.map((h) => {
                const aan = h.slug === actieveSlug;
                return (
                  <Pressable
                    key={h.slug}
                    style={[styles.chip, aan && styles.chipAan]}
                    onPress={() => setActieveSlug(h.slug)}>
                    <Text style={[styles.chipTekst, aan && styles.chipTekstAan]}>{h.naam}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <ScrollView
            contentContainerStyle={{ paddingBottom: 140 }}
            showsVerticalScrollIndicator={false}>
            {fotoSubs.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tegelRij}>
                {fotoSubs.map((s) => (
                  <CategorieTegel
                    key={s.slug}
                    naam={s.naam}
                    foto={s.foto}
                    breedte={150}
                    onPress={() => router.push(`/lijst/${s.slug}`)}
                  />
                ))}
              </ScrollView>
            )}

            <View style={styles.lijstGroep}>
              <LijstRij naam="Nieuw" onPress={() => router.push('/lijst/nieuw')} />
              <LijstRij naam="Sale" onPress={() => router.push('/lijst/on-sale')} />
            </View>

            <View style={styles.lijstGroep}>
              <LijstRij
                naam={`Alle ${actief.naam.toLowerCase()}`}
                onPress={() => router.push(`/categorie/${actief.slug}`)}
              />
              {actief.subs.map((s) => (
                <LijstRij
                  key={s.slug}
                  naam={s.naam}
                  onPress={() => router.push(`/lijst/${s.slug}`)}
                />
              ))}
            </View>
          </ScrollView>
        </>
      )}

      {/* -------------------------------------------- zwevende zoekbalk */}
      <View style={[styles.zoekWrap, { bottom: balkOnder }]}>
        <View style={styles.zoekBalk}>
          <Ionicons name="search-outline" size={20} color={EkoColors.primaryDark} />
          <TextInput
            ref={veld}
            style={styles.zoekVeld}
            placeholder="Zoeken"
            placeholderTextColor={EkoColors.paragraphGray}
            value={zoek}
            onChangeText={setZoek}
            onFocus={() => setFocus(true)}
            returnKeyType="search"
            onSubmitEditing={() => bewaarZoekterm(zoek)}
          />
          {aanHetZoeken ? (
            <Pressable hitSlop={10} onPress={() => setZoek('')}>
              <Ionicons name="close-circle" size={20} color={EkoColors.darkGray} />
            </Pressable>
          ) : (
            <Ionicons name="scan-outline" size={20} color={EkoColors.primaryDark} />
          )}
        </View>

        {focus && (
          <Pressable
            style={styles.sluitKnop}
            accessibilityLabel="Zoeken sluiten"
            onPress={sluitZoeken}>
            <Ionicons name="close" size={22} color={EkoColors.primaryDark} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

function LijstRij({ naam, onPress }: { naam: string; onPress: () => void }) {
  return (
    <Pressable style={styles.lijstRij} onPress={onPress}>
      <Text style={styles.lijstRijTekst}>{naam}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scherm: {
    flex: 1,
    backgroundColor: EkoColors.white,
  },

  /* ZOEKGESCHIEDENIS */
  geschiedenis: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 140,
  },
  geschiedenisKop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
  },
  geschiedenisTitel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 24,
    letterSpacing: 0.3,
    color: EkoColors.primaryDark,
  },
  wissen: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 15,
    textDecorationLine: 'underline',
    color: EkoColors.primaryDark,
  },
  termRij: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: EkoColors.lightSteelBlue,
  },
  termTekstVlak: {
    flex: 1,
    paddingVertical: 20,
  },
  termTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 17,
    color: EkoColors.primaryDark,
  },

  /* CATEGORIEËN */
  chipsRij: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: EkoRadius.pill,
    borderWidth: 1,
    borderColor: EkoColors.lightSteelBlue,
    backgroundColor: EkoColors.white,
  },
  chipAan: {
    backgroundColor: EkoColors.primaryDark,
    borderColor: EkoColors.primaryDark,
  },
  chipTekst: {
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 15,
    color: EkoColors.primaryDark,
  },
  chipTekstAan: {
    color: EkoColors.white,
  },
  tegelRij: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
    gap: 14,
  },
  lijstGroep: {
    marginTop: 28,
    paddingHorizontal: 16,
  },
  lijstRij: {
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: EkoColors.lightSteelBlue,
  },
  lijstRijTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 17,
    color: EkoColors.primaryDark,
  },

  /* RESULTATEN */
  zoekKop: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    color: EkoColors.paragraphGray,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  leegTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    lineHeight: 22,
    color: EkoColors.paragraphGray,
    paddingHorizontal: 16,
  },

  /* ZOEKBALK */
  zoekWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  zoekBalk: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: EkoColors.white,
    borderRadius: EkoRadius.pill,
    paddingHorizontal: 18,
    height: 56,
    shadowColor: EkoColors.primaryDark,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  zoekVeld: {
    flex: 1,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 16,
    color: EkoColors.primaryDark,
    paddingVertical: 0,
  },
  sluitKnop: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: EkoColors.white,
    shadowColor: EkoColors.primaryDark,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
});
