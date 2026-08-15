import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { EkoColors, EkoFonts, EkoRadius } from '@/constants/eko-theme';

/**
 * Mijn account — dezelfde opbouw als het dashboard op de website.
 * Op een telefoon staan de kolommen onder elkaar: eerst het menu, dan het paneel.
 */

type PanelKey = 'overzicht' | 'bestellingen' | 'retouren' | 'verlanglijst' | 'gegevens' | 'voorkeuren';

const MENU: { key: PanelKey; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'overzicht', label: 'Dashboard', icon: 'grid-outline' },
  { key: 'bestellingen', label: 'Mijn bestellingen', icon: 'cube-outline' },
  { key: 'retouren', label: 'Retouren', icon: 'return-down-back-outline' },
  { key: 'verlanglijst', label: 'Verlanglijst', icon: 'heart-outline' },
  { key: 'gegevens', label: 'Mijn gegevens', icon: 'person-outline' },
  { key: 'voorkeuren', label: 'Voorkeuren', icon: 'options-outline' },
];

const NIEUWS = ['Nieuwe collectie', 'Aanbiedingen', 'Helmen', 'Onderhoud en tips', 'Events'];
const RIJSTIJL = ['Toer', 'Sport', 'Custom', 'Offroad'];
const MERKEN = ['Alpinestars', 'Dainese', "REV'IT!", 'Rukka', 'Held', 'Furygan', 'Shoei', 'AGV', 'Klim', 'Ixon', 'Spidi', 'Macna'];

const GEGEVENS: { label: string; waarde: string }[] = [
  { label: 'Factuuradres', waarde: 'Mevr. Zaynaba Alkodase\nGestichtstraat 69 bus 0202\n9000 Gent\nBelgië' },
  { label: 'Telefoonnummer', waarde: 'Voeg telefoonnummer toe' },
  { label: 'Geboortedatum', waarde: '09/10/1996' },
  { label: 'E-mailadres', waarde: 'zaynaba_alkodase@hotmail.com' },
  { label: 'Wachtwoord', waarde: '••••••••' },
  { label: 'Bezorgadres', waarde: 'Zelfde als factuuradres' },
];

function Card({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{titel}</Text>
      {children}
    </View>
  );
}

function Leeg({ tekst }: { tekst: string }) {
  return <Text style={styles.empty}>{tekst}</Text>;
}

function Chips({ opties, gekozen, onToggle }: { opties: string[]; gekozen: string[]; onToggle: (v: string) => void }) {
  return (
    <View style={styles.chipRow}>
      {opties.map((o) => {
        const aan = gekozen.includes(o);
        return (
          <Pressable key={o} onPress={() => onToggle(o)} style={[styles.chip, aan && styles.chipOn]}>
            <Text style={[styles.chipText, aan && styles.chipTextOn]}>{o}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ToggleRij({
  label,
  uitleg,
  waarde,
  onChange,
}: {
  label: string;
  uitleg: string;
  waarde: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleText}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Text style={styles.toggleSub}>{uitleg}</Text>
      </View>
      <Switch
        value={waarde}
        onValueChange={onChange}
        trackColor={{ false: EkoColors.gray, true: EkoColors.primary }}
        thumbColor={EkoColors.white}
      />
    </View>
  );
}

export default function AccountScreen() {
  const [panel, setPanel] = useState<PanelKey>('overzicht');
  const [nieuws, setNieuws] = useState<string[]>([]);
  const [rijstijl, setRijstijl] = useState<string[]>([]);
  const [merken, setMerken] = useState<string[]>([]);
  const [meldingen, setMeldingen] = useState({
    email: true,
    post: false,
    sms: false,
    aanbevelingen: true,
    aanbiedingen: true,
  });

  const wissel = (lijst: string[], zet: (v: string[]) => void) => (waarde: string) =>
    zet(lijst.includes(waarde) ? lijst.filter((x) => x !== waarde) : [...lijst, waarde]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.welkom}>Welkom,</Text>
      <Text style={styles.naam}>ZAYNABA</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.menu}
        contentContainerStyle={styles.menuInner}>
        {MENU.map((m) => {
          const actief = panel === m.key;
          return (
            <Pressable key={m.key} onPress={() => setPanel(m.key)} style={[styles.navLink, actief && styles.navLinkOn]}>
              <Ionicons name={m.icon} size={16} color={actief ? EkoColors.primary : EkoColors.paragraphGray} />
              <Text style={[styles.navText, actief && styles.navTextOn]}>{m.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {panel === 'overzicht' && (
        <>
          <Card titel="Overzicht">
            <Text style={styles.cardText}>
              Je bent ingelogd. Hier beheer je je bestellingen, retours en verlanglijst.
            </Text>
          </Card>
          <Card titel="Laatste bestelling">
            <Leeg tekst="Je hebt nog geen bestelling geplaatst." />
          </Card>
          <Card titel="Verlanglijst">
            <Leeg tekst="Je verlanglijst is nog leeg. Tik op het hartje bij een product om het hier te bewaren." />
          </Card>
        </>
      )}

      {panel === 'bestellingen' && (
        <Card titel="Mijn bestellingen">
          <Leeg tekst="Je hebt nog geen bestelling geplaatst. Zodra je iets bestelt, vind je hier je pakbon en je volgnummer." />
        </Card>
      )}

      {panel === 'retouren' && (
        <Card titel="Retouren">
          <Leeg tekst="Je hebt nog niets teruggestuurd. Retourneren kan binnen 30 dagen na ontvangst." />
        </Card>
      )}

      {panel === 'verlanglijst' && (
        <Card titel="Verlanglijst">
          <Leeg tekst="Je verlanglijst is nog leeg. Tik op het hartje bij een product om het hier te bewaren." />
        </Card>
      )}

      {panel === 'gegevens' && (
        <Card titel="Mijn gegevens">
          {GEGEVENS.map((g) => (
            <View key={g.label} style={styles.dataRow}>
              <View style={styles.dataText}>
                <Text style={styles.dataLabel}>{g.label}</Text>
                <Text style={styles.dataValue}>{g.waarde}</Text>
              </View>
              <Ionicons name="create-outline" size={18} color={EkoColors.primary} />
            </View>
          ))}
        </Card>
      )}

      {panel === 'voorkeuren' && (
        <Card titel="Voorkeuren">
          <Text style={styles.cardText}>Kies waarover we je op de hoogte houden. Je kunt dit altijd aanpassen.</Text>

          <Text style={styles.sectionTitle}>Ik wil nieuws ontvangen over</Text>
          <Chips opties={NIEUWS} gekozen={nieuws} onToggle={wissel(nieuws, setNieuws)} />

          <Text style={styles.sectionTitle}>Ik rijd vooral</Text>
          <Chips opties={RIJSTIJL} gekozen={rijstijl} onToggle={wissel(rijstijl, setRijstijl)} />

          <Text style={styles.sectionTitle}>Mijn favoriete merken</Text>
          <Chips opties={MERKEN} gekozen={merken} onToggle={wissel(merken, setMerken)} />

          <Text style={styles.sectionTitle}>Hoe houden we contact?</Text>
          <ToggleRij
            label="E-mail"
            uitleg="Nieuws, aanbiedingen en rijtips in je inbox."
            waarde={meldingen.email}
            onChange={(v) => setMeldingen({ ...meldingen, email: v })}
          />
          <ToggleRij
            label="Post"
            uitleg="Onze seizoenscatalogus en acties in de brievenbus."
            waarde={meldingen.post}
            onChange={(v) => setMeldingen({ ...meldingen, post: v })}
          />
          <ToggleRij
            label="Sms"
            uitleg="Korte berichten over je bestelling en exclusieve acties."
            waarde={meldingen.sms}
            onChange={(v) => setMeldingen({ ...meldingen, sms: v })}
          />

          <Text style={styles.sectionTitle}>Personalisatie</Text>
          <ToggleRij
            label="Persoonlijke aanbevelingen"
            uitleg="We stemmen onze suggesties af op je verlanglijst en je eerdere bestellingen."
            waarde={meldingen.aanbevelingen}
            onChange={(v) => setMeldingen({ ...meldingen, aanbevelingen: v })}
          />
          <ToggleRij
            label="Aanbiedingen op maat"
            uitleg="Kortingen die passen bij jouw motorstijl en maten."
            waarde={meldingen.aanbiedingen}
            onChange={(v) => setMeldingen({ ...meldingen, aanbiedingen: v })}
          />
        </Card>
      )}

      <Pressable style={styles.logout}>
        <Text style={styles.logoutText}>Uitloggen</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: EkoColors.white },
  content: { paddingTop: 72, paddingHorizontal: 16, paddingBottom: 48 },

  welkom: { fontFamily: EkoFonts.bodyRegular, fontSize: 14, color: EkoColors.paragraphGray },
  naam: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 28,
    letterSpacing: 1,
    color: EkoColors.primaryDark,
    textTransform: 'uppercase',
    marginBottom: 20,
  },

  menu: { marginBottom: 20, marginHorizontal: -16 },
  menuInner: { paddingHorizontal: 16, gap: 8 },
  navLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: EkoRadius.pill,
    borderWidth: 1,
    borderColor: EkoColors.lightGray,
  },
  navLinkOn: { borderColor: EkoColors.primary },
  navText: { fontFamily: EkoFonts.bodyRegular, fontSize: 14, color: EkoColors.paragraphGray },
  navTextOn: { color: EkoColors.primary, fontFamily: EkoFonts.bodyMedium },

  card: {
    borderWidth: 1,
    borderColor: EkoColors.lightGray,
    borderRadius: EkoRadius.small * 2,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 16,
    letterSpacing: 1,
    color: EkoColors.primaryDark,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  cardText: { fontFamily: EkoFonts.bodyRegular, fontSize: 15, lineHeight: 22, color: EkoColors.paragraphGray },
  empty: { fontFamily: EkoFonts.bodyRegular, fontSize: 15, lineHeight: 22, color: EkoColors.darkGray },

  sectionTitle: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 14,
    letterSpacing: 1,
    color: EkoColors.primaryDark,
    textTransform: 'uppercase',
    marginTop: 24,
    marginBottom: 12,
  },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: EkoRadius.pill,
    borderWidth: 1,
    borderColor: EkoColors.gray,
  },
  chipOn: { backgroundColor: EkoColors.primary, borderColor: EkoColors.primary },
  chipText: { fontFamily: EkoFonts.bodyRegular, fontSize: 13, color: EkoColors.primaryDark },
  chipTextOn: { color: EkoColors.white },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: EkoColors.lightGray,
  },
  toggleText: { flex: 1, gap: 4 },
  toggleLabel: { fontFamily: EkoFonts.bodyRegular, fontSize: 15, color: EkoColors.primaryDark },
  toggleSub: { fontFamily: EkoFonts.bodyRegular, fontSize: 13, lineHeight: 19, color: EkoColors.paragraphGray },

  dataRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: EkoColors.lightGray,
  },
  dataText: { flex: 1, gap: 4 },
  dataLabel: { fontFamily: EkoFonts.bodyMedium, fontSize: 13, color: EkoColors.primaryDark, textTransform: 'uppercase', letterSpacing: 0.5 },
  dataValue: { fontFamily: EkoFonts.bodyRegular, fontSize: 15, lineHeight: 22, color: EkoColors.paragraphGray },

  logout: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
  },
  logoutText: { fontFamily: EkoFonts.bodyRegular, fontSize: 14, color: EkoColors.primary, textDecorationLine: 'underline' },
});
