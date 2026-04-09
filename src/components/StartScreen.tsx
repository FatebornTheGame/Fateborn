import { useState, useEffect, useRef } from 'react';
import { useTrack } from '../hooks/useTrack';
import { useGameStore } from '../store/gameStore';
import type { GameMode } from '../store/gameStore';

// ─── Brand ────────────────────────────────────────────────────────────────────
const GOLD       = '#c9a84c';
const GOLD_LIGHT = '#e8d08a';
const GARNET     = '#8b1a2a';

// ─── Typewriter config ────────────────────────────────────────────────────────
const LINE1   = 'DE SU SANGRE NACES.';
const LINE2   = 'DE TUS DECISIONES TE FORJAS.';
const CHAR_MS = 68;
const PAUSE_MS = 1500;

// ─── Game modes ───────────────────────────────────────────────────────────────
interface ModeConfig { id: GameMode; label: string; desc: string; color: string }
const MODES: ModeConfig[] = [
  { id: 'historia', label: 'Historia',  desc: 'Sugerencias activas. Experiencia narrativa completa.', color: GOLD   },
  { id: 'fateborn', label: 'Fateborn',  desc: 'Sin sugerencias. Las consecuencias son tuyas.',        color: '#7eb8f7' },
  { id: 'ironman',  label: 'Ironman',   desc: 'Sin sugerencias. Muerte permanente.',                   color: GARNET },
  { id: 'legado',   label: 'Legado',    desc: 'Modo Dinastía obligatorio. El linaje continúa.',        color: '#6ee7a0' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function StartScreen() {
  useTrack('/music/opening.mp3');

  const setGameMode = useGameStore(s => s.setGameMode);
  const setScreen   = useGameStore(s => s.setScreen);

  const [logoVisible,    setLogoVisible]    = useState(false);
  const [typed1,         setTyped1]         = useState('');
  const [typed2,         setTyped2]         = useState('');
  const [line1Done,      setLine1Done]      = useState(false);
  const [line2Done,      setLine2Done]      = useState(false);
  const [showButtons,    setShowButtons]    = useState(false);
  const [selectedMode,   setSelectedMode]   = useState<GameMode>('historia');
  const [hasSave,        setHasSave]        = useState(false);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervals = useRef<ReturnType<typeof setInterval>[]>([]);

  useEffect(() => {
    setHasSave(!!localStorage.getItem('fateborn_save'));

    // Logo fade-in
    const t0 = setTimeout(() => setLogoVisible(true), 80);
    timers.current.push(t0);

    // Line 1 typewriter starts at t=1000ms
    const t1 = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setTyped1(LINE1.slice(0, i));
        if (i >= LINE1.length) {
          clearInterval(iv);
          setLine1Done(true);

          // Pause then line 2
          const t2 = setTimeout(() => {
            let j = 0;
            const iv2 = setInterval(() => {
              j++;
              setTyped2(LINE2.slice(0, j));
              if (j >= LINE2.length) {
                clearInterval(iv2);
                setLine2Done(true);
              }
            }, CHAR_MS);
            intervals.current.push(iv2);
          }, PAUSE_MS);
          timers.current.push(t2);
        }
      }, CHAR_MS);
      intervals.current.push(iv);
    }, 1000);
    timers.current.push(t1);

    // Show buttons at 8s
    const t3 = setTimeout(() => setShowButtons(true), 8000);
    timers.current.push(t3);

    return () => {
      timers.current.forEach(clearTimeout);
      intervals.current.forEach(clearInterval);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStart = () => {
    setGameMode(selectedMode);
    setScreen('ancestors');
  };

  const showCursor1 = typed1.length > 0 && !line1Done;
  const showCursor2 = typed2.length > 0 && !line2Done;

  return (
    <div
      className="leather-bg"
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Vignette */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 25%, rgba(5,3,2,0.88) 100%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 24px',
        width: '100%',
        maxWidth: '680px',
      }}>

        {/* ── Logo / Banner — crece desde semilla ── */}
        <div style={{
          opacity:    logoVisible ? 1 : 0,
          transform:  logoVisible ? 'scale(1)' : 'scale(0.55)',
          transition: 'opacity 2.4s cubic-bezier(0.16,1,0.3,1), transform 2.8s cubic-bezier(0.16,1,0.3,1)',
          marginBottom: '56px',
          width: '100%',
        }}>
          <img
            src="/fateborn_banner_nobg.png"
            alt="FATEBORN"
            style={{
              width: '100%',
              maxWidth: '540px',
              height: 'auto',
              display: 'block',
              margin: '0 auto',
              mixBlendMode: 'screen',
              filter: 'drop-shadow(0 0 48px rgba(201,168,76,0.28)) drop-shadow(0 0 100px rgba(139,26,42,0.15))',
            }}
          />
        </div>

        {/* ── Tagline typewriter ── */}
        <div style={{
          textAlign: 'center',
          minHeight: '72px',
          marginBottom: '48px',
        }}>
          {typed1.length > 0 && (
            <p className="cinzel" style={{
              fontSize: 'clamp(15px, 4vw, 21px)',
              letterSpacing: '0.22em',
              color: GOLD_LIGHT,
              margin: '0 0 10px',
              textTransform: 'uppercase',
            }}>
              {typed1}
              {showCursor1 && (
                <span style={{
                  display: 'inline-block',
                  width: '2px',
                  height: '1em',
                  background: GOLD,
                  marginLeft: '2px',
                  verticalAlign: 'middle',
                  animation: 'cursor-blink 0.9s step-end infinite',
                }} />
              )}
            </p>
          )}
          {typed2.length > 0 && (
            <p className="cinzel" style={{
              fontSize: 'clamp(12px, 3.2vw, 16px)',
              letterSpacing: '0.2em',
              color: `rgba(201,168,76,0.65)`,
              margin: 0,
              textTransform: 'uppercase',
            }}>
              {typed2}
              {showCursor2 && (
                <span style={{
                  display: 'inline-block',
                  width: '2px',
                  height: '1em',
                  background: `${GOLD}88`,
                  marginLeft: '2px',
                  verticalAlign: 'middle',
                  animation: 'cursor-blink 0.9s step-end infinite',
                }} />
              )}
            </p>
          )}
        </div>

        {/* ── Buttons + mode selector — aparecen en t=8s ── */}
        {showButtons && (
          <div style={{
            width: '100%',
            animation: 'fade-up 0.9s cubic-bezier(0.16,1,0.3,1) forwards',
          }}>
            {/* Mode selector */}
            <p className="cinzel" style={{
              fontSize: '9px',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.35)',
              textAlign: 'center',
              margin: '0 0 14px',
            }}>
              Modo de juego
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
              marginBottom: '24px',
            }}>
              {MODES.map(mode => {
                const sel = selectedMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    style={{
                      padding: '13px 14px',
                      minHeight: '44px',
                      borderRadius: '6px',
                      border: `1px solid ${sel ? mode.color + '70' : 'rgba(255,255,255,0.06)'}`,
                      background: sel ? `${mode.color}10` : 'rgba(0,0,0,0.25)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backdropFilter: 'blur(8px)',
                      boxShadow: sel ? `0 0 16px ${mode.color}18` : 'none',
                    }}
                  >
                    <div className="cinzel" style={{
                      fontSize: '11px',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: sel ? mode.color : 'rgba(201,168,76,0.38)',
                      marginBottom: '4px',
                      fontWeight: 700,
                    }}>
                      {mode.label}
                    </div>
                    <div className="crimson" style={{
                      fontSize: '12px',
                      color: sel ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.18)',
                      lineHeight: 1.4,
                    }}>
                      {mode.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Divider ornament */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              marginBottom: '20px',
            }}>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2))' }} />
              <svg width="10" height="10" viewBox="0 0 10 10" fill="rgba(201,168,76,0.3)" style={{ flexShrink: 0 }}>
                <polygon points="5,0 10,5 5,10 0,5" />
              </svg>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(201,168,76,0.2), transparent)' }} />
            </div>

            {/* CTA buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={handleStart}
                style={{
                  width: '100%',
                  padding: '18px',
                  minHeight: '54px',
                  borderRadius: '7px',
                  border: '1px solid rgba(201,168,76,0.55)',
                  background: 'linear-gradient(135deg, rgba(201,168,76,0.18), rgba(139,100,30,0.25))',
                  color: GOLD_LIGHT,
                  fontFamily: "'Cinzel', serif",
                  fontSize: '15px',
                  fontWeight: 700,
                  letterSpacing: '0.26em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: '0 0 28px rgba(201,168,76,0.2), inset 0 1px 0 rgba(201,168,76,0.15)',
                  transition: 'all 0.3s ease',
                }}
                onPointerEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 40px rgba(201,168,76,0.35), inset 0 1px 0 rgba(201,168,76,0.2)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.8)';
                }}
                onPointerLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 28px rgba(201,168,76,0.2), inset 0 1px 0 rgba(201,168,76,0.15)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.55)';
                }}
              >
                Comenzar
              </button>

              {hasSave && (
                <button
                  onClick={() => { /* TODO: implementar carga de partida */ }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    minHeight: '44px',
                    borderRadius: '7px',
                    border: '1px solid rgba(201,168,76,0.18)',
                    background: 'rgba(0,0,0,0.2)',
                    color: 'rgba(201,168,76,0.45)',
                    fontFamily: "'Cinzel', serif",
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onPointerEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.35)'; }}
                  onPointerLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.18)'; }}
                >
                  Continuar Partida
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
