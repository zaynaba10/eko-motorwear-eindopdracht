import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { actieveVoucher, zetVoucher } from '@/lib/winkelmand';

/** Kortingscode invoeren, vanuit het blok Voucher in de winkelmand. */
export default function VoucherScherm() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [code, setCode] = useState('');
  const [fout, setFout] = useState<string | null>(null);

  function toevoegen() {
    if (zetVoucher(code)) {
      setFout(null);
      router.back();
    } else {
      setFout('Deze kortingscode kennen we niet. Controleer de code en probeer opnieuw.');
    }
  }

  const huidige = actieveVoucher();

  return (
    <View style={styles.scherm}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.kop, { paddingTop: insets.top + 6 }]}>
        <Pressable style={styles.rondeKnop} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={EkoColors.primaryDark} />
        </Pressable>
        <Text style={styles.kopTitel}>Vouchers</Text>
        <View style={styles.rondeKnop} />
      </View>

      <View style={styles.inhoud}>
        {huidige && (
          <Text style={styles.actief}>
            Actieve code: {huidige.code} — {huidige.procent}% korting
          </Text>
        )}

        <TextInput
          style={styles.veld}
          placeholder="Code"
          placeholderTextColor={EkoColors.paragraphGray}
          autoCapitalize="characters"
          autoCorrect={false}
          value={code}
          onChangeText={(t) => {
            setCode(t);
            setFout(null);
          }}
          returnKeyType="done"
          onSubmitEditing={toevoegen}
        />

        {fout && <Text style={styles.fout}>{fout}</Text>}

        <Pressable style={styles.knop} onPress={toevoegen}>
          <Text style={styles.knopTekst}>Toevoegen</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scherm: {
    flex: 1,
    backgroundColor: EkoColors.white,
  },
  kop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  rondeKnop: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: EkoColors.white,
  },
  kopTitel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 22,
    letterSpacing: 0.5,
    color: EkoColors.primaryDark,
  },
  inhoud: {
    paddingHorizontal: 16,
    paddingTop: 22,
  },
  actief: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.primary,
    marginBottom: 16,
  },
  veld: {
    borderWidth: 1,
    borderColor: EkoColors.lightSteelBlue,
    paddingHorizontal: 18,
    height: 66,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 17,
    color: EkoColors.primaryDark,
  },
  fout: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    color: EkoColors.primary,
    marginTop: 10,
  },
  knop: {
    marginTop: 16,
    backgroundColor: EkoColors.primaryDark,
    paddingVertical: 20,
    alignItems: 'center',
  },
  knopTekst: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 16,
    color: EkoColors.white,
  },
});
