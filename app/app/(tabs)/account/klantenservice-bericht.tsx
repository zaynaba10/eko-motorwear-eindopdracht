import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Scherm, Veld, VolleKnop } from '@/components/account-ui';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';

/**
 * Stuur ons een bericht — hetzelfde contactformulier als op de website:
 * naam, e-mail, telefoon, bericht en een optionele bijlage.
 */
export default function Bericht() {
  const router = useRouter();

  const [naam, setNaam] = useState('');
  const [email, setEmail] = useState('');
  const [telefoon, setTelefoon] = useState('');
  const [bericht, setBericht] = useState('');
  const [bijlage, setBijlage] = useState('');

  const [fout, setFout] = useState<string | null>(null);
  const [verzonden, setVerzonden] = useState(false);

  const geldigEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  function verzend() {
    if (!naam.trim()) return setFout('Vul je naam in.');
    if (!geldigEmail) return setFout('Vul een geldig e-mailadres in.');
    if (bericht.trim().length < 10) return setFout('Schrijf een bericht van minstens 10 tekens.');
    setFout(null);
    setVerzonden(true);
  }

  if (verzonden) {
    return (
      <Scherm titel="Stuur ons een bericht">
        <View style={styles.klaar}>
          <View style={styles.vinkje}>
            <Ionicons name="checkmark" size={30} color={EkoColors.white} />
          </View>
          <Text style={styles.klaarTitel}>We hebben je bericht ontvangen</Text>
          <Text style={styles.klaarTekst}>
            Bedankt {naam.trim()}. We antwoorden binnen één werkdag op {email.trim()}. Dringend?
            Bel ons op 03 457 11 28.
          </Text>
          <View style={{ marginTop: 22, width: '100%' }}>
            <VolleKnop label="Terug naar klantenservice" onPress={() => router.back()} />
          </View>
        </View>
      </Scherm>
    );
  }

  return (
    <Scherm titel="Stuur ons een bericht" knop="Verzenden" onKnop={verzend}>
      <View style={styles.inhoud}>
        <Text style={styles.intro}>
          Een vraag over je bestelling, een maat of een herstelling? Laat hieronder je bericht na en
          we antwoorden binnen één werkdag.
        </Text>

        <Veld label="Naam" waarde={naam} onChange={setNaam} verplicht />
        <Veld
          label="E-mailadres"
          waarde={email}
          onChange={setEmail}
          verplicht
          toetsenbord="email-address"
        />
        <Veld label="Telefoonnummer" waarde={telefoon} onChange={setTelefoon} toetsenbord="phone-pad" />

        <Text style={styles.label}>Bericht*</Text>
        <TextInput
          style={styles.tekstvak}
          value={bericht}
          onChangeText={setBericht}
          placeholder="Waarmee kunnen we je helpen?"
          placeholderTextColor={EkoColors.darkGray}
          multiline
          textAlignVertical="top"
        />

        <View style={styles.bijlageKop}>
          <Ionicons name="attach-outline" size={18} color={EkoColors.primaryDark} />
          <Text style={styles.label}>Bijlage (optioneel)</Text>
        </View>
        <TextInput
          style={styles.bijlageVeld}
          value={bijlage}
          onChangeText={setBijlage}
          placeholder="Link naar een foto of document"
          placeholderTextColor={EkoColors.darkGray}
          autoCapitalize="none"
        />
        <Text style={styles.hulp}>
          Liever een bestand meesturen? Mail het naar vraag@eko-motorwear.be met je naam erbij.
        </Text>

        {fout && <Text style={styles.fout}>{fout}</Text>}
      </View>
    </Scherm>
  );
}

const styles = StyleSheet.create({
  inhoud: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 20 },
  intro: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    lineHeight: 21,
    color: EkoColors.paragraphGray,
    marginBottom: 16,
  },
  label: {
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 13,
    color: EkoColors.primaryDark,
    marginTop: 14,
    marginBottom: 6,
  },
  tekstvak: {
    borderWidth: 1,
    borderColor: EkoColors.lightSteelBlue,
    minHeight: 130,
    padding: 14,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    lineHeight: 21,
    color: EkoColors.primaryDark,
  },
  bijlageKop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bijlageVeld: {
    borderWidth: 1,
    borderColor: EkoColors.lightSteelBlue,
    paddingHorizontal: 14,
    height: 48,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.primaryDark,
  },
  hulp: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 12,
    lineHeight: 18,
    color: EkoColors.darkGray,
    marginTop: 8,
  },
  fout: {
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 14,
    color: EkoColors.primary,
    marginTop: 14,
  },

  klaar: {
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  vinkje: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: EkoColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  klaarTitel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 20,
    color: EkoColors.primaryDark,
    textAlign: 'center',
    marginBottom: 8,
  },
  klaarTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    lineHeight: 21,
    color: EkoColors.paragraphGray,
    textAlign: 'center',
  },
});
