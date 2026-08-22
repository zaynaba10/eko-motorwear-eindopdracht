/**
 * useGameEngine.ts
 * Alle spellogica zit in deze custom hook: de game loop, de natuurkunde,
 * de score, de timer en de bende. Het scherm hoeft alleen nog te tekenen.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { CHASERS, CHASER_STAP_INTERVAL, GAME, OBSTACLES, SCORE } from './gameConfig';
import { geraaktObstakel, overObstakel } from './obstacles';
import { terrainSlope } from './terrain';

export type GameStatus = 'idle' | 'running' | 'won' | 'lost';

type Chaser = { id: string; gap: number };

type World = {
  distance: number;   // afgelegde wereldafstand in px
  speed: number;
  altitude: number;   // hoogte bóven de grond (0 = op de grond)
  vy: number;         // verticale snelheid tijdens een sprong
  airborne: boolean;
  airTime: number;
  bonus: number;
  straf: number;        // opgetelde puntenaftrek van botsingen
  gesprongen: number;   // aantal obstakels dat je succesvol nam
  laatsteSprong: number | null; // id van het laatst genomen obstakel
  boostTijd: number;    // resterende seconden dat de boost oplicht
  elapsed: number;      // hoelang je al onderweg bent
  crashes: number;
  onkwetsbaar: number;  // seconden waarin een tweede botsing niet telt
  chasers: Chaser[];
};

export type GameFrame = {
  distance: number;
  speed: number;
  altitude: number;
  airborne: boolean;
  elapsed: number;      // verstreken seconden
  timeLeft: number;     // resterende seconden (alleen zinvol in de tijdrit)
  chasers: Chaser[];
  score: number;
  crashes: number;
  gesprongen: number;   // aantal geslaagde sprongen
  geraakt: boolean;     // net gebotst? (voor de knipper-animatie)
  boost: boolean;       // net een obstakel genomen? (voor de oranje meter)
};

const createWorld = (): World => ({
  distance: 0,
  speed: GAME.startSpeed,
  altitude: 0,
  vy: 0,
  airborne: false,
  airTime: 0,
  bonus: 0,
  straf: 0,
  gesprongen: 0,
  laatsteSprong: null,
  boostTijd: 0,
  elapsed: 0,
  crashes: 0,
  onkwetsbaar: 0,
  chasers: CHASERS.map((c) => ({ id: c.id, gap: c.startGap })),
});

const snapshot = (w: World): GameFrame => ({
  distance: w.distance,
  speed: w.speed,
  altitude: w.altitude,
  airborne: w.airborne,
  elapsed: w.elapsed,
  timeLeft: Math.max(0, GAME.duration - w.elapsed),
  chasers: w.chasers.map((c) => ({ ...c })),
  score: Math.max(
    0,
    Math.floor((w.distance / SCORE.pixelsPerMeter) * SCORE.perMeter) +
      Math.floor(w.bonus) -
      w.straf
  ),
  crashes: w.crashes,
  gesprongen: w.gesprongen,
  geraakt: w.onkwetsbaar > 0,
  boost: w.boostTijd > 0,
});

export default function useGameEngine(screenHeight: number) {
  const [status, setStatus] = useState<GameStatus>('idle');
  const [frame, setFrame] = useState<GameFrame>(() => snapshot(createWorld()));

  const world = useRef<World>(createWorld());
  const input = useRef({ left: false, right: false });
  const heightRef = useRef(screenHeight);
  heightRef.current = screenHeight;

  const setInput = useCallback((key: 'left' | 'right', value: boolean) => {
    input.current[key] = value;
  }, []);

  const jump = useCallback(() => {
    const w = world.current;
    if (!w.airborne) {
      w.airborne = true;
      w.vy = GAME.jumpForce;
    }
  }, []);

  const start = useCallback(() => {
    world.current = createWorld();
    input.current = { left: false, right: false };
    setFrame(snapshot(world.current));
    setStatus('running');
  }, []);

  /** Eén stap van de simulatie. dt = verstreken tijd in seconden. */
  const update = useCallback((dt: number): GameStatus => {
    const w = world.current;
    const height = heightRef.current;

    // --- 1. snelheid: gas, remmen, luchtweerstand en helling ---
    // Gas geven werkt altijd, maar de luchtweerstand groeit mee met je snelheid.
    // Daardoor blijf je versnellen zolang je drukt en nader je een eindsnelheid,
    // precies zoals bij een echte motor.
    if (input.current.right) {
      w.speed += (GAME.accel - GAME.luchtweerstand * w.speed) * dt;
    } else if (input.current.left) {
      w.speed -= GAME.brake * dt;
    } else {
      w.speed -= GAME.rolWeerstand * w.speed * dt;
    }

    if (!w.airborne) {
      const slope = terrainSlope(w.distance, height);
      w.speed += slope * GAME.slopeForce * dt; // bergaf sneller, bergop trager
    }
    w.speed = Math.max(GAME.minSpeed, Math.min(GAME.maxSpeed, w.speed));

    // --- 2. positie ---
    w.distance += w.speed * dt;

    // --- 3. springen en landen ---
    if (w.airborne) {
      w.vy -= GAME.gravity * dt;
      w.altitude += w.vy * dt;
      w.airTime += dt;
      if (w.altitude <= 0) {
        w.altitude = 0;
        w.vy = 0;
        w.airborne = false;
        w.bonus += w.airTime * SCORE.airBonusPerSecond; // stuntbonus
        w.airTime = 0;
      }
    }

    // --- 3b. botsen met een kegel, vat of band ---
    if (w.onkwetsbaar > 0) {
      w.onkwetsbaar -= dt;
    } else if (geraaktObstakel(w.distance, w.altitude)) {
      w.speed = Math.max(GAME.minSpeed, w.speed * OBSTACLES.penaltyFactor); // je valt bijna stil
      w.straf += OBSTACLES.penaltyPoints;
      w.crashes += 1;
      w.onkwetsbaar = OBSTACLES.hitCooldown;         // even geen tweede treffer
    }

    // --- 3c. beloning: elk obstakel dat je nu neemt, geeft een zetje ---
    if (w.boostTijd > 0) w.boostTijd -= dt;
    const genomen = overObstakel(w.distance, w.altitude);
    if (genomen && genomen.id !== w.laatsteSprong) {
      w.laatsteSprong = genomen.id;
      w.gesprongen += 1;
      w.speed = Math.min(GAME.maxSpeed, w.speed + OBSTACLES.boost);
      w.bonus += OBSTACLES.boostPoints;
      w.boostTijd = OBSTACLES.boostDuur;
    }

    // --- 4. de bende haalt in als jij te traag rijdt ---
    // Elke CHASER_STAP_INTERVAL seconden schakelt de bende een tandje bij.
    const versnelling = Math.floor(w.elapsed / CHASER_STAP_INTERVAL);
    let caught = false;
    w.chasers.forEach((chaser, i) => {
      const config = CHASERS[i];
      const chaserSpeed = config.speed + config.stap * versnelling;
      chaser.gap += (w.speed - chaserSpeed) * dt;
      chaser.gap = Math.min(chaser.gap, config.startGap + SCORE.maxGapAhead);
      if (chaser.gap <= SCORE.catchGap) caught = true;
    });

    // --- 5. klok ---
    w.elapsed += dt;

    setFrame(snapshot(w));

    if (caught) return 'lost';
    // Haal je de volle 60 seconden, dan ben je ontsnapt.
    if (w.elapsed >= GAME.duration) {
      w.elapsed = GAME.duration;
      return 'won';
    }
    return 'running';
  }, []);

  // --- de game loop ---
  useEffect(() => {
    if (status !== 'running') return undefined;

    let raf: number | undefined;
    let last = Date.now();
    let stopped = false;

    const loop = () => {
      if (stopped) return;
      const now = Date.now();
      const dt = Math.min((now - last) / 1000, 0.05); // spikes afvlakken
      last = now;

      const result = update(dt);
      if (result !== 'running') {
        stopped = true;
        setStatus(result);
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      stopped = true;
      if (raf !== undefined) cancelAnimationFrame(raf);
    };
  }, [status, update]);

  // --- bonus: échte pijltjestoetsen als je de app in de browser test ---
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return undefined;

    const down = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setInput('right', true);
      if (e.key === 'ArrowLeft') setInput('left', true);
      if (e.key === 'ArrowUp' || e.key === ' ') jump();
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setInput('right', false);
      if (e.key === 'ArrowLeft') setInput('left', false);
    };

    document.addEventListener('keydown', down);
    document.addEventListener('keyup', up);
    return () => {
      document.removeEventListener('keydown', down);
      document.removeEventListener('keyup', up);
    };
  }, [jump, setInput]);

  return { status, frame, start, restart: start, setInput, jump };
}
