import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BlogOverzicht } from '@/components/paginas/blog-overzicht';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';

/**
 * Inspiratiescherm: het blogoverzicht van de website. De inhoud zit in
 * BlogOverzicht, zodat de home-pagina (keuzelijst "Blog") en dit scherm
 * exact dezelfde opbouw tonen.
 */
export default function BlogScherm() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.scherm}>
      <View style={[styles.kop, { paddingTop: insets.top + 6 }]}>
        <Pressable style={styles.rondeKnop} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={EkoColors.primaryDark} />
        </Pressable>
        <Text style={styles.kopTitel}>Inspiratie</Text>
        <View style={styles.rondeKnop} />
      </View>

      <BlogOverzicht />
    </View>
  );
}

const styles = StyleSheet.create({
  scherm: { flex: 1, backgroundColor: EkoColors.white },
  kop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 10,
    gap: 8,
  },
  rondeKnop: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: EkoColors.lightGray,
  },
  kopTitel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: EkoFonts.headingBold,
    fontSize: 17,
    letterSpacing: 0.3,
    color: EkoColors.primaryDark,
  },
});
