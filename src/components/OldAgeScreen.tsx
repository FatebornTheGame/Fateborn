import { useState, useEffect } from 'react';
import { OLD_AGE_EVENTS, type EventOption } from '../data/oldAgeEvents';
import type { Character, CharacterStats } from '../types';

// ─── Brand colors — tono más apagado y contemplativo ──────────────────────────
const GOLD       = '#a07838';
const GOLD_LIGHT = '#c8a060';
const GARNET     = '#6a1420';
const NARRATIVE  = '#8a6848';

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
            ? `rgba(160,120,56,0.35)`
            : 'rgba(255,255,255,0.04)',
          border: i === current ? `1px solid rgba(160,120,56,0.4)` : '1px solid transparent',
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
          ? 'rgba(160,120,56,0.5)'
          : isActive
          ? 'rgba(160,120,56,0.25)'
          : 'rgba(255,255,255,0.05)'}`,
        background: selected
          ? 'rgba(160,120,56,0.08)'
          : isActive
          ? 'rgba(160,120,56,0.03)'
          : 'rgba(0,0,0,0.25)',
        cursor: revealed ? 'default' : 'pointer',
        transition: 'all 0.25s ease',
        textAlign: 'left',
        backdropFilter: 'blur(6px)',
        boxShadow: selected ? `0 0 16px rgba(160,120,56,0.1)` : 'none',
      }}
    >
      <p className="crimson" style={{
        margin: 0,
        fontSize: '15px',
        lineHeight: 1.7,
        color: selected ? GOLD_LIGHT : isActive ? '#9a7840' : '#6a5035',
        fontStyle: 'italic',
        transition: 'color 0.25s ease',
      }}>
        {option.text}
      </p>

      {selected && (
        <p className="crimson" style={{
          margin: '10px 0 0',
          fontSize: '13px',
          lineHeight: 1.65,
          color: 'rgba(160,120,56,0.55)',
          fontStyle: 'italic',
          borderTop: '1px solid rgba(160,120,56,0.12)',
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
  isLast,
}: {
  event: typeof OLD_AGE_EVENTS[0];
  character: Character;
  eventIndex: number;
  totalEvents: number;
  isActive: boolean;
  isDone: boolean;
  onChoice: (option: EventOption) => void;
  isLast: boolean;
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
      transition: 'opacity 0.8s ease, transform 0.8s ease',
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
          border: `1px solid rgba(160,120,56,0.25)`,
          background: 'rgba(160,120,56,0.04)',
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

        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(160,120,56,0.15), transparent)' }} />

        <ProgressDots total={totalEvents} current={eventIndex} />
      </div>

      {/* Narrative */}
      <p className="crimson" style={{
        fontSize: '17px',
        lineHeight: '1.85',
        color: NARRATIVE,
        fontStyle: 'italic',
        margin: '0 0 28px',
        letterSpacing: '0.01em',
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
              border: '1px solid rgba(160,120,56,0.4)',
              background: 'linear-gradient(135deg, rgba(160,120,56,0.1), rgba(100,70,20,0.15))',
              color: GOLD_LIGHT,
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: "'Cinzel', serif",
              boxShadow: '0 0 14px rgba(160,120,56,0.1)',
              transition: 'all 0.2s ease',
            }}
          >
            {isLast ? 'Descansar →' : 'Continuar →'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Fade to black transition ──────────────────────────────────────────────────

function FinalFade({ onDone }: { onDone: () => void }) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setOpacity(1), 100);
    const t2 = setTimeout(() => onDone(), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0a0806',
      opacity,
      transition: 'opacity 2.8s ease',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <p className="cinzel" style={{
        fontSize: '13px',
        letterSpacing: '0.35em',
        textTransform: 'uppercase',
        color: `rgba(160,120,56,${opacity * 0.5})`,
        transition: 'color 2.8s ease',
      }}>
        Fin
      </p>
    </div>
  );
}

// ─── Main screen ───────────────────────────────────────────────────────────────

export default function OldAgeScreen({
  character,
  onComplete,
}: {
  character: Character;
  onComplete: (updated: Character) => void;
}) {
  const [currentEvent, setCurrentEvent] = useState(0);
  const [currentCharacter, setCurrentCharacter] = useState<Character>(character);
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

    setCurrentCharacter(updated);

    if (currentEvent + 1 >= OLD_AGE_EVENTS.length) {
      setAllDone(true);
    } else {
      setTimeout(() => setCurrentEvent(currentEvent + 1), 500);
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
        padding: '40px 0 64px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Vignette — más intensa */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(4,2,1,0.85) 100%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Fade final hacia la muerte */}
      {allDone && (
        <FinalFade onDone={() => onComplete(currentCharacter)} />
      )}

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '1100px',
        padding: '0 40px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>

        {/* Title logo — más tenue */}
        <img
          src="/fateborn_title.png"
          alt="FATEBORN"
          style={{
            width: '100%', maxWidth: '340px', height: 'auto',
            marginBottom: '4px', mixBlendMode: 'screen', display: 'block',
            opacity: 0.7,
          }}
        />

        {/* Stage header */}
        <div className="ornament-divider" style={{ marginBottom: '10px' }}>
          <Diamond color={`${GOLD}40`} />
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
            Vejez
          </h1>
          <p className="cinzel" style={{
            margin: 0,
            fontSize: '11px',
            letterSpacing: '0.3em',
            color: 'rgba(160,120,56,0.35)',
            textTransform: 'uppercase',
          }}>
            71 años en adelante
          </p>
        </div>

        {/* Character name tag */}
        <div style={{
          marginBottom: '44px',
          padding: '10px 28px',
          borderRadius: '6px',
          border: '1px solid rgba(160,120,56,0.12)',
          background: 'rgba(0,0,0,0.2)',
        }}>
          <span className="cinzel" style={{
            fontSize: '13px',
            letterSpacing: '0.18em',
            color: 'rgba(160,120,56,0.4)',
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
          gap: '56px',
        }}>
          {OLD_AGE_EVENTS.map((event, i) => {
            if (i > currentEvent) return null;
            return (
              <EventCard
                key={event.id}
                event={event}
                character={i === 0 ? character : currentCharacter}
                eventIndex={i}
                totalEvents={OLD_AGE_EVENTS.length}
                isActive={i === currentEvent}
                isDone={i < currentEvent || allDone}
                onChoice={handleChoice}
                isLast={i === OLD_AGE_EVENTS.length - 1}
              />
            );
          })}
        </div>

        {/* Bottom ornament */}
        <div className="ornament-divider" style={{ marginTop: '56px', maxWidth: '300px' }}>
          <Diamond color={`${GOLD}20`} />
        </div>

      </div>
    </div>
  );
}
