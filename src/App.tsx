import { useRef, useEffect, useState } from 'react';
import { useIsMobile } from './hooks/useIsMobile';
import './App.css';
import StartScreen from './components/StartScreen';
import AncestorSelection from './components/AncestorSelection';
import BirthScreen from './components/BirthScreen';
import GameScreen from './components/GameScreen';
import ChildhoodScreen from './components/ChildhoodScreen';
import AdolescenceScreen from './components/AdolescenceScreen';
import YouthScreen from './components/YouthScreen';
import AdulthoodScreen from './components/AdulthoodScreen';
import MaturityScreen from './components/MaturityScreen';
import OldAgeScreen from './components/OldAgeScreen';
import DeathScreen from './components/DeathScreen';
import VitalLoadIndicator from './components/VitalLoadIndicator';
import CharacterPortrait, { getDominantGroup } from './components/CharacterPortrait';
import InitiativeMenu from './components/InitiativeMenu';
import SymptomNotification from './components/SymptomNotification';
import BreakingBadHUD from './components/BreakingBadHUD';
import SaulGoodmanHUD from './components/SaulGoodmanHUD';
import type { LifeStage } from './components/CharacterPortrait';
import type { CharacterStats } from './types';
import { useGameStore } from './store/gameStore';
import type { AppScreen } from './store/gameStore';
import { audioManager } from './utils/audioManager';

// ─── Pantallas de juego activo (muestran HUD) ─────────────────────────────────
const GAMEPLAY_SCREENS = new Set<AppScreen>([
  'childhood', 'adolescence', 'youth', 'adulthood', 'maturity', 'oldage', 'death',
]);

const SCREEN_TO_LIFE_STAGE: Partial<Record<AppScreen, LifeStage>> = {
  childhood:   'childhood',
  adolescence: 'adolescence',
  youth:       'youth',
  adulthood:   'adulthood',
  maturity:    'maturity',
  oldage:      'oldage',
  death:       'oldage',
};

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const screen      = useGameStore(s => s.screen);
  const setScreen   = useGameStore(s => s.setScreen);
  const character   = useGameStore(s => s.character);
  const setCharacter = useGameStore(s => s.setCharacter);
  const economy     = useGameStore(s => s.economy);
  const career      = useGameStore(s => s.career);
  const time        = useGameStore(s => s.time);
  const resetGame   = useGameStore(s => s.resetGame);

  const [muted, setMuted] = useState(audioManager.muted);
  const muteRef = useRef<HTMLButtonElement>(null);
  const isMobile = useIsMobile();

  // Listener nativo con { passive: false } para iOS/Android
  useEffect(() => {
    const btn = muteRef.current;
    if (!btn) return;
    const handle = (e: TouchEvent) => {
      e.preventDefault();
      setMuted(audioManager.toggleMute());
    };
    btn.addEventListener('touchend', handle, { passive: false });
    return () => btn.removeEventListener('touchend', handle);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleMute = () => setMuted(audioManager.toggleMute());

  const handleUpdateStats = (deltas: Partial<CharacterStats>) => {
    if (!character) return;
    const clamp = (v: number) => Math.min(10, Math.max(0, Math.round((v + Number.EPSILON) * 10) / 10));
    const s = character.stats;
    setCharacter({
      ...character,
      stats: {
        logica:      clamp(s.logica      + (deltas.logica      ?? 0)),
        creatividad: clamp(s.creatividad + (deltas.creatividad ?? 0)),
        disciplina:  clamp(s.disciplina  + (deltas.disciplina  ?? 0)),
        carisma:     clamp(s.carisma     + (deltas.carisma     ?? 0)),
        emocional:   clamp(s.emocional   + (deltas.emocional   ?? 0)),
        ambicion:    clamp(s.ambicion    + (deltas.ambicion    ?? 0)),
        fisico:      clamp(s.fisico      + (deltas.fisico      ?? 0)),
        riesgo:      clamp(s.riesgo      + (deltas.riesgo      ?? 0)),
        estabilidad: clamp(s.estabilidad + (deltas.estabilidad ?? 0)),
      },
    });
  };

  // ─── Renderizado de pantalla ──────────────────────────────────────────────
  let content: React.ReactNode = null;

  switch (screen) {
    case 'start':
      content = <StartScreen />;
      break;

    case 'ancestors':
      content = <AncestorSelection />;
      break;

    case 'birth':
      content = <BirthScreen />;
      break;

    case 'game':
      content = character
        ? <GameScreen />
        : null;
      break;

    case 'childhood':
      content = character
        ? <ChildhoodScreen
            character={character}
            onComplete={(updated) => { setCharacter(updated); setScreen('adolescence'); }}
          />
        : null;
      break;

    case 'adolescence':
      content = character
        ? <AdolescenceScreen
            character={character}
            onComplete={(updated) => { setCharacter(updated); setScreen('youth'); }}
          />
        : null;
      break;

    case 'youth':
      content = character
        ? <YouthScreen
            character={character}
            onComplete={(updated) => { setCharacter(updated); setScreen('adulthood'); }}
          />
        : null;
      break;

    case 'adulthood':
      content = character
        ? <AdulthoodScreen
            character={character}
            onComplete={(updated) => { setCharacter(updated); setScreen('maturity'); }}
          />
        : null;
      break;

    case 'maturity':
      content = character
        ? <MaturityScreen
            character={character}
            onComplete={(updated) => { setCharacter(updated); setScreen('oldage'); }}
          />
        : null;
      break;

    case 'oldage':
      content = character
        ? <OldAgeScreen
            character={character}
            onComplete={(updated) => { setCharacter(updated); setScreen('death'); }}
          />
        : null;
      break;

    case 'death':
      content = character
        ? <DeathScreen
            character={character}
            onRestart={() => { resetGame(); }}
          />
        : null;
      break;
  }

  const isGameplay = GAMEPLAY_SCREENS.has(screen);

  return (
    <>
      {content}

      {/* ── Botón de mute ── */}
      <button
        ref={muteRef}
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

      {/* ── Indicador de Carga Vital ── */}
      {isGameplay && character && (
        <VitalLoadIndicator stats={character.stats} visible />
      )}

      {/* ── Menú de Iniciativas ── */}
      {isGameplay && character && (
        <InitiativeMenu
          character={character}
          economy={economy}
          career={career}
          time={time}
          onUpdateStats={handleUpdateStats}
          currentAge={screen === 'adolescence' && time.narrativeAge > 0
            ? time.narrativeAge
            : undefined}
        />
      )}

      {/* ── Notificaciones de síntomas ── */}
      <SymptomNotification />

      {/* ── Breaking Bad HUD ── */}
      <BreakingBadHUD />

      {/* ── Saul Goodman HUD ── */}
      <SaulGoodmanHUD />

      {/* ── Retrato del personaje (top-left durante el juego) ── */}
      {isGameplay && character && (
        <div style={{
          position:      'fixed',
          top:           '14px',
          left:          '16px',
          zIndex:        10001,
          display:       'flex',
          alignItems:    'center',
          gap:           '8px',
          pointerEvents: 'none',
        }}>
          <CharacterPortrait
            stage={SCREEN_TO_LIFE_STAGE[screen] ?? 'youth'}
            gender={character.gender}
            dominantGroup={getDominantGroup(character.stats)}
            size={46}
          />
          <span style={{
            fontFamily:    '"Cinzel", serif',
            fontSize:      '9px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color:         'rgba(201,168,76,0.35)',
          }}>
            {character.name}
          </span>
        </div>
      )}

      {/* ── Crédito de música ── */}
      <div style={{
        position:      'fixed',
        bottom:        '12px',
        left:          isMobile ? 'auto' : '16px',
        right:         isMobile ? '12px' : 'auto',
        zIndex:        100,
        fontFamily:    'sans-serif',
        fontSize:      '9px',
        letterSpacing: '0.04em',
        color:         'rgba(201,168,76,0.22)',
        pointerEvents: 'none',
        lineHeight:    1.4,
        userSelect:    'none',
      }}>
        Música: Serat — Piano Textures
      </div>
    </>
  );
}

export default App;
