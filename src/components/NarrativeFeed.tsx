import { useRef, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

const GOLD = '#c9a84c';

const IMPORTANCE_STYLES = {
  normal:  { border: 'rgba(255,255,255,0.06)', glow: 'none',                          badge: 'rgba(255,255,255,0.12)' },
  alta:    { border: 'rgba(201,168,76,0.35)',  glow: 'none',                          badge: 'rgba(201,168,76,0.25)' },
  critica: { border: 'rgba(201,168,76,0.6)',   glow: '0 0 20px rgba(201,168,76,0.2)', badge: GOLD },
};

export default function NarrativeFeed() {
  const feed          = useGameStore(s => s.narrativeFeed);
  const markAnswered  = useGameStore(s => s.markFeedAnswered);
  const addFeedEntry  = useGameStore(s => s.addFeedEntry);
  const addFlag       = useGameStore(s => s.addFlag);
  const updateLegacy  = useGameStore(s => s.updateLegacy);
  const time          = useGameStore(s => s.time);
  const character     = useGameStore(s => s.character);

  // suppress unused warning — addFlag is used inside handleOption
  void addFlag;

  const feedRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = 0;
  }, [feed.length]);

  const handleOption = (entryId: string, optId: string) => {
    markAnswered(entryId, optId);

    if (optId === 'aceptar' || optId === 'unirse' || optId === 'presentar' || optId === 'entrenar') {
      updateLegacy(5);
      if (character) {
        addFeedEntry({
          semana: time.semanaActual,
          año:    character.birthYear + time.añoActual,
          text:   'Has tomado una decisión que marcará tu camino. El legado familiar crece contigo.',
          importance: 'normal',
        });
      }
    } else if (optId === 'rechazar') {
      addFeedEntry({
        semana: time.semanaActual,
        año:    character ? character.birthYear + time.añoActual : time.añoActual,
        text:   'Has declinado. A veces el camino menos transitado también conduce al destino.',
        importance: 'normal',
      });
    }
  };

  if (feed.length === 0) {
    return (
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'rgba(201,168,76,0.25)', fontFamily: 'sans-serif', fontSize: '13px',
        fontStyle: 'italic', padding: '32px',
      }}>
        Tu historia aún no ha comenzado.
      </div>
    );
  }

  return (
    <div
      ref={feedRef}
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(201,168,76,0.2) transparent',
      }}
    >
      {feed.map(entry => {
        const style    = IMPORTANCE_STYLES[entry.importance];
        const isCritica = entry.importance === 'critica';

        return (
          <div
            key={entry.id}
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              border: `1px solid ${entry.answered ? 'rgba(255,255,255,0.04)' : style.border}`,
              background: entry.answered ? 'rgba(0,0,0,0.15)' : 'rgba(13,11,8,0.7)',
              boxShadow: entry.answered ? 'none' : style.glow,
              opacity: entry.answered ? 0.55 : 1,
              transition: 'all 0.3s ease',
              animation: isCritica && !entry.answered ? 'critica-pulse 2.5s ease-in-out infinite' : undefined,
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '8px',
            }}>
              <span style={{
                fontSize: '9px', letterSpacing: '0.18em', fontFamily: 'sans-serif',
                color: 'rgba(201,168,76,0.4)',
              }}>
                Semana {entry.semana} · {entry.año}
              </span>
              {entry.importance !== 'normal' && (
                <span style={{
                  fontSize: '7px', padding: '2px 6px', borderRadius: '3px',
                  background: entry.importance === 'critica' ? 'rgba(201,168,76,0.18)' : 'rgba(201,168,76,0.1)',
                  color: entry.importance === 'critica' ? GOLD : 'rgba(201,168,76,0.6)',
                  letterSpacing: '0.12em', fontFamily: 'sans-serif', textTransform: 'uppercase' as const,
                }}>
                  {entry.importance === 'alta' ? 'Importante' : 'Crítico'}
                </span>
              )}
            </div>

            {/* Body */}
            <p style={{
              margin: 0,
              fontFamily: entry.importance === 'normal' ? 'sans-serif' : '"Cinzel", serif',
              fontSize: '12px',
              lineHeight: 1.7,
              color: entry.answered
                ? 'rgba(255,255,255,0.3)'
                : entry.importance === 'critica'
                ? 'rgba(232,208,138,0.9)'
                : 'rgba(255,255,255,0.72)',
              letterSpacing: entry.importance !== 'normal' ? '0.02em' : '0.01em',
            }}>
              {entry.text}
            </p>

            {/* Response options */}
            {!entry.answered && entry.responseOptions && entry.responseOptions.length > 0 && (
              <div style={{
                marginTop: '12px',
                display: 'flex', flexDirection: 'column', gap: '6px',
              }}>
                {entry.responseOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => handleOption(entry.id, opt.id)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '5px',
                      border: '1px solid rgba(201,168,76,0.3)',
                      background: 'rgba(201,168,76,0.08)',
                      color: 'rgba(232,208,138,0.85)',
                      fontSize: '11px',
                      fontFamily: 'sans-serif',
                      letterSpacing: '0.04em',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                    }}
                    onPointerEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.15)';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.55)';
                    }}
                    onPointerLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.08)';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.3)';
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* Answered badge */}
            {entry.answered && entry.selectedOptionId && (
              <div style={{
                marginTop: '8px', fontSize: '9px', fontFamily: 'sans-serif',
                color: 'rgba(201,168,76,0.35)', fontStyle: 'italic',
              }}>
                Decisión tomada
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
