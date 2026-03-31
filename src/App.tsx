import React, { useState, useRef, useCallback } from 'react';
import './App.css';
import GrandparentSelection from './components/GrandparentSelection';
import BirthScreen from './components/BirthScreen';
import ChildhoodScreen from './components/ChildhoodScreen';
import AdolescenceScreen from './components/AdolescenceScreen';
import YouthScreen from './components/YouthScreen';
import AdulthoodScreen from './components/AdulthoodScreen';
import MaturityScreen from './components/MaturityScreen';
import OldAgeScreen from './components/OldAgeScreen';
import DeathScreen from './components/DeathScreen';
import type { Character } from './types';
import { audioManager } from './utils/audioManager';

type Screen =
  | 'ancestors' | 'birth' | 'childhood' | 'adolescence'
  | 'youth' | 'adulthood' | 'maturity' | 'oldage' | 'death';

// ─── Títulos de etapa vital ────────────────────────────────────────────────
const STAGE_TITLES: Partial<Record<Screen, { name: string; years: string }>> = {
  childhood:   { name: 'INFANCIA',     years: '0 — 12 AÑOS'  },
  adolescence: { name: 'ADOLESCENCIA', years: '13 — 18 AÑOS' },
  youth:       { name: 'JUVENTUD',     years: '19 — 30 AÑOS' },
  adulthood:   { name: 'ADULTEZ',      years: '31 — 50 AÑOS' },
  maturity:    { name: 'MADUREZ',      years: '51 — 70 AÑOS' },
  oldage:      { name: 'VEJEZ',        years: '71+ AÑOS'     },
};

const FADE_MS       = 800;
const DEATH_FADE_MS = 2000;
const STAGE_HOLD_MS = 1500;
// Tiempo máximo que puede durar una transición completa antes del safety reset
const SAFETY_MS     = 6000;

// ─── App ──────────────────────────────────────────────────────────────────
function App() {
  const [screen, setScreen]           = useState<Screen>('ancestors');
  const [ancestorIds, setAncestorIds] = useState<string[]>([]);
  const [character, setCharacter]     = useState<Character | null>(null);
  const [muted, setMuted]             = useState(audioManager.muted);
  const toggleMute = () => setMuted(audioManager.toggleMute());

  // Transición
  const [overlayOpaque, setOverlayOpaque] = useState(false);
  const [fadeDuration,  setFadeDuration]  = useState(FADE_MS);
  const [stageTitle, setStageTitle]       = useState<{ name: string; years: string } | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (timerRef.current  !== null) { clearTimeout(timerRef.current);  timerRef.current  = null; }
    if (safetyRef.current !== null) { clearTimeout(safetyRef.current); safetyRef.current = null; }
  };

  /** Fuerza el fin de cualquier transición atascada */
  const forceTransitionEnd = useCallback(() => {
    if (timerRef.current !== null) { clearTimeout(timerRef.current); timerRef.current = null; }
    setStageTitle(null);
    setOverlayOpaque(false);
    setTransitioning(false);
  }, []);

  const navigateTo = useCallback((next: Screen) => {
    clearTimers();
    const isDeath  = next === 'death';
    const fadeMs   = isDeath ? DEATH_FADE_MS : FADE_MS;
    const hasTitle = next in STAGE_TITLES;

    setTransitioning(true);

    // Safety: si algo falla y la pantalla se queda en negro, forzar fin
    safetyRef.current = setTimeout(forceTransitionEnd, SAFETY_MS);

    // Primero aplicar fadeDuration y solo en el siguiente frame cambiar opacity.
    // Esto evita que el navegador ignore la CSS transition cuando ambas propiedades
    // cambian en el mismo render (bug específico en transición a muerte con 2000ms).
    setFadeDuration(fadeMs);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOverlayOpaque(true); // → fade a negro

        timerRef.current = setTimeout(() => {
          // Pantalla completamente negra
          window.scrollTo(0, 0);
          setScreen(next);

          if (hasTitle && !isDeath) {
            setStageTitle(STAGE_TITLES[next]!);

            timerRef.current = setTimeout(() => {
              setStageTitle(null);
              setOverlayOpaque(false); // → fade desde negro

              timerRef.current = setTimeout(() => {
                clearTimers();
                setTransitioning(false);
              }, FADE_MS);
            }, STAGE_HOLD_MS);
          } else {
            setOverlayOpaque(false); // → fade desde negro

            timerRef.current = setTimeout(() => {
              clearTimers();
              setTransitioning(false);
            }, fadeMs);
          }
        }, fadeMs);
      });
    });
  }, [forceTransitionEnd]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Handlers ─────────────────────────────────────────────────────────
  const handleAncestorsConfirmed = (ids: string[]) => {
    setAncestorIds(ids);
    navigateTo('birth');
  };

  const handleBirthConfirmed = (char: Character) => {
    setCharacter(char);
    navigateTo('childhood');
  };

  const handleChildhoodComplete = (updated: Character) => {
    setCharacter(updated);
    navigateTo('adolescence');
  };

  const handleAdolescenceComplete = (updated: Character) => {
    setCharacter(updated);
    navigateTo('youth');
  };

  const handleYouthComplete = (updated: Character) => {
    setCharacter(updated);
    navigateTo('adulthood');
  };

  const handleAdulthoodComplete = (updated: Character) => {
    setCharacter(updated);
    navigateTo('maturity');
  };

  const handleMaturityComplete = (updated: Character) => {
    setCharacter(updated);
    navigateTo('oldage');
  };

  const handleOldAgeComplete = (updated: Character) => {
    setCharacter(updated);
    navigateTo('death');
  };

  const handleRestart = () => {
    setCharacter(null);
    setAncestorIds([]);
    navigateTo('ancestors');
  };

  // ─── Contenido de pantalla ────────────────────────────────────────────
  let content: React.ReactNode = null;

  if (screen === 'ancestors') {
    content = <GrandparentSelection onConfirm={handleAncestorsConfirmed} />;
  } else if (screen === 'birth') {
    content = <BirthScreen ancestorIds={ancestorIds} onConfirm={handleBirthConfirmed} />;
  } else if (screen === 'childhood' && character) {
    content = <ChildhoodScreen character={character} onComplete={handleChildhoodComplete} />;
  } else if (screen === 'adolescence' && character) {
    content = <AdolescenceScreen character={character} onComplete={handleAdolescenceComplete} />;
  } else if (screen === 'youth' && character) {
    content = <YouthScreen character={character} onComplete={handleYouthComplete} />;
  } else if (screen === 'adulthood' && character) {
    content = <AdulthoodScreen character={character} onComplete={handleAdulthoodComplete} />;
  } else if (screen === 'maturity' && character) {
    content = <MaturityScreen character={character} onComplete={handleMaturityComplete} />;
  } else if (screen === 'oldage' && character) {
    content = <OldAgeScreen character={character} onComplete={handleOldAgeComplete} />;
  } else if (screen === 'death' && character) {
    content = <DeathScreen character={character} onRestart={handleRestart} />;
  }

  return (
    <>
      {content}

      {/* ── Overlay de transición cinematográfica ── */}
      <div
        style={{
          position:        'fixed',
          inset:           0,
          backgroundColor: '#000',
          opacity:         overlayOpaque ? 1 : 0,
          transition:      `opacity ${fadeDuration}ms ease`,
          pointerEvents:   transitioning ? 'all' : 'none',
          zIndex:          10000,
          display:         'flex',
          flexDirection:   'column',
          alignItems:      'center',
          justifyContent:  'center',
          gap:             '1rem',
        }}
      >
        {stageTitle && (
          <>
            <div style={{
              fontFamily:    '"Cinzel", serif',
              fontSize:      'clamp(2rem, 5vw, 3.5rem)',
              letterSpacing: '0.35em',
              color:         '#C9A84C',
              textAlign:     'center',
              lineHeight:    1,
            }}>
              {stageTitle.name}
            </div>
            <div style={{
              fontFamily:    '"Cinzel", serif',
              fontSize:      'clamp(0.9rem, 2vw, 1.4rem)',
              letterSpacing: '0.25em',
              color:         'rgba(201,168,76,0.55)',
              textAlign:     'center',
            }}>
              {stageTitle.years}
            </div>
          </>
        )}
      </div>

      {/* ── Botón de mute ── */}
      <button
        onClick={toggleMute}
        title={muted ? 'Activar música' : 'Silenciar música'}
        style={{
          position:       'fixed',
          top:            '18px',
          right:          '20px',
          zIndex:         10001,
          width:          '36px',
          height:         '36px',
          borderRadius:   '50%',
          border:         '1px solid rgba(201,168,76,0.25)',
          background:     'rgba(13,11,8,0.72)',
          backdropFilter: 'blur(8px)',
          cursor:         'pointer',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        0,
          transition:     'border-color 0.2s ease, background 0.2s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.55)';
          (e.currentTarget as HTMLButtonElement).style.background  = 'rgba(20,16,10,0.88)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.25)';
          (e.currentTarget as HTMLButtonElement).style.background  = 'rgba(13,11,8,0.72)';
        }}
      >
        {muted ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.45)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.65)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>

      {/* ── Crédito de música (licencia CC BY) — discreto, esquina inferior izquierda ── */}
      <div style={{
        position:   'fixed',
        bottom:     '12px',
        left:       '16px',
        zIndex:     9998,
        fontFamily: 'sans-serif',
        fontSize:   '9px',
        letterSpacing: '0.04em',
        color:      'rgba(201,168,76,0.22)',
        pointerEvents: 'none',
        lineHeight: 1.4,
        userSelect: 'none',
      }}>
        Música: Serat — Piano Textures
      </div>
    </>
  );
}

export default App;
