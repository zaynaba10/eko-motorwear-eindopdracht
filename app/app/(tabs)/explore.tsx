import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
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

/**
 * Shop-tabblad in warenhuisstijl: bovenaan wisselknoppen per hoofdcategorie,
 * daaronder fototegels en de volledige lijst subcategorieën van de gekozen
 * hoofdcategorie, met onderaan een zwevende zoekbalk. Dezelfde structuur als
 * de winkelpagina op de website (winkel → hoofdcategorie → subcategorie).
 */
export default function ShopScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [actieveSlug, setActieveSlug] = useState(HOOFDCATEGORIEEN[0].slug);
  const [zoek, setZoek] = useState('');
  const [producten, setProducten] = useState<ProductCardData[]>([]);

  useEffect(() => {
    fetchWebflowProducts()
      .then((items) => setProducten(items.map((i) => i.card)))
      .catch(() => {});
  }, []);

  const actief = HOOFDCATEGORIEEN.find((h) => h.slug === actieveSlug) ?? HOOFDCATEGORIEEN[0];
  const fotoSubs = actief.subs.filter((s) => s.foto).slice(0, 5);

  const zoekResultaten = useMemo(() => {
    const q = zoek.trim().toLowerCase();
    if (!q) return [];
    return producten.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.merk || '').toLowerCase().includes(q)
    );
  }, [zoek, producten]);

  const aanHetZoeken = zoek.trim().length > 0;

  return (
    <View style={[styles.scherm, { paddingTop: insets.top + 8 }]}>
      {/* Wisselknoppen per hoofdcategorie */}
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

      {aanHetZoeken ? (
        /* Zoekresultaten over de volledige collectie */
        <FlatList
          data={zoekResultaten}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 16, paddingHorizontal: 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
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
            <Text style={styles.leegTekst}>Geen producten gevonden. Probeer een andere zoekterm.</Text>
          }
        />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          {/* Fototegels van de gekozen hoofdcategorie */}
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

          {/* Vaste ingangen */}
          <View style={styles.lijstGroep}>
            <LijstRij naam="Nieuw" onPress={() => router.push('/lijst/nieuw')} />
            <LijstRij naam="Sale" onPress={() => router.push('/lijst/on-sale')} />
          </View>

          {/* Alle subcategorieën van de gekozen hoofdcategorie */}
          <View style={styles.lijstGroep}>
            <LijstRij
              naam={`Alle ${actief.naam.toLowerCase()}`}
              onPress={() => router.push(`/categorie/${actief.slug}`)}
            />
            {actief.subs.map((s) => (
              <LijstRij key={s.slug} naam={s.naam} onPress={() => router.push(`/lijst/${s.slug}`)} />
            ))}
          </View>
        </ScrollView>
      )}

      {/* Zwevende zoekbalk boven de tabbalk */}
      <View style={styles.zoekWrap}>
        <View style={styles.zoekBalk}>
          <Ionicons name="search-outline" size={20} color={EkoColors.primaryDark} />
          <TextInput
            style={styles.zoekVeld}
            placeholder="Zoeken"
            placeholderTextColor={EkoColors.paragraphGray}
            value={zoek}
            onChangeText={setZoek}
            returnKeyType="search"
          />
          {aanHetZoeken && (
            <Pressable hitSlop={10} onPress={() => setZoek('')}>
              <Ionicons name="close-circle" size={20} color={EkoColors.darkGray} />
            </Pressable>
          )}
        </View>
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
  zoekWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 10,
  },
  zoekBalk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: EkoColors.white,
    borderRadius: EkoRadius.pill,
    paddingHorizontal: 18,
    height: 52,
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
    color: EkoColors.paragraphGray,
    paddingHorizontal: 16,
  },
});
