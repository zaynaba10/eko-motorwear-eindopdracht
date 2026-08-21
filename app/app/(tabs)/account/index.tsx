import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Groep, IconNaam, MenuRij } from '@/components/account-ui';
import { EkoColors, EkoFonts, EkoRadius } from '@/constants/eko-theme';
import { useBestellingen } from '@/lib/bestellingen';
import { uitloggen, useGebruiker } from '@/lib/auth';
import { useVerlanglijst } from '@/lib/verlanglijst';
import { actieveVoucher, useMandStaat } from '@/lib/winkelmand';

const DOEL = 750;

type Item = { icoon: IconNaam; label: string; pad?: string; extra?: string };

/** Bouwt het menu op met de actuele aantallen uit verlanglijst, mand en bestellingen. */
function maakGroepen(tellers: {
  bestellingen: number;
  verlanglijst: number;
  mand: number;
  voucher?: string;
}): Item[][] {
  return [
  [
    {
      icoon: 'cube-outline',
      label: 'Mijn bestellingen',
      pad: '/account/bestellingen',
      extra: tellers.bestellingen > 0
        ? `${tellers.bestellingen} ${tellers.bestellingen === 1 ? 'bestelling' : 'bestellingen'}`
        : 'Nog geen bestellingen',
    },
    { icoon: 'return-down-back-outline', label: 'Retouren', pad: '/account/retouren' },
    {
      icoon: 'heart-outline',
      label: 'Verlanglijst',
      pad: '/account/verlanglijst',
      extra: tellers.verlanglijst > 0
        ? `${tellers.verlanglijst} ${tellers.verlanglijst === 1 ? 'artikel' : 'artikelen'} bewaard`
        : 'Nog niets bewaard',
    },
    {
      icoon: 'pricetag-outline',
      label: 'Kortingscodes',
      pad: '/account/kortingscodes',
      extra: tellers.voucher ? `${tellers.voucher} actief` : undefined,
    },
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
}

export default function AccountHub() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  /* Het dashboard leest mee met de gedeelde staat, dus het volgt elke wijziging. */
  const gebruiker = useGebruiker();
  const bestellingen = useBestellingen();
  const verlanglijst = useVerlanglijst();
  const { items } = useMandStaat();
  const voucher = actieveVoucher();

  const punten = Math.floor(bestellingen.reduce((som, b) => som + b.totaal, 0));
  const deel = Math.min(punten / DOEL, 1);

  const GROEPEN = maakGroepen({
    bestellingen: bestellingen.length,
    verlanglijst: verlanglijst.length,
    mand: items.reduce((som, i) => som + i.aantal, 0),
    voucher: voucher?.code,
  });

  /* Niet ingelogd: eerst aanmelden of een account aanmaken. */
  if (!gebruiker) {
    return (
      <View style={styles.scherm}>
        <View style={[styles.topbalk, { paddingTop: insets.top + 8 }]}>
          <View style={styles.rond} />
          <Text style={styles.welkom}>Mijn account</Text>
          <Pressable
            style={styles.rond}
            hitSlop={10}
            accessibilityLabel="Klantenservice"
            onPress={() => router.push('/account/klantenservice')}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={EkoColors.primaryDark} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          <View style={styles.welkomVlak}>
            <Ionicons name="person-circle-outline" size={54} color={EkoColors.white} />
            <Text style={styles.welkomTitel}>Welkom bij EKO Motorwear</Text>
            <Text style={styles.welkomTekst}>
              Log in of maak een account aan om je verlanglijst, bestellingen en gegevens te
              bewaren.
            </Text>
            <Pressable style={styles.welkomKnop} onPress={() => router.push('/inloggen')}>
              <Text style={styles.welkomKnopTekst}>Inloggen of registreren</Text>
            </Pressable>
          </View>

          <Groep>
            <MenuRij
              icoon="headset-outline"
              label="Klantenservice"
              onPress={() => router.push('/account/klantenservice')}
            />
            <MenuRij
              icoon="time-outline"
              label="Winkel en openingsuren"
              onPress={() => router.push('/account/winkel')}
            />
            <MenuRij
              icoon="information-circle-outline"
              label="Privacy en voorwaarden"
              onPress={() => router.push('/account/privacy')}
            />
          </Groep>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.scherm}>
      <View style={[styles.topbalk, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.rond} hitSlop={10} accessibilityLabel="Scan je pas">
          <Ionicons name="qr-code-outline" size={18} color={EkoColors.primaryDark} />
        </Pressable>
        <Text style={styles.welkom}>Welkom, {gebruiker.voornaam}</Text>
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
            <Text style={styles.punten}>{punten} punten</Text>
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
          <MenuRij
            icoon="log-out-outline"
            label="Uitloggen"
            pijl={false}
            onPress={() =>
              Alert.alert(
                'Weet je zeker dat je wilt uitloggen?',
                'Je moet opnieuw inloggen voor toegang tot je profiel, bestellingen en voorkeuren.',
                [
                  { text: 'Annuleren', style: 'cancel' },
                  { text: 'Uitloggen', style: 'destructive', onPress: uitloggen },
                ]
              )
            }
          />
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

  welkomVlak: {
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 34,
    paddingHorizontal: 22,
    borderRadius: 20,
    backgroundColor: EkoColors.primaryDark,
    alignItems: 'center',
  },
  welkomTitel: {
    marginTop: 12,
    fontFamily: EkoFonts.headingBold,
    fontSize: 22,
    letterSpacing: 0.5,
    color: EkoColors.white,
    textAlign: 'center',
  },
  welkomTekst: {
    marginTop: 8,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    lineHeight: 21,
    color: EkoColors.lightSteelBlue,
    textAlign: 'center',
  },
  welkomKnop: {
    marginTop: 20,
    alignSelf: 'stretch',
    backgroundColor: EkoColors.primary,
    paddingVertical: 15,
    alignItems: 'center',
  },
  welkomKnopTekst: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 15,
    color: EkoColors.white,
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
