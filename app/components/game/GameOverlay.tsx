/**
 * GameOverlay.tsx
 * Startscherm, winst- en verliesscherm met de herstartknop.
 * Opgebouwd met dezelfde kaart- en knopstijl als de rest van de app.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { EkoColors, EkoFonts, EkoRadius } from '@/constants/eko-theme';
import type { GameStatus } from '@/lib/game/useGameEngine';
import EkoLogo from './EkoLogo';

const CONTENT = {
  idle: {
    title: 'ESCAPE THE PACK',
    body: 'Blijf 60 seconden voor de bende uit.\n→ gas · ← rem · ↑ spring\n\nSpring zelf over kegels, vaten en banden.\nElke geslaagde sprong geeft een snelheidsboost.\n\nDe bende springt overal moeiteloos over\nén schakelt elke 10 seconden een tandje bij.',
    button: 'START',
  },
  won: {
    title: 'ONTSNAPT',
    body: 'Je hebt de volle 60 seconden overleefd.',
    button: 'OPNIEUW',
  },
  lost: {
    title: 'INGEHAALD',
    body: 'De bende heeft je te pakken gekregen.',
    button: 'OPNIEUW',
  },
};

type GameOverlayProps = {
  status: GameStatus;
  score: number;
  crashes: number;
  gesprongen: number;
  onPress: () => void;
};

export default function GameOverlay({ status, score, crashes, gesprongen, onPress }: GameOverlayProps) {
  if (status === 'running') return null;
  const content = CONTENT[status];

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <EkoLogo size={22} />
        <Text style={styles.title}>{content.title}</Text>
        <Text style={styles.body}>{content.body}</Text>

        {status !== 'idle' && (
          <View style={styles.resultaat}>
            <Text style={styles.score}>SCORE {score}</Text>
            <Text style={styles.crashes}>
              {gesprongen}× een obstakel genomen
              {crashes === 0 ? ' · geen enkele botsing' : ` · ${crashes}× gebotst`}
            </Text>
          </View>
        )}

        <Pressable
          onPress={onPress}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.buttonText}>{content.button}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(236,237,239,0.92)',
  },
  card: {
    borderWidth: 2,
    borderColor: EkoColors.primaryDark,
    borderRadius: EkoRadius.card,
    backgroundColor: EkoColors.white,
    paddingVertical: 28,
    paddingHorizontal: 26,
    alignItems: 'center',
    maxWidth: 330,
  },
  title: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 24,
    letterSpacing: 2,
    color: EkoColors.primaryDark,
    marginTop: 14,
  },
  body: {
    marginTop: 10,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    color: EkoColors.paragraphGray,
  },
  resultaat: {
    marginTop: 16,
    alignItems: 'center',
  },
  score: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 18,
    letterSpacing: 2,
    color: EkoColors.primary,
  },
  crashes: {
    marginTop: 2,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 12,
    color: EkoColors.paragraphGray,
  },
  button: {
    marginTop: 22,
    backgroundColor: EkoColors.primary,
    borderRadius: EkoRadius.pill,
    paddingVertical: 14,
    paddingHorizontal: 34,
  },
  pressed: {
    backgroundColor: EkoColors.primaryDark,
  },
  buttonText: {
    fontFamily: EkoFonts.headingMedium,
    fontSize: 13,
    letterSpacing: 1.2,
    color: EkoColors.white,
    textTransform: 'uppercase',
  },
});
