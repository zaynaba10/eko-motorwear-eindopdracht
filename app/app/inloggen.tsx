import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { DEMO, Gebruiker, kentEmail, login, registreer, wachtwoordFout } from '@/lib/auth';

/**
 * Inloggen of registreren, in drie stappen: e-mailadres → wachtwoord →
 * (bij een nieuw account) je gegevens. Dummygegevens, zoals de opdracht toelaat.
 */

type Stap = 'email' | 'wachtwoord' | 'gegevens';

const AANHEFFEN = ['Mevr.', 'Dhr.', 'Anders'];

export default function InloggenScherm() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [stap, setStap] = useState<Stap>('email');
  const [bestaat, setBestaat] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');
  const [toonWachtwoord, setToonWachtwoord] = useState(false);

  const [aanhef, setAanhef] = useState('');
  const [voornaam, setVoornaam] = useState('');
  const [tussenvoegsel, setTussenvoegsel] = useState('');
  const [achternaam, setAchternaam] = useState('');
  const [geboortedatum, setGeboortedatum] = useState('');
  const [telefoon, setTelefoon] = useState('');
  const [postcode, setPostcode] = useState('');
  const [plaats, setPlaats] = useState('');
  const [straat, setStraat] = useState('');
  const [huisnummer, setHuisnummer] = useState('');
  const [bus, setBus] = useState('');

  const geldigEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  function verderMetEmail() {
    if (!geldigEmail) return setFout('Vul een geldig e-mailadres in.');
    setBestaat(kentEmail(email));
    setFout(null);
    setStap('wachtwoord');
  }

  function verderMetWachtwoord() {
    if (bestaat) {
      const uitkomst = login(email, wachtwoord);
      if (!uitkomst.ok) return setFout(uitkomst.fout ?? 'Inloggen lukte niet.');
      router.back();
      return;
    }
    const regelFout = wachtwoordFout(wachtwoord);
    if (regelFout) return setFout(regelFout);
    setFout(null);
    setStap('gegevens');
  }

  function wordMember() {
    if (!aanhef) return setFout('Kies een aanhef.');
    if (!voornaam.trim()) return setFout('Vul je voornaam in.');
    if (!achternaam.trim()) return setFout('Vul je achternaam in.');
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(geboortedatum.trim()))
      return setFout('Vul je geboortedatum in als dd/mm/jjjj.');
    if (!postcode.trim() || !plaats.trim() || !straat.trim() || !huisnummer.trim())
      return setFout('Vul je volledige adres in.');

    const gegevens: Gebruiker = {
      aanhef,
      voornaam: voornaam.trim(),
      tussenvoegsel: tussenvoegsel.trim() || undefined,
      achternaam: achternaam.trim(),
      email: email.trim(),
      geboortedatum: geboortedatum.trim(),
      telefoon: telefoon.trim() || undefined,
      land: 'België',
      postcode: postcode.trim(),
      plaats: plaats.trim(),
      straat: straat.trim(),
      huisnummer: huisnummer.trim(),
      bus: bus.trim() || undefined,
    };
    registreer(wachtwoord, gegevens);
    router.back();
  }

  const titel = stap === 'email' ? 'Inloggen of registreren' : bestaat ? 'Inloggen' : 'Word lid';

  return (
    <View style={styles.scherm}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.kop, { paddingTop: insets.top + 6 }]}>
        <Pressable
          style={styles.rondeKnop}
          onPress={() => (stap === 'email' ? router.back() : setStap('email'))}>
          <Ionicons
            name={stap === 'email' ? 'close' : 'chevron-back'}
            size={22}
            color={EkoColors.primaryDark}
          />
        </Pressable>
        <Text style={styles.kopTitel}>{titel}</Text>
        <View style={styles.rondeKnop} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 60 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* ------------------------------------------------ stap 1: e-mail */}
        {stap === 'email' && (
          <View style={styles.inhoud}>
            <View style={styles.merkVlak}>
              <Text style={styles.merkLetters}>E|M</Text>
              <Text style={styles.merkNaam}>EKO MOTORWEAR</Text>
            </View>

            <Text style={styles.uitleg}>
              Log in of maak een account aan om je verlanglijst, bestellingen en gegevens te
              bewaren.
            </Text>

            <Text style={styles.label}>E-mailadres</Text>
            <TextInput
              style={styles.veld}
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setFout(null);
              }}
              placeholder="naam@voorbeeld.be"
              placeholderTextColor={EkoColors.darkGray}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={verderMetEmail}
            />

            {fout && <Text style={styles.fout}>{fout}</Text>}

            <Pressable style={styles.hoofdKnop} onPress={verderMetEmail}>
              <Text style={styles.hoofdKnopTekst}>Ga verder</Text>
            </Pressable>

            <View style={styles.demoVlak}>
              <Ionicons name="information-circle-outline" size={18} color={EkoColors.primary} />
              <Text style={styles.demoTekst}>
                Demo-account: {DEMO.email} met wachtwoord {DEMO.wachtwoord}
              </Text>
            </View>
          </View>
        )}

        {/* -------------------------------------------- stap 2: wachtwoord */}
        {stap === 'wachtwoord' && (
          <View style={styles.inhoud}>
            <Text style={styles.label}>E-mailadres</Text>
            <View style={[styles.veld, styles.veldVast]}>
              <Text style={styles.veldVastTekst}>{email.trim()}</Text>
            </View>

            <Text style={styles.label}>Wachtwoord</Text>
            <View style={styles.wachtwoordRij}>
              <TextInput
                style={styles.wachtwoordVeld}
                value={wachtwoord}
                onChangeText={(t) => {
                  setWachtwoord(t);
                  setFout(null);
                }}
                secureTextEntry={!toonWachtwoord}
                autoCapitalize="none"
                placeholder={bestaat ? 'Je wachtwoord' : 'Kies een wachtwoord'}
                placeholderTextColor={EkoColors.darkGray}
                onSubmitEditing={verderMetWachtwoord}
              />
              <Pressable hitSlop={10} onPress={() => setToonWachtwoord((v) => !v)}>
                <Ionicons
                  name={toonWachtwoord ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={EkoColors.primaryDark}
                />
              </Pressable>
            </View>

            {!bestaat && (
              <Text style={styles.regels}>
                Minimaal 6 tekens · 1 cijfer · 1 hoofdletter · 1 kleine letter
              </Text>
            )}

            {fout && <Text style={styles.fout}>{fout}</Text>}

            <Pressable style={styles.hoofdKnop} onPress={verderMetWachtwoord}>
              <Text style={styles.hoofdKnopTekst}>{bestaat ? 'Inloggen' : 'Ga verder'}</Text>
            </Pressable>
          </View>
        )}

        {/* --------------------------------------------- stap 3: gegevens */}
        {stap === 'gegevens' && (
          <View style={styles.inhoud}>
            <Text style={styles.label}>Aanhef*</Text>
            <View style={styles.aanhefRij}>
              {AANHEFFEN.map((a) => {
                const aan = a === aanhef;
                return (
                  <Pressable
                    key={a}
                    style={[styles.aanhefChip, aan && styles.aanhefChipAan]}
                    onPress={() => setAanhef(a)}>
                    <Text style={[styles.aanhefTekst, aan && styles.aanhefTekstAan]}>{a}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Invoer label="Voornaam*" waarde={voornaam} onChange={setVoornaam} />
            <Invoer label="Tussenvoegsel" waarde={tussenvoegsel} onChange={setTussenvoegsel} />
            <Invoer label="Achternaam*" waarde={achternaam} onChange={setAchternaam} />
            <Invoer
              label="Geboortedatum* (dd/mm/jjjj)"
              waarde={geboortedatum}
              onChange={setGeboortedatum}
              toetsenbord="numbers-and-punctuation"
            />
            <Invoer
              label="Telefoonnummer"
              waarde={telefoon}
              onChange={setTelefoon}
              toetsenbord="phone-pad"
            />

            <Text style={styles.label}>Land*</Text>
            <View style={[styles.veld, styles.veldVast]}>
              <Text style={styles.veldVastTekst}>België</Text>
            </View>

            <Invoer label="Postcode*" waarde={postcode} onChange={setPostcode} toetsenbord="numeric" />
            <Invoer label="Plaats*" waarde={plaats} onChange={setPlaats} />
            <Invoer label="Straat*" waarde={straat} onChange={setStraat} />
            <View style={styles.tweeKolommen}>
              <View style={{ flex: 1 }}>
                <Invoer label="Huisnummer*" waarde={huisnummer} onChange={setHuisnummer} />
              </View>
              <View style={{ flex: 1 }}>
                <Invoer label="Bus" waarde={bus} onChange={setBus} />
              </View>
            </View>

            <Text style={styles.voorwaardenKop}>Algemene voorwaarden</Text>
            <Text style={styles.voorwaardenTekst}>
              Door lid te worden ga je akkoord met onze algemene voorwaarden en ons privacybeleid.
              We gebruiken je gegevens en aankopen om je bestellingen te verwerken en je advies te
              geven dat bij jouw motorrijden past.
            </Text>
            <Text style={styles.voorwaardenTekst}>
              Je aankopen worden gekoppeld aan je account. Je voorkeuren pas je altijd aan via Mijn
              gegevens. Je verklaart dat je 18 jaar of ouder bent.
            </Text>

            {fout && <Text style={styles.fout}>{fout}</Text>}

            <Pressable style={styles.hoofdKnop} onPress={wordMember}>
              <Text style={styles.hoofdKnopTekst}>Word lid</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function Invoer({
  label,
  waarde,
  onChange,
  toetsenbord,
}: {
  label: string;
  waarde: string;
  onChange: (v: string) => void;
  toetsenbord?: 'default' | 'numeric' | 'phone-pad' | 'numbers-and-punctuation';
}) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.veld}
        value={waarde}
        onChangeText={onChange}
        keyboardType={toetsenbord ?? 'default'}
        placeholderTextColor={EkoColors.darkGray}
      />
    </>
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
  kopTitel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: EkoFonts.headingBold,
    fontSize: 17,
    letterSpacing: 0.3,
    color: EkoColors.primaryDark,
  },
  inhoud: { paddingHorizontal: 16, paddingTop: 8 },

  merkVlak: {
    backgroundColor: EkoColors.primaryDark,
    paddingVertical: 40,
    alignItems: 'center',
    marginBottom: 24,
  },
  merkLetters: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 44,
    letterSpacing: 2,
    color: EkoColors.white,
  },
  merkNaam: {
    marginTop: 6,
    fontFamily: EkoFonts.headingMedium,
    fontSize: 12,
    letterSpacing: 3,
    color: EkoColors.primary,
  },
  uitleg: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    lineHeight: 21,
    color: EkoColors.paragraphGray,
    marginBottom: 6,
  },

  label: {
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 13,
    color: EkoColors.primaryDark,
    marginTop: 14,
    marginBottom: 6,
  },
  veld: {
    borderWidth: 1,
    borderColor: EkoColors.lightSteelBlue,
    paddingHorizontal: 14,
    height: 50,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.primaryDark,
  },
  veldVast: {
    backgroundColor: EkoColors.lightGray,
    justifyContent: 'center',
  },
  veldVastTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.paragraphGray,
  },
  wachtwoordRij: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: EkoColors.lightSteelBlue,
    paddingHorizontal: 14,
    height: 50,
  },
  wachtwoordVeld: {
    flex: 1,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.primaryDark,
  },
  regels: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 12,
    color: EkoColors.paragraphGray,
    marginTop: 8,
  },

  aanhefRij: { flexDirection: 'row', gap: 10 },
  aanhefChip: {
    borderWidth: 1,
    borderColor: EkoColors.lightSteelBlue,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  aanhefChipAan: {
    backgroundColor: EkoColors.primaryDark,
    borderColor: EkoColors.primaryDark,
  },
  aanhefTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    color: EkoColors.primaryDark,
  },
  aanhefTekstAan: { color: EkoColors.white },

  tweeKolommen: { flexDirection: 'row', gap: 12 },

  voorwaardenKop: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 15,
    color: EkoColors.primaryDark,
    marginTop: 24,
    marginBottom: 8,
  },
  voorwaardenTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 13,
    lineHeight: 20,
    color: EkoColors.paragraphGray,
    marginBottom: 10,
  },

  fout: {
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 14,
    color: EkoColors.primary,
    marginTop: 12,
  },
  hoofdKnop: {
    marginTop: 18,
    backgroundColor: EkoColors.primaryDark,
    paddingVertical: 17,
    alignItems: 'center',
  },
  hoofdKnopTekst: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 15,
    color: EkoColors.white,
  },

  demoVlak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F7EFE6',
    padding: 12,
    marginTop: 18,
  },
  demoTekst: {
    flex: 1,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 13,
    lineHeight: 19,
    color: EkoColors.primaryDark,
  },
});
