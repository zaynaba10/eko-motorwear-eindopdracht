import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EkoColors, EkoFonts, EkoRadius } from '@/constants/eko-theme';

/**
 * Bouwstenen voor het accountgedeelte.
 * Structuur naar het voorbeeld van de Bijenkorf-app, vormgeving in de EKO-huisstijl:
 * navy #16232e, oranje #BD5C00, lijnen in #ECEDEF, Oswald voor koppen en Ubuntu voor tekst.
 */

export type IconNaam = keyof typeof Ionicons.glyphMap;

/** Kop met pijltje terug links en de titel gecentreerd. */
export function SchermKop({ titel }: { titel: string }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.kop, { paddingTop: insets.top + 8 }]}>
      <Pressable
        onPress={() => router.back()}
        hitSlop={12}
        style={s.terug}
        accessibilityLabel="Terug">
        <Ionicons name="chevron-back" size={20} color={EkoColors.primaryDark} />
      </Pressable>
      <Text style={s.kopTitel} numberOfLines={1}>
        {titel}
      </Text>
      <View style={s.terugLeeg} />
    </View>
  );
}

/** Scherm met kop, scrollbare inhoud en optioneel een vaste knop onderaan. */
export function Scherm({
  titel,
  children,
  knop,
  onKnop,
}: {
  titel: string;
  children: ReactNode;
  knop?: string;
  onKnop?: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={s.scherm}>
      <SchermKop titel={titel} />
      <ScrollView
        style={s.body}
        contentContainerStyle={{ paddingBottom: knop ? 24 : insets.bottom + 24 }}
        keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
      {knop ? (
        <View style={[s.knopBalk, { paddingBottom: 16 }]}>
          <VolleKnop label={knop} onPress={onKnop} />
        </View>
      ) : null}
    </View>
  );
}

/** Knop over de volle breedte, navy met witte tekst. */
export function VolleKnop({
  label,
  onPress,
  uit,
}: {
  label: string;
  onPress?: () => void;
  uit?: boolean;
}) {
  return (
    <Pressable style={[s.knop, uit && s.knopUit]} onPress={uit ? undefined : onPress}>
      <Text style={[s.knopTekst, uit && s.knopTekstUit]}>{label}</Text>
    </Pressable>
  );
}

/** Groep van rijen met een dunne lijn ertussen. */
export function Groep({ children }: { children: ReactNode }) {
  return <View style={s.groep}>{children}</View>;
}

/** Eén rij in het menu: icoon, tekst en een pijltje naar rechts. */
export function MenuRij({
  icoon,
  label,
  extra,
  onPress,
  pijl = true,
}: {
  icoon?: IconNaam;
  label: string;
  extra?: string;
  onPress?: () => void;
  pijl?: boolean;
}) {
  return (
    <Pressable style={s.rij} onPress={onPress}>
      {icoon ? <Ionicons name={icoon} size={19} color={EkoColors.primaryDark} style={s.rijIcoon} /> : null}
      <View style={s.rijTekst}>
        <Text style={s.rijLabel}>{label}</Text>
        {extra ? <Text style={s.rijExtra}>{extra}</Text> : null}
      </View>
      {pijl ? <Ionicons name="chevron-forward" size={17} color={EkoColors.darkGray} /> : null}
    </Pressable>
  );
}

/** Lege staat: kop, uitleg en een groot icoon erboven. */
export function LegeStaat({
  icoon,
  titel,
  tekst,
}: {
  icoon: IconNaam;
  titel: string;
  tekst: string;
}) {
  return (
    <View style={s.leeg}>
      <View style={s.leegIcoon}>
        <Ionicons name={icoon} size={40} color={EkoColors.primary} />
      </View>
      <Text style={s.leegTitel}>{titel}</Text>
      <Text style={s.leegTekst}>{tekst}</Text>
    </View>
  );
}

/** Invulveld met het zwevende label, zoals op de website. */
export function Veld({
  label,
  waarde,
  onChange,
  verplicht,
  vast,
  wachtwoord,
  toetsenbord,
}: {
  label: string;
  waarde: string;
  onChange?: (v: string) => void;
  verplicht?: boolean;
  vast?: boolean;
  wachtwoord?: boolean;
  toetsenbord?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
}) {
  const gevuld = waarde.length > 0;
  return (
    <View style={s.veld}>
      {gevuld ? (
        <Text style={s.veldLabel}>
          {label}
          {verplicht ? '*' : ''}
        </Text>
      ) : null}
      <TextInput
        style={[s.veldInput, vast && s.veldVast]}
        value={waarde}
        onChangeText={onChange}
        editable={!vast}
        placeholder={label + (verplicht ? '*' : '')}
        placeholderTextColor={EkoColors.darkGray}
        secureTextEntry={wachtwoord}
        keyboardType={toetsenbord ?? 'default'}
        autoCapitalize={toetsenbord === 'email-address' ? 'none' : 'sentences'}
      />
    </View>
  );
}

/** Rij met een vinkje rechts. */
export function VinkRij({
  label,
  uitleg,
  aan,
  onToggle,
}: {
  label: string;
  uitleg?: string;
  aan: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable style={s.rij} onPress={onToggle}>
      <View style={s.rijTekst}>
        <Text style={s.rijLabel}>{label}</Text>
        {uitleg ? <Text style={s.rijExtra}>{uitleg}</Text> : null}
      </View>
      <View style={[s.vink, aan && s.vinkAan]}>
        {aan ? <Ionicons name="checkmark" size={15} color={EkoColors.white} /> : null}
      </View>
    </Pressable>
  );
}

/** Rij met een rondje rechts, voor een keuze uit meerdere. */
export function KeuzeRij({
  label,
  aan,
  onPress,
  vlag,
}: {
  label: string;
  aan: boolean;
  onPress: () => void;
  vlag?: string;
}) {
  return (
    <Pressable style={s.rij} onPress={onPress}>
      {vlag ? <Text style={s.vlag}>{vlag}</Text> : null}
      <View style={s.rijTekst}>
        <Text style={s.rijLabel}>{label}</Text>
      </View>
      <View style={[s.rondje, aan && s.rondjeAan]}>
        {aan ? <View style={s.rondjeKern} /> : null}
      </View>
    </Pressable>
  );
}

/** Twee knoppen naast elkaar, zoals Online en Winkel bij de bestellingen. */
export function Schakelaar({
  opties,
  gekozen,
  onKies,
}: {
  opties: string[];
  gekozen: string;
  onKies: (v: string) => void;
}) {
  return (
    <View style={s.schakelRij}>
      {opties.map((o) => {
        const aan = o === gekozen;
        return (
          <Pressable key={o} onPress={() => onKies(o)} style={[s.schakel, aan && s.schakelAan]}>
            <Text style={[s.schakelTekst, aan && s.schakelTekstAan]}>{o}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export const s = StyleSheet.create({
  scherm: { flex: 1, backgroundColor: EkoColors.white },
  body: { flex: 1 },

  kop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: EkoColors.lightGray,
    backgroundColor: EkoColors.white,
  },
  terug: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: EkoColors.lightGray,
  },
  terugLeeg: { width: 36 },
  kopTitel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: EkoFonts.headingBold,
    fontSize: 15,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: EkoColors.primaryDark,
  },

  groep: { marginTop: 20, paddingHorizontal: 16 },
  rij: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: EkoColors.lightGray,
    gap: 12,
  },
  rijIcoon: { width: 22 },
  rijTekst: { flex: 1, gap: 3 },
  rijLabel: { fontFamily: EkoFonts.bodyRegular, fontSize: 15, color: EkoColors.primaryDark },
  rijExtra: { fontFamily: EkoFonts.bodyRegular, fontSize: 13, lineHeight: 19, color: EkoColors.paragraphGray },

  leeg: { alignItems: 'center', paddingHorizontal: 32, paddingTop: 72 },
  leegIcoon: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: EkoColors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  leegTitel: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 20,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: EkoColors.primaryDark,
    textAlign: 'center',
    marginBottom: 8,
  },
  leegTekst: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    lineHeight: 21,
    color: EkoColors.paragraphGray,
    textAlign: 'center',
  },

  veld: { marginTop: 14, paddingHorizontal: 16 },
  veldLabel: {
    position: 'absolute',
    left: 30,
    top: -6,
    zIndex: 2,
    paddingHorizontal: 6,
    backgroundColor: EkoColors.white,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 12,
    color: EkoColors.primary,
  },
  veldInput: {
    borderWidth: 1,
    borderColor: EkoColors.gray,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 16,
    color: EkoColors.primaryDark,
  },
  veldVast: { backgroundColor: EkoColors.lightGray, color: EkoColors.paragraphGray },

  vink: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: EkoColors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vinkAan: { backgroundColor: EkoColors.primary, borderColor: EkoColors.primary },

  rondje: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: EkoColors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rondjeAan: { borderColor: EkoColors.primary },
  rondjeKern: { width: 12, height: 12, borderRadius: 6, backgroundColor: EkoColors.primary },
  vlag: { fontSize: 20 },

  schakelRij: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 16 },
  schakel: {
    paddingVertical: 9,
    paddingHorizontal: 22,
    borderRadius: EkoRadius.pill,
    borderWidth: 1,
    borderColor: EkoColors.gray,
  },
  schakelAan: { backgroundColor: EkoColors.primaryDark, borderColor: EkoColors.primaryDark },
  schakelTekst: { fontFamily: EkoFonts.bodyRegular, fontSize: 14, color: EkoColors.primaryDark },
  schakelTekstAan: { color: EkoColors.white },

  knopBalk: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: EkoColors.lightGray,
    backgroundColor: EkoColors.white,
  },
  knop: {
    backgroundColor: EkoColors.primaryDark,
    borderRadius: EkoRadius.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  knopUit: { backgroundColor: EkoColors.lightSteelBlue },
  knopTekst: {
    fontFamily: EkoFonts.headingMedium,
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: EkoColors.white,
  },
  knopTekstUit: { color: EkoColors.darkGray },
});
