import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ProductCard, ProductCardData } from '@/components/product-card';
import { EkoColors, EkoFonts, EkoRadius } from '@/constants/eko-theme';
import { fetchWebflowProducts } from '@/lib/webflow-products';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GALLERY_GAP = 8;
const GALLERY_ITEM_SIZE = (SCREEN_WIDTH - 32 - GALLERY_GAP) / 2;

const GALLERY_IMAGES = [
  'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def/6a7260ea77f40c20eaaa7fb9_harley-davidson-zGzXsJUBQfs-unsplash.webp',
  'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def/6a7260ea77f40c20eaaa7fc2_roberto-nickson-eXV74Ia7Log-unsplash.webp',
  'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def/6a7260ea77f40c20eaaa7fbb_mike-kienle-2jCCzw83jGU-unsplash.webp',
  'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def/6a7260ea77f40c20eaaa7fa8_them-snapshots-GP5HzcrKciI-unsplash.webp',
  'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def/6a7260ea77f40c20eaaa7fb7_zac-wolff-Ptx8G07I6xI-unsplash.webp',
  'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def/6a7260ea77f40c20eaaa7fbf_joe-neric-EGzkhZyFRX4-unsplash.webp',
];

const HERO_IMAGE =
  'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def/6a7260ea77f40c20eaaa7fa4_harley-davidson-eeTJKC_wz34-unsplash.webp';
const ABOUT_IMAGE =
  'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def/6a7260ea77f40c20eaaa7fba_harley-davidson-QD6GvrDFPAA-unsplash.webp';
const CTA_IMAGE =
  'https://cdn.prod.website-files.com/6a7260e877f40c20eaaa7def/6a7260ea77f40c20eaaa7fb5_roberto-nickson-D1F7OtbbvKc-unsplash.webp';

function PrimaryButton({
  label,
  onPress,
  dark,
}: {
  label: string;
  onPress?: () => void;
  dark?: boolean;
}) {
  return (
    <Pressable
      style={[styles.button, dark ? styles.buttonDark : styles.buttonPrimary]}
      onPress={onPress}>
      <Text style={[styles.buttonText, dark ? styles.buttonTextLight : styles.buttonTextDark]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  useEffect(() => {
    fetchWebflowProducts()
      .then((items) => {
        setProducts(items.slice(0, 6).map((item) => item.card));
        setProductsLoading(false);
      })
      .catch((err) => {
        setProductsError(err.message);
        setProductsLoading(false);
      });
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      {/* HERO */}
      <View style={styles.hero}>
        <Image source={{ uri: HERO_IMAGE }} style={StyleSheet.absoluteFill} contentFit="cover" />
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Motorkledij die écht past</Text>
          <Text style={styles.heroDescription}>
            Van XXS tot 8XL: bij EKO Motorwear vind je motorkledij die perfect past. Ons huismerk
            G&F Motorwear wordt elk jaar samengesteld met een team van ervaren motorrijders, voor
            de beste prijs-kwaliteitverhouding.
          </Text>
          <PrimaryButton label="Ontdek de collectie" />
        </View>
      </View>

      {/* CONTACTBALK */}
      <View style={styles.contactBar}>
        <Pressable
          style={styles.contactRow}
          onPress={() => Linking.openURL('tel:0345711281')}>
          <Ionicons name="call-outline" size={20} color={EkoColors.primary} />
          <Text style={styles.contactText}>03 457 11 28</Text>
        </Pressable>
        <View style={styles.contactRow}>
          <Ionicons name="location-outline" size={20} color={EkoColors.primary} />
          <Text style={styles.contactText}>Singel 4CB-2550 Kontich</Text>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="cube-outline" size={20} color={EkoColors.primary} />
          <Text style={styles.contactText}>Gratis verzending vanaf €40</Text>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="refresh-outline" size={20} color={EkoColors.primary} />
          <Text style={styles.contactText}>Retour aanvragen</Text>
        </View>
      </View>

      {/* PERSOONLIJK ADVIES DAT HET VERSCHIL MAAKT */}
      <View style={styles.section}>
        <Image source={{ uri: ABOUT_IMAGE }} style={styles.aboutImage} contentFit="cover" />
        <Text style={styles.h2}>Persoonlijk advies dat het verschil maakt</Text>
        <Text style={styles.body}>
          Iedere motorrijder is anders. Of je nu dagelijks met de scooter door de stad rijdt of
          lange motorreizen door Europa maakt — onze medewerkers zijn zelf gepassioneerde
          motorrijders. Ze luisteren naar jouw wensen, geven eerlijk en onafhankelijk advies en
          helpen je de uitrusting kiezen die écht bij jou past.
        </Text>
        <PrimaryButton label="Onze visie" />
      </View>

      {/* SHOWROOM VAN 3.500 M² */}
      <View style={[styles.section, styles.sectionDark]}>
        <Text style={[styles.h2, styles.textWhite]}>Ontdek onze showroom van 3.500 m²</Text>
        <Text style={[styles.body, styles.textWhiteMuted]}>
          Voel materialen, pas verschillende modellen en vergelijk topmerken zoals REV&apos;IT!,
          Rukka, Schuberth, Alpinestars, Scorpion en vele andere. Alles onder één dak in Kontich.
        </Text>
        <PrimaryButton label="Onze winkel" dark />
      </View>

      {/* ONS EIGEN HUISMERK: G&F */}
      <View style={styles.section}>
        <Text style={styles.h2}>Meer dan 30 jaar ervaring — ons eigen huismerk G&F</Text>
        <Text style={styles.body}>
          Uitstekende prijs-kwaliteitverhouding, een ruime keuze aan maten van XXS tot 8XL en
          meerdere beenlengtes. Zo vindt iedere motorrijder een outfit die perfect zit en
          optimale bescherming biedt.
        </Text>
        <PrimaryButton label="Bekijk G&F" />
      </View>

      {/* QUOTE BANNER */}
      <View style={[styles.section, styles.quoteSection]}>
        <Text style={[styles.h2, styles.textCenter]}>
          Van dagelijkse pendel tot avontuur door Europa — bij EKO vind je alles voor élke rit,
          van topmerken tot ons eigen huismerk G&F.
        </Text>
        <View style={{ alignItems: 'center', marginTop: 8 }}>
          <PrimaryButton label="Bekijk onze merken" />
        </View>
      </View>

      {/* GALERIJ */}
      <View style={styles.section}>
        <View style={styles.galleryGrid}>
          {GALLERY_IMAGES.map((uri) => (
            <Image
              key={uri}
              source={{ uri }}
              style={[styles.galleryImage, { width: GALLERY_ITEM_SIZE, height: GALLERY_ITEM_SIZE }]}
              contentFit="cover"
            />
          ))}
        </View>
      </View>

      {/* CTA BANNER */}
      <View style={styles.ctaBanner}>
        <Image source={{ uri: CTA_IMAGE }} style={StyleSheet.absoluteFill} contentFit="cover" />
        <View style={styles.heroOverlay} />
        <View style={styles.ctaContent}>
          <Text style={[styles.h2, styles.textWhite, styles.textCenter]}>
            Klaar om met vertrouwen de weg op te gaan?
          </Text>
          <Text style={[styles.body, styles.textWhiteMuted, styles.textCenter]}>
            Kom langs in onze showroom in Kontich, geniet van een drankje en ontdek de passie van
            ons team.
          </Text>
          <PrimaryButton label="Plan je bezoek" />
        </View>
      </View>

      {/* UITGELICHT */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.h2}>Uitgelicht</Text>
            <Text style={styles.body}>
              Een selectie uit ons ruime aanbod motorkleding, helmen en accessoires van de beste
              merken.
            </Text>
          </View>
        </View>

        {productsLoading && <Text style={styles.body}>Producten laden…</Text>}
        {productsError && <Text style={styles.errorText}>Fout: {productsError}</Text>}
        {!productsLoading && !productsError && (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ProductCard product={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: 14 }} />}
            contentContainerStyle={{ paddingVertical: 4 }}
          />
        )}

        <View style={{ marginTop: 20, alignItems: 'flex-start' }}>
          <PrimaryButton label="Bekijk alles" />
        </View>
      </View>

      {/* CONTACT / KOM LANGS */}
      <View style={[styles.section, styles.sectionDark]}>
        <Text style={[styles.h3, styles.textWhite]}>Kom langs</Text>
        <Text style={[styles.body, styles.textWhiteMuted]}>Singel 4C, B-2550 Kontich</Text>

        <Text style={[styles.h3, styles.textWhite, { marginTop: 20 }]}>Contacteer ons</Text>
        <Pressable onPress={() => Linking.openURL('mailto:vraag@eko-motorwear.be')}>
          <Text style={[styles.body, styles.textWhiteMuted]}>vraag@eko-motorwear.be</Text>
        </Pressable>
        <Pressable onPress={() => Linking.openURL('tel:0345711281')}>
          <Text style={[styles.body, styles.textWhiteMuted]}>(0032) 03/457 11 28</Text>
        </Pressable>

        <View style={styles.socialRow}>
          <Ionicons name="logo-facebook" size={22} color={EkoColors.primary} />
          <Ionicons name="logo-instagram" size={22} color={EkoColors.primary} />
          <Ionicons name="logo-twitter" size={22} color={EkoColors.primary} />
        </View>
      </View>

      <View style={styles.footerNote}>
        <Text style={styles.footerText}>© 2026 EKO Motorwear — Algemene voorwaarden</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: EkoColors.white,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // HERO
  hero: {
    minHeight: 480,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  heroContent: {
    paddingHorizontal: 20,
    paddingVertical: 60,
    alignItems: 'center',
  },
  heroTitle: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 34,
    letterSpacing: 1,
    lineHeight: 40,
    color: EkoColors.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  heroDescription: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    lineHeight: 22,
    color: EkoColors.white,
    textAlign: 'center',
    marginBottom: 24,
  },

  // BUTTON
  button: {
    borderRadius: EkoRadius.pill,
    paddingVertical: 14,
    paddingHorizontal: 26,
  },
  buttonPrimary: {
    backgroundColor: EkoColors.primary,
  },
  buttonDark: {
    backgroundColor: EkoColors.primaryDark,
  },
  buttonText: {
    fontFamily: EkoFonts.headingMedium,
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  buttonTextDark: {
    color: EkoColors.primaryDark,
  },
  buttonTextLight: {
    color: EkoColors.white,
  },

  // CONTACTBALK
  contactBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: EkoColors.lightGray,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 14,
    color: EkoColors.primaryDark,
  },

  // SECTIONS
  section: {
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  sectionDark: {
    backgroundColor: EkoColors.primaryDark,
  },
  quoteSection: {
    backgroundColor: EkoColors.lightGray,
    alignItems: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  h2: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 26,
    letterSpacing: 0.5,
    lineHeight: 32,
    color: EkoColors.primaryDark,
    marginBottom: 12,
  },
  h3: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 20,
    letterSpacing: 0.5,
    lineHeight: 26,
    color: EkoColors.primaryDark,
    marginBottom: 8,
  },
  body: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    lineHeight: 22,
    color: EkoColors.paragraphGray,
    marginBottom: 20,
  },
  textWhite: {
    color: EkoColors.white,
  },
  textWhiteMuted: {
    color: 'rgba(255,255,255,0.75)',
  },
  textCenter: {
    textAlign: 'center',
  },
  errorText: {
    fontFamily: EkoFonts.bodyRegular,
    color: EkoColors.primary,
  },

  aboutImage: {
    width: '100%',
    height: 220,
    borderRadius: EkoRadius.card,
    marginBottom: 20,
  },

  // GALLERY
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GALLERY_GAP,
  },
  galleryImage: {
    borderRadius: EkoRadius.card,
  },

  // CTA BANNER
  ctaBanner: {
    minHeight: 320,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ctaContent: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
    gap: 4,
  },

  // SOCIAL
  socialRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 24,
  },

  // FOOTER
  footerNote: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: EkoColors.primaryDark,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
});
