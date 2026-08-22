/**
 * app/game.tsx
 * Route "/game" — de mini-game van EKO Motorwear.
 * Dit scherm tekent alleen; alle logica komt uit useGameEngine.
 *
 * De SVG gebruikt een vaste viewBox (GAME.viewWidth breed). Daardoor zie je
 * op élke telefoon evenveel baan vóór je, en heb je dus overal dezelfde
 * reactietijd om over een obstakel te springen.
 */

import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Bike from '@/components/game/Bike';
import EkoLogo from '@/components/game/EkoLogo';
import GameControls from '@/components/game/GameControls';
import GameHUD from '@/components/game/GameHUD';
import GameOverlay from '@/components/game/GameOverlay';
import Obstacle from '@/components/game/Obstacle';
import Terrain from '@/components/game/Terrain';
import { EkoColors, EkoFonts, EkoRadius } from '@/constants/eko-theme';
import { GAME, OBSTACLES } from '@/lib/game/gameConfig';
import { bendeHoogte, obstakelsInBeeld, volgendObstakel } from '@/lib/game/obstacles';
import { slopeAngle, terrainY } from '@/lib/game/terrain';
import useGameEngine from '@/lib/game/useGameEngine';

export default function GameScreen() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  // De app verbergt de standaardheader, dus we houden zelf rekening met de
  // notch bovenaan en de home-balk onderaan.
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // De wereld is altijd GAME.viewWidth breed; de hoogte volgt de verhouding
  // van het scherm, zodat er niets uitgerekt wordt.
  const viewWidth = GAME.viewWidth;
  const viewHeight = size.width > 0 ? (size.height * viewWidth) / size.width : 0;

  const { status, frame, start, restart, setInput, jump } = useGameEngine(viewHeight);

  const riderX = viewWidth * GAME.riderScreenRatio;
  const cameraX = frame.distance - riderX;

  const closestGap = frame.chasers.reduce(
    (min, c) => Math.min(min, c.gap),
    Number.POSITIVE_INFINITY
  );

  // Waarschuwingspijl: staat er een obstakel net buiten beeld dat je binnen
  // een paar tellen bereikt, dan zie je alvast een oranje driehoek aan de rand.
  const volgende = volgendObstakel(frame.distance);
  const seconenTot = volgende ? (volgende.worldX - frame.distance) / Math.max(frame.speed, 1) : 99;
  const toonWaarschuwing =
    status === 'running' &&
    volgende !== null &&
    volgende.worldX > cameraX + viewWidth &&
    seconenTot < OBSTACLES.waarschuwing;

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top + 6, paddingBottom: Math.max(insets.bottom, 8) },
      ]}
    >
      <Stack.Screen options={{ title: 'Mini-game' }} />

      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={({ pressed }) => [styles.terug, pressed && styles.terugPressed]}
        >
          <Text style={styles.terugTeken}>‹</Text>
        </Pressable>

        <View style={styles.titel}>
          <EkoLogo size={16} />
          <Text style={styles.heading}>ESCAPE THE PACK</Text>
        </View>
      </View>

      <GameHUD
        score={frame.score}
        timeLeft={frame.timeLeft}
        speed={frame.speed}
        boost={frame.boost}
        closestGap={Number.isFinite(closestGap) ? closestGap : 0}
      />

      <View style={styles.canvas} onLayout={(e) => setSize(e.nativeEvent.layout)}>
        {viewHeight > 0 && (
          <Svg
            width={size.width}
            height={size.height}
            viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          >
            <Terrain cameraX={cameraX} width={viewWidth} height={viewHeight} />

            {/* obstakels op de baan */}
            {obstakelsInBeeld(cameraX, viewWidth).map((o) => (
              <Obstacle
                key={o.id}
                type={o.type}
                x={o.worldX - cameraX}
                y={terrainY(o.worldX, viewHeight)}
              />
            ))}

            {/* waarschuwing: er komt een obstakel aan */}
            {toonWaarschuwing && (
              <Path
                d={`M ${viewWidth - 34} ${terrainY(cameraX + viewWidth, viewHeight) - 46}
                    l 26 13 l -26 13 z`}
                fill={EkoColors.primary}
                opacity={0.9}
              />
            )}

            {/* de bende: zij springen automatisch over alles heen */}
            {frame.chasers.map((chaser) => {
              const x = riderX - chaser.gap;
              if (x < -70) return null;
              const worldX = frame.distance - chaser.gap;
              return (
                <Bike
                  key={chaser.id}
                  variant="chaser"
                  x={x}
                  y={terrainY(worldX, viewHeight) - bendeHoogte(worldX)}
                  angle={slopeAngle(worldX, viewHeight)}
                  scale={1.2}
                />
              );
            })}

            {/* de speler */}
            <Bike
              x={riderX}
              y={terrainY(frame.distance, viewHeight) - frame.altitude}
              angle={slopeAngle(frame.distance, viewHeight)}
              scale={1.3}
              flikker={frame.geraakt}
            />
          </Svg>
        )}

        <GameOverlay
          status={status}
          score={frame.score}
          crashes={frame.crashes}
          gesprongen={frame.gesprongen}
          onPress={status === 'idle' ? start : restart}
        />
      </View>

      <GameControls setInput={setInput} jump={jump} disabled={status !== 'running'} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: EkoColors.primaryLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    minHeight: 40,
  },
  titel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  terug: {
    position: 'absolute',
    left: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: EkoColors.lightSteelBlue,
    backgroundColor: EkoColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  terugPressed: {
    borderColor: EkoColors.primary,
  },
  terugTeken: {
    fontSize: 22,
    lineHeight: 26,
    marginTop: -2,
    color: EkoColors.primaryDark,
  },
  heading: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 14,
    letterSpacing: 3,
    color: EkoColors.primaryDark,
  },
  canvas: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 12,
    borderWidth: 2,
    borderColor: EkoColors.primaryDark,
    borderRadius: EkoRadius.small,
    backgroundColor: EkoColors.white,
    overflow: 'hidden',
  },
});
