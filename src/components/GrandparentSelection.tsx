import { useState } from 'react';
import { useTrack } from '../hooks/useTrack';
import { archetypes } from '../data/archetypes';
import type { Archetype } from '../types';

// Brand colors
const GOLD = '#c9a84c';
const GOLD_LIGHT = '#e8d08a';
const GOLD_DIM = '#3a2a10';

// ─── Stat bar ────────────────────────────────────────────────────────────────

function StatBar({ name, value, color }: { name: string; value: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span
        style={{
          color: '#8a7558',
          fontSize: '11px',
          width: '90px',
          textAlign: 'right',
          flexShrink: 0,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          fontFamily: "'Cinzel', serif",
        }}
      >
        {name}
      </span>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '70%',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '99px',
            height: '4px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.05)',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: `${value * 10}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${color}88, ${color})`,
              borderRadius: '99px',
              transition: 'width 0.5s ease',
              boxShadow: `0 0 6px ${color}70`,
            }}
          />
        </div>
        <span style={{ color: '#6b5c3e', fontSize: '12px', fontFamily: "'Cinzel', serif", lineHeight: 1 }}>
          {value}
        </span>
      </div>
    </div>
  );
}

// ─── Archetype card ───────────────────────────────────────────────────────────

function ArchetypeCard({
  archetype,
  count,
  totalSelected,
  onAdd,
  onRemove,
}: {
  archetype: Archetype;
  count: number;          // veces que este arquetipo está seleccionado
  totalSelected: number;  // total de slots ocupados
  onAdd: () => void;
  onRemove: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isSelected = count > 0;
  const canAdd = totalSelected < 4;

  const borderColor = isSelected
    ? `rgba(201,168,76,0.5)`
    : hovered
    ? `${archetype.accentColor}55`
    : `${archetype.accentColor}18`;

  const boxShadow = isSelected
    ? `0 0 20px rgba(201,168,76,0.2), 0 4px 24px rgba(0,0,0,0.6)`
    : hovered
    ? `0 0 14px ${archetype.accentColor}25, 0 4px 20px rgba(0,0,0,0.5)`
    : `0 2px 12px rgba(0,0,0,0.4)`;

  const cardBg = isSelected
    ? 'rgba(201,168,76,0.06)'
    : hovered
    ? 'rgba(255,255,255,0.025)'
    : 'rgba(13,10,6,0.85)';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 16px 14px',
        borderRadius: '8px',
        border: `1px solid ${borderColor}`,
        background: cardBg,
        boxShadow,
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
        background: isSelected
          ? `linear-gradient(90deg, transparent, ${GOLD}, transparent)`
          : `linear-gradient(90deg, transparent, ${archetype.accentColor}60, transparent)`,
        transition: 'all 0.3s ease',
      }} />

      {/* Header: emoji + nombre + contador */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <span style={{ fontSize: '24px', lineHeight: 1, flexShrink: 0, filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.8))' }}>
          {archetype.symbol}
        </span>
        <div
          className="cinzel"
          style={{
            color: isSelected ? GOLD_LIGHT : `${archetype.accentColor}ee`,
            fontSize: '16px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            lineHeight: 1.1,
            flex: 1,
            transition: 'color 0.3s ease',
          }}
        >
          {archetype.name}
        </div>
        {/* Contador de instancias */}
        {isSelected && (
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'rgba(201,168,76,0.15)',
            border: `1px solid rgba(201,168,76,0.5)`,
            color: GOLD_LIGHT,
            fontSize: '14px',
            fontWeight: 700,
            fontFamily: "'Cinzel', serif",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            {count}
          </div>
        )}
      </div>

      {/* Separator */}
      <div style={{
        height: '1px',
        background: `linear-gradient(90deg, ${archetype.accentColor}40, transparent)`,
        marginBottom: '10px',
      }} />

      {/* Description */}
      <p className="crimson" style={{
        color: '#a08c6a',
        fontSize: '14px',
        lineHeight: '1.6',
        marginBottom: '14px',
        fontStyle: 'italic',
        flex: 1,
      }}>
        {archetype.description}
      </p>

      {/* Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '14px' }}>
        {archetype.stats.map((stat) => (
          <StatBar
            key={stat.name}
            name={stat.name}
            value={stat.value}
            color={isSelected ? GOLD : archetype.accentColor}
          />
        ))}
      </div>

      {/* Botones AÑADIR / QUITAR */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={onAdd}
          disabled={!canAdd}
          style={{
            flex: 1,
            padding: '9px 0',
            borderRadius: '5px',
            border: `1px solid ${canAdd ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.06)'}`,
            background: canAdd ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.02)',
            color: canAdd ? GOLD_LIGHT : GOLD_DIM,
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor: canAdd ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            fontFamily: "'Cinzel', serif",
          }}
        >
          + Añadir
        </button>
        <button
          onClick={onRemove}
          disabled={!isSelected}
          style={{
            flex: 1,
            padding: '9px 0',
            borderRadius: '5px',
            border: `1px solid ${isSelected ? 'rgba(160,50,40,0.5)' : 'rgba(255,255,255,0.04)'}`,
            background: isSelected ? 'rgba(160,50,40,0.08)' : 'rgba(255,255,255,0.01)',
            color: isSelected ? '#d4706a' : '#2a1a10',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor: isSelected ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            fontFamily: "'Cinzel', serif",
          }}
        >
          − Quitar
        </button>
      </div>
    </div>
  );
}

// ─── Slot ─────────────────────────────────────────────────────────────────────

function AncestorSlot({ index, archetype }: { index: number; archetype?: Archetype }) {
  const filled = !!archetype;
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      padding: '12px 16px',
      borderRadius: '8px',
      border: `1px solid ${filled ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.06)'}`,
      background: filled ? 'rgba(201,168,76,0.06)' : 'rgba(255,255,255,0.02)',
      minWidth: '150px',
      transition: 'all 0.3s ease',
      boxShadow: filled ? '0 0 16px rgba(201,168,76,0.15)' : 'none',
    }}>
      <span className="cinzel" style={{
        color: filled ? 'rgba(201,168,76,0.6)' : '#2a1f10',
        fontSize: '9px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        fontWeight: 700,
      }}>
        {index < 2 ? `Abuelo ${index + 1}` : `Abuela ${index - 1}`}
      </span>
      {filled ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px', lineHeight: 1 }}>{archetype!.symbol}</span>
          <span className="cinzel" style={{
            color: GOLD_LIGHT,
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.07em',
          }}>
            {archetype!.name}
          </span>
        </div>
      ) : (
        <span className="crimson" style={{ color: '#3a2a18', fontSize: '13px', fontStyle: 'italic' }}>
          — vacío —
        </span>
      )}
    </div>
  );
}

// ─── Ornament ─────────────────────────────────────────────────────────────────

function Diamond({ color }: { color: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill={color} style={{ flexShrink: 0 }}>
      <polygon points="5,0 10,5 5,10 0,5" />
    </svg>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function GrandparentSelection({
  onConfirm,
}: {
  onConfirm: (selected: string[]) => void;
}) {
  useTrack('/music/opening.mp3');
  // Array de hasta 4 archetypeIds — pueden repetirse
  const [selected, setSelected] = useState<string[]>([]);

  const countOf = (id: string) => selected.filter((s) => s === id).length;
  const isComplete = selected.length === 4;
  const remaining = 4 - selected.length;

  const handleAdd = (id: string) => {
    if (selected.length < 4) setSelected([...selected, id]);
  };

  const handleRemove = (id: string) => {
    const idx = selected.lastIndexOf(id);
    if (idx === -1) return;
    setSelected([...selected.slice(0, idx), ...selected.slice(idx + 1)]);
  };

  const getSlotArchetype = (index: number): Archetype | undefined => {
    const id = selected[index];
    return id ? archetypes.find((a) => a.id === id) : undefined;
  };

  return (
    <div
      className="leather-bg"
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 0 56px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Vignette */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(5,3,2,0.7) 100%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '1400px',
        padding: '0 40px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>

        {/* Banner */}
        <img
          src="/fateborn_title.png"
          alt="FATEBORN"
          style={{
            width: '100%', maxWidth: '600px', height: 'auto',
            marginBottom: '4px', mixBlendMode: 'screen', display: 'block',
          }}
        />

        {/* Ornament divider */}
        <div className="ornament-divider" style={{ marginBottom: '16px' }}>
          <Diamond color={`${GOLD}50`} />
        </div>

        {/* Subtítulo */}
        <p className="cinzel" style={{
          color: '#6b5c3e',
          fontSize: '12px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          margin: '0 0 28px',
          textAlign: 'center',
        }}>
          De su sangre naces. De tus decisiones te forjas.
        </p>

        {/* Panel de slots */}
        <div style={{
          display: 'flex', gap: '12px',
          marginBottom: '36px',
          flexWrap: 'wrap', justifyContent: 'center',
          width: '100%',
          padding: '24px 40px',
          borderRadius: '10px',
          border: '1px solid rgba(201,168,76,0.15)',
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(8px)',
        }}>
          {[0, 1, 2, 3].map((i) => (
            <AncestorSlot key={i} index={i} archetype={getSlotArchetype(i)} />
          ))}
        </div>

        {/* Grid de arquetipos */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          width: '100%',
          marginBottom: '40px',
        }}>
          {archetypes.map((archetype) => (
            <ArchetypeCard
              key={archetype.id}
              archetype={archetype}
              count={countOf(archetype.id)}
              totalSelected={selected.length}
              onAdd={() => handleAdd(archetype.id)}
              onRemove={() => handleRemove(archetype.id)}
            />
          ))}
        </div>

        {/* Botón confirmar */}
        <button
          onClick={() => isComplete && onConfirm(selected)}
          disabled={!isComplete}
          style={{
            padding: '18px 72px',
            borderRadius: '7px',
            border: `1px solid ${isComplete ? 'rgba(201,168,76,0.55)' : 'rgba(255,255,255,0.05)'}`,
            background: isComplete
              ? 'linear-gradient(135deg, rgba(201,168,76,0.18), rgba(139,100,30,0.25))'
              : 'rgba(255,255,255,0.02)',
            color: isComplete ? GOLD_LIGHT : '#2a1f10',
            fontSize: '15px',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            cursor: isComplete ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            fontFamily: "'Cinzel', serif",
            boxShadow: isComplete
              ? `0 0 24px rgba(201,168,76,0.2), 0 0 60px rgba(201,168,76,0.08), inset 0 1px 0 rgba(201,168,76,0.15)`
              : 'none',
          }}
          onMouseEnter={(e) => {
            if (isComplete) {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.boxShadow = '0 0 36px rgba(201,168,76,0.35), 0 0 80px rgba(201,168,76,0.12), inset 0 1px 0 rgba(201,168,76,0.2)';
              b.style.borderColor = 'rgba(201,168,76,0.7)';
            }
          }}
          onMouseLeave={(e) => {
            if (isComplete) {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.boxShadow = '0 0 24px rgba(201,168,76,0.2), 0 0 60px rgba(201,168,76,0.08), inset 0 1px 0 rgba(201,168,76,0.15)';
              b.style.borderColor = 'rgba(201,168,76,0.55)';
            }
          }}
        >
          {isComplete
            ? 'Comenzar el Viaje →'
            : `Selecciona ${remaining} ancestro${remaining !== 1 ? 's' : ''} más`}
        </button>

        {/* Bottom ornament */}
        <div className="ornament-divider" style={{ marginTop: '40px', maxWidth: '300px' }}>
          <Diamond color={`${GOLD}30`} />
        </div>

      </div>
    </div>
  );
}
