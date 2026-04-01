import { useState, useEffect } from 'react';
import { useTrack } from '../hooks/useTrack';
import { useStatFlash } from '../hooks/useStatFlash';
import { useIsMobile } from '../hooks/useIsMobile';
import StatsPanel from './StatsPanel';
import { ADULTHOOD_EVENTS, type EventOption } from '../data/adulthoodEvents';
import type { Character, CharacterStats } from '../types';

// ─── Brand colors ──────────────────────────────────────────────────────────────
const GOLD       = '#c9a84c';
const GOLD_LIGHT = '#e8d08a';
const GARNET     = '#8b1a2a';

// ─── Helpers ───────────────────────────────────────────────────────────────────

function applyDeltas(stats: CharacterStats, deltas: Partial<CharacterStats>): CharacterStats {
  const next = { ...stats };
  for (const [k, v] of Object.entries(deltas) as [keyof CharacterStats, number][]) {
    next[k] = parseFloat(Math.min(10, Math.max(0, next[k] + v)).toFixed(1));
  }
  return next;
}

function Diamond({ color }: { color: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill={color} style={{ flexShrink: 0 }}>
      <polygon points="5,0 10,5 5,10 0,5" />
    </svg>
  );
}

// ─── Progress dots ─────────────────────────────────────────────────────────────

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i < current ? '28px' : '8px',
          height: '8px',
          borderRadius: '99px',
          background: i < current
            ? `linear-gradient(90deg, ${GARNET}, ${GOLD})`
            : i === current
            ? `rgba(201,168,76,0.4)`
            : 'rgba(255,255,255,0.06)',
          border: i === current ? `1px solid rgba(201,168,76,0.5)` : '1px solid transparent',
          transition: 'all 0.4s ease',
        }} />
      ))}
    </div>
  );
}

// ─── Option button ─────────────────────────────────────────────────────────────

function OptionButton({
  option,
  selected,
  revealed,
  onSelect,
}: {
  option: EventOption;
  selected: boolean;
  revealed: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isActive = selected || hovered;

  return (
    <button
      onClick={onSelect}
      disabled={revealed}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        padding: '18px 22px',
        borderRadius: '8px',
        border: `1px solid ${selected
          ? 'rgba(201,168,76,0.6)'
          : isActive
          ? 'rgba(201,168,76,0.3)'
          : 'rgba(255,255,255,0.07)'}`,
        background: selected
          ? 'rgba(201,168,76,0.1)'
          : isActive
          ? 'rgba(201,168,76,0.04)'
          : 'rgba(0,0,0,0.3)',
        cursor: revealed ? 'default' : 'pointer',
        transition: 'all 0.25s ease',
        textAlign: 'left',
        backdropFilter: 'blur(6px)',
        boxShadow: selected ? `0 0 20px rgba(201,168,76,0.15)` : 'none',
      }}
    >
      <p className="crimson" style={{
        margin: 0,
        fontSize: '15px',
        lineHeight: 1.6,
        color: selected ? GOLD_LIGHT : isActive ? '#c8b080' : '#8a7055',
        fontStyle: 'italic',
        transition: 'color 0.25s ease',
      }}>
        {option.text}
      </p>

      {selected && (
        <p className="crimson" style={{
          margin: '10px 0 0',
          fontSize: '13px',
          lineHeight: 1.55,
          color: 'rgba(201,168,76,0.6)',
          fontStyle: 'italic',
          borderTop: '1px solid rgba(201,168,76,0.15)',
          paddingTop: '10px',
        }}>
          {option.consequence}
        </p>
      )}
    </button>
  );
}

// ─── Single event card ─────────────────────────────────────────────────────────

function EventCard({
  event,
  character,
  eventIndex,
  totalEvents,
  isActive,
  isDone,
  onChoice,
}: {
  event: typeof ADULTHOOD_EVENTS[0];
  character: Character;
  eventIndex: number;
  totalEvents: number;
  isActive: boolean;
  isDone: boolean;
  onChoice: (option: EventOption) => void;
}) {
  const [chosen, setChosen] = useState<EventOption | null>(null);
  const [visible, setVisible] = useState(false);
  const [options] = useState(() => event.getOptions(character));

  useEffect(() => {
    if (isActive) {
      const t = setTimeout(() => setVisible(true), 80);
      return () => clearTimeout(t);
    }
  }, [isActive]);

  const handleSelect = (option: EventOption) => {
    if (isDone) return;
    setChosen(option);
  };

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.6s ease, transform 0.6s ease',
      width: '100%',
      maxWidth: '720px',
    }}>
      {/* Event header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '20px',
      }}>
        <div style={{
          flexShrink: 0,
          padding: '6px 14px',
          borderRadius: '6px',
          border: `1px solid rgba(201,168,76,0.3)`,
          background: 'rgba(201,168,76,0.06)',
        }}>
          <span className="cinzel" style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            color: GOLD,
          }}>
            {event.age} años
          </span>
        </div>

        <h2 className="cinzel" style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: GOLD_LIGHT,
        }}>
          {event.title}
        </h2>

        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(201,168,76,0.2), transparent)' }} />

        <ProgressDots total={totalEvents} current={eventIndex} />
      </div>

      {/* Narrative */}
      <p className="crimson" style={{
        fontSize: '17px',
        lineHeight: '1.75',
        color: '#b09070',
        fontStyle: 'italic',
        margin: '0 0 24px',
      }}>
        {event.getNarrative(character)}
      </p>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
        {options.map((opt) => (
          <OptionButton
            key={opt.id}
            option={opt}
            selected={chosen?.id === opt.id}
            revealed={isDone}
            onSelect={() => handleSelect(opt)}
          />
        ))}
      </div>

      {/* Confirm button */}
      {chosen && !isDone && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => onChoice(chosen)}
            style={{
              padding: '12px 36px',
              borderRadius: '6px',
              border: '1px solid rgba(201,168,76,0.5)',
              background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(139,100,30,0.2))',
              color: GOLD_LIGHT,
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: "'Cinzel', serif",
              boxShadow: '0 0 20px rgba(201,168,76,0.15)',
              transition: 'all 0.2s ease',
            }}
          >
            Continuar →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main screen ───────────────────────────────────────────────────────────────

export default function AdulthoodScreen({
  character,
  onComplete,
}: {
  character: Character;
  onComplete: (updated: Character) => void;
}) {
  useTrack('/music/old-chantry.mp3');
  const { flashMap, triggerFlash } = useStatFlash();
  const isMobile = useIsMobile();
  const [currentEvent, setCurrentEvent] = useState(0);
  const [currentCharacter, setCurrentCharacter] = useState<Character>(character);
  const [completedChoices, setCompletedChoices] = useState<EventOption[]>([]);
  const [allDone, setAllDone] = useState(false);

  const handleChoice = (option: EventOption) => {
    const updatedStats = applyDeltas(currentCharacter.stats, option.statDeltas);
    const updatedFlags = { ...currentCharacter.flags };
    if (option.flag) updatedFlags[option.flag.key] = option.flag.value;

    const updated: Character = {
      ...currentCharacter,
      stats: updatedStats,
      flags: updatedFlags,
    };

    triggerFlash(option.statDeltas);
    setCurrentCharacter(updated);
    setCompletedChoices([...completedChoices, option]);

    if (currentEvent + 1 >= ADULTHOOD_EVENTS.length) {
      setAllDone(true);
    } else {
      setTimeout(() => setCurrentEvent(currentEvent + 1), 400);
    }
  };

  return (
    <div
      className="leather-bg screen-enter"
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: isMobile ? '24px 0 48px' : '40px 0 64px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <StatsPanel stats={currentCharacter.stats} flashMap={flashMap} name={currentCharacter.name} />
      {/* Vignette */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(5,3,2,0.75) 100%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '1100px',
        padding: isMobile ? '0 16px' : '0 40px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>

        {/* Title logo */}
        <img
          src="/fateborn_title.png"
          alt="FATEBORN"
          style={{
            width: '100%', maxWidth: '380px', height: 'auto',
            marginBottom: '4px', mixBlendMode: 'screen', display: 'block',
          }}
        />

        {/* Stage header */}
        <div className="ornament-divider" style={{ marginBottom: '10px' }}>
          <Diamond color={`${GOLD}50`} />
        </div>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1 className="cinzel" style={{
            margin: '0 0 6px',
            fontSize: '28px',
            fontWeight: 900,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: GOLD_LIGHT,
          }}>
            Adultez
          </h1>
          <p className="cinzel" style={{
            margin: 0,
            fontSize: '11px',
            letterSpacing: '0.3em',
            color: 'rgba(201,168,76,0.4)',
            textTransform: 'uppercase',
          }}>
            31 — 50 años
          </p>
        </div>

        {/* Character name tag */}
        <div style={{
          marginBottom: '44px',
          padding: '10px 28px',
          borderRadius: '6px',
          border: '1px solid rgba(201,168,76,0.15)',
          background: 'rgba(0,0,0,0.25)',
        }}>
          <span className="cinzel" style={{
            fontSize: '13px',
            letterSpacing: '0.18em',
            color: 'rgba(201,168,76,0.5)',
            textTransform: 'uppercase',
          }}>
            {character.name}
          </span>
        </div>

        {/* Events */}
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '48px',
        }}>
          {ADULTHOOD_EVENTS.map((event, i) => {
            if (i > currentEvent) return null;
            return (
              <EventCard
                key={event.id}
                event={event}
                character={i === 0 ? character : currentCharacter}
                eventIndex={i}
                totalEvents={ADULTHOOD_EVENTS.length}
                isActive={i === currentEvent}
                isDone={i < currentEvent || allDone}
                onChoice={handleChoice}
              />
            );
          })}
        </div>

        {/* CONTINUAR button */}
        {allDone && (
          <div
            className="fade-up"
            style={{ marginTop: '56px', animationDelay: '0.3s' }}
          >
            {/* Summary */}
            <div style={{
              marginBottom: '32px',
              padding: '20px 32px',
              borderRadius: '10px',
              border: '1px solid rgba(201,168,76,0.12)',
              background: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(8px)',
              textAlign: 'center',
            }}>
              <p className="cinzel" style={{
                fontSize: '9px',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'rgba(201,168,76,0.4)',
                margin: '0 0 14px',
              }}>
                Lo que te definió en estos años
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {completedChoices.map((_choice, i) => (
                  <div key={i} style={{
                    padding: '4px 14px',
                    borderRadius: '4px',
                    border: '1px solid rgba(201,168,76,0.2)',
                    background: 'rgba(201,168,76,0.05)',
                  }}>
                    <span className="cinzel" style={{
                      fontSize: '10px',
                      letterSpacing: '0.1em',
                      color: 'rgba(201,168,76,0.5)',
                    }}>
                      {ADULTHOOD_EVENTS[i].title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
              <div className="ornament-divider" style={{ maxWidth: '400px' }}>
                <Diamond color={`${GARNET}60`} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', width: isMobile ? '100%' : 'auto' }}>
              <button
                onClick={() => onComplete(currentCharacter)}
                style={{
                  padding: isMobile ? '16px 24px' : '18px 72px',

                  width: isMobile ? '100%' : 'auto',
                  borderRadius: '7px',
                  border: '1px solid rgba(201,168,76,0.55)',
                  background: 'linear-gradient(135deg, rgba(201,168,76,0.18), rgba(139,100,30,0.25))',
                  color: GOLD_LIGHT,
                  fontSize: '15px',
                  fontWeight: 700,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontFamily: "'Cinzel', serif",
                  boxShadow: '0 0 24px rgba(201,168,76,0.2), 0 0 60px rgba(201,168,76,0.08), inset 0 1px 0 rgba(201,168,76,0.15)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.boxShadow = '0 0 36px rgba(201,168,76,0.35), 0 0 80px rgba(201,168,76,0.12), inset 0 1px 0 rgba(201,168,76,0.2)';
                  b.style.borderColor = 'rgba(201,168,76,0.75)';
                }}
                onMouseLeave={(e) => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.boxShadow = '0 0 24px rgba(201,168,76,0.2), 0 0 60px rgba(201,168,76,0.08), inset 0 1px 0 rgba(201,168,76,0.15)';
                  b.style.borderColor = 'rgba(201,168,76,0.55)';
                }}
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* Bottom ornament */}
        <div className="ornament-divider" style={{ marginTop: '56px', maxWidth: '300px' }}>
          <Diamond color={`${GOLD}30`} />
        </div>

      </div>
    </div>
  );
}
