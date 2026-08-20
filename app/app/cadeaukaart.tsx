import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EkoColors, EkoFonts } from '@/constants/eko-theme';

/** Cadeaukaart verzilveren, vanuit het blok Cadeaukaart in de winkelmand. */
export default function CadeaukaartScherm() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [code, setCode] = useState('');
  const [pincode, setPincode] = useState('');
  const [bericht, setBericht] = useState<string | null>(null);

  function toevoegen() {
    if (!code.trim() || !pincode.trim()) {
      setBericht('Vul zowel de code als de pincode van je cadeaukaart in.');
      return;
    }
    setBericht('We konden deze cadeaukaart niet terugvinden. Kom langs in de winkel om hem te laten controleren.');
  }

  return (
    <View style={styles.scherm}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.kop, { paddingTop: insets.top + 6 }]}>
        <Pressable style={styles.rondeKnop} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={EkoColors.primaryDark} />
        </Pressable>
        <Text style={styles.kopTitel}>Cadeaukaart</Text>
        <View style={styles.rondeKnop} />
      </View>

      <View style={styles.inhoud}>
        <Text style={styles.uitleg}>
          Voer hier de code in van je EKO Motorwear cadeaukaart. Andere cadeaukaarten aanvaarden we
          enkel in onze winkel in Kontich.
        </Text>

        <TextInput
          style={styles.veld}
          placeholder="Code*"
          placeholderTextColor={EkoColors.paragraphGray}
          autoCapitalize="characters"
          autoCorrect={false}
          value={code}
          onChangeText={(t) => {
            setCode(t);
            setBericht(null);
          }}
        />

        <TextInput
          style={[styles.veld, styles.veldTweede]}
          placeholder="Pincode*"
          placeholderTextColor={EkoColors.paragraphGray}
          keyboardType="number-pad"
          secureTextEntry
          value={pincode}
          onChangeText={(t) => {
            setPincode(t);
            setBericht(null);
          }}
        />

        {bericht && <Text style={styles.bericht}>{bericht}</Text>}

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
  },
  kopTitel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 22,
    letterSpacing: 0.5,
    color: EkoColors.primaryDark,
  },
  inhoud: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  uitleg: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 16,
    lineHeight: 24,
    color: EkoColors.primaryDark,
    marginBottom: 22,
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
  veldTweede: {
    marginTop: 16,
  },
  bericht: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    color: EkoColors.primary,
    marginTop: 12,
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
