import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { MERKEN_MET_LOGO } from '@/lib/merken';

/**
 * Alle merken die EKO Motorwear voert, met hun logo. Tik op een merk om de
 * producten van dat merk te bekijken.
 */

const { width: BREEDTE } = Dimensions.get('window');
const RAND = 16;
const KOLOM = (BREEDTE - RAND * 2 - 24) / 3;

export default function MerkenScherm() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.scherm}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.kop, { paddingTop: insets.top + 6 }]}>
        <Pressable style={styles.rondeKnop} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={EkoColors.primaryDark} />
        </Pressable>
        <View style={styles.kopMidden}>
          <Text style={styles.kopTitel}>Onze merken</Text>
          <Text style={styles.kopAantal}>{MERKEN_MET_LOGO.length} merken</Text>
        </View>
        <View style={styles.rondeKnop} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.raster}>
          {MERKEN_MET_LOGO.map((m) => (
            <Pressable
              key={m.naam}
              style={styles.tegel}
              accessibilityLabel={`Producten van ${m.naam}`}
              onPress={() => router.push(`/zoeken/${encodeURIComponent(m.naam)}`)}>
              <View style={styles.logoVlak}>
                <Image source={{ uri: m.logo }} style={styles.logo} contentFit="contain" />
              </View>
              <Text style={styles.naam} numberOfLines={1}>
                {m.naam}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
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
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: EkoColors.lightGray,
  },
  kopMidden: { flex: 1, alignItems: 'center' },
  kopTitel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 17,
    letterSpacing: 0.3,
    color: EkoColors.primaryDark,
  },
  kopAantal: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 12,
    color: EkoColors.paragraphGray,
    marginTop: 2,
  },
  raster: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: RAND,
    paddingTop: 6,
    gap: 12,
  },
  tegel: { width: KOLOM },
  logoVlak: {
    height: KOLOM * 0.66,
    backgroundColor: '#F4F4F2',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  logo: { width: '100%', height: '100%' },
  naam: {
    marginTop: 6,
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 12,
    textAlign: 'center',
    color: EkoColors.primaryDark,
  },
});
