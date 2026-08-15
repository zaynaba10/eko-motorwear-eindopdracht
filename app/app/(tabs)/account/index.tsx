import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Groep, IconNaam, MenuRij } from '@/components/account-ui';
import { EkoColors, EkoFonts, EkoRadius } from '@/constants/eko-theme';

const NAAM = 'zaynaba';
const PUNTEN = 0;
const DOEL = 750;

type Item = { icoon: IconNaam; label: string; pad?: string; extra?: string };

const GROEPEN: Item[][] = [
  [
    { icoon: 'cube-outline', label: 'Mijn bestellingen', pad: '/account/bestellingen' },
    { icoon: 'return-down-back-outline', label: 'Retouren', pad: '/account/retouren' },
    { icoon: 'heart-outline', label: 'Verlanglijst', pad: '/account/verlanglijst' },
    { icoon: 'pricetag-outline', label: 'Kortingscodes', pad: '/account/kortingscodes' },
  ],
  [
    { icoon: 'shield-checkmark-outline', label: 'EKO Club', pad: '/account/club' },
    { icoon: 'person-outline', label: 'Mijn gegevens', pad: '/account/gegevens' },
    { icoon: 'options-outline', label: 'Instellingen', pad: '/account/instellingen' },
  ],
  [
    { icoon: 'headset-outline', label: 'Klantenservice', pad: '/account/klantenservice' },
    { icoon: 'time-outline', label: 'Winkel en openingsuren', pad: '/account/winkel' },
  ],
  [
    { icoon: 'information-circle-outline', label: 'Privacy en voorwaarden', pad: '/account/privacy' },
    { icoon: 'star-outline', label: 'Beoordeel onze app', extra: 'Versie 1.0.0' },
  ],
];

export default function AccountHub() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const deel = Math.min(PUNTEN / DOEL, 1);

  return (
    <View style={styles.scherm}>
      <View style={[styles.topbalk, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.rond} hitSlop={10} accessibilityLabel="Scan je pas">
          <Ionicons name="qr-code-outline" size={18} color={EkoColors.primaryDark} />
        </Pressable>
        <Text style={styles.welkom}>Welkom, {NAAM}</Text>
        <Pressable
          style={styles.rond}
          hitSlop={10}
          accessibilityLabel="Klantenservice"
          onPress={() => router.push('/account/klantenservice')}>
          <Ionicons name="chatbubble-ellipses-outline" size={18} color={EkoColors.primaryDark} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.kaart}>
          <Text style={styles.kaartTitel}>EKO Club</Text>
          <View style={styles.balkRij}>
            <Text style={styles.punten}>{PUNTEN} punten</Text>
            <Text style={styles.punten}>{DOEL} punten</Text>
          </View>
          <View style={styles.balk}>
            <View style={[styles.balkVol, { flex: deel, minWidth: deel > 0 ? 4 : 0 }]} />
          </View>
          <Pressable style={styles.pasKnop} onPress={() => router.push('/account/club')}>
            <Text style={styles.pasKnopTekst}>Bekijk je pas</Text>
          </Pressable>
        </View>

        {GROEPEN.map((groep, i) => (
          <Groep key={i}>
            {groep.map((item) => (
              <MenuRij
                key={item.label}
                icoon={item.icoon}
                label={item.label}
                extra={item.extra}
                pijl={!!item.pad}
                onPress={item.pad ? () => router.push(item.pad as never) : undefined}
              />
            ))}
          </Groep>
        ))}

        <Groep>
          <MenuRij icoon="log-out-outline" label="Uitloggen" pijl={false} />
        </Groep>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scherm: { flex: 1, backgroundColor: EkoColors.white },

  topbalk: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: EkoColors.white,
  },
  rond: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: EkoColors.lightGray,
  },
  welkom: {
    flex: 1,
    textAlign: 'center',
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.primaryDark,
  },

  kaart: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 20,
    borderRadius: 20,
    backgroundColor: EkoColors.primaryDark,
  },
  kaartTitel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 26,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: EkoColors.white,
    marginBottom: 16,
  },
  balkRij: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  punten: { fontFamily: EkoFonts.bodyRegular, fontSize: 12, color: EkoColors.lightSteelBlue },
  balk: { flexDirection: 'row', height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.25)', overflow: 'hidden' },
  balkVol: { borderRadius: 2, backgroundColor: EkoColors.primary },
  pasKnop: {
    marginTop: 18,
    paddingVertical: 13,
    borderRadius: EkoRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
  },
  pasKnopTekst: {
    fontFamily: EkoFonts.headingMedium,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: EkoColors.white,
  },
});
