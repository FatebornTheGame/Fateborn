import { useState } from 'react';
import type { CSSProperties } from 'react';
import { useTrack } from '../hooks/useTrack';
import { useIsMobile } from '../hooks/useIsMobile';
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
  isMobile,
}: {
  archetype: Archetype;
  count: number;          // veces que este arquetipo está seleccionado
  totalSelected: number;  // total de slots ocupados
  onAdd: () => void;
  onRemove: () => void;
  isMobile: boolean;
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
        overflow: 'hidden',
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
            fontSize: isMobile ? '13px' : '16px',
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

// ─── Genealogy Tree ───────────────────────────────────────────────────────────

/**
 * Organic SVG family tree — cubic bezier branches, tapered widths,
 * root tendrils, junction ornaments, diamond tips.
 * Each of the 4 terminal branches grows in when its ancestor slot is filled.
 */
function GenealogyTree({ filled }: { filled: boolean[] }) {
  const allFilled      = filled.every(Boolean);
  const leftAny        = filled[0] || filled[1];
  const rightAny       = filled[2] || filled[3];
  const leftBothFilled = filled[0] && filled[1];
  const rightBothFilled= filled[2] && filled[3];

  // ── Color helpers ──
  const dim  = 'rgba(201,168,76,0.22)';
  const lit  = '#c9a84c';
  const glit = (active: boolean) =>
    active ? `drop-shadow(0 0 5px rgba(201,168,76,0.75))` : 'none';

  // ── Grow-in style for the 4 terminal branches ──
  const grow = (active: boolean, delay = '0s'): CSSProperties => ({
    fill:            'none',
    strokeLinecap:   'round',
    strokeDasharray: '1',
    strokeDashoffset: active ? 0 : 1,
    stroke:          active ? lit : dim,
    filter:          glit(active),
    transition:      `stroke-dashoffset 0.7s cubic-bezier(0.16,1,0.3,1) ${delay},`
                   + ` stroke 0.45s ease, filter 0.45s ease`,
  });

  // ── Structural branch style (always visible, brightens) ──
  const struct = (active: boolean): CSSProperties => ({
    fill:   'none',
    stroke: active ? lit : dim,
    filter: glit(active),
    strokeLinecap: 'round',
    transition: 'stroke 0.5s ease, filter 0.5s ease',
  });

  return (
    <svg
      viewBox="0 0 500 195"
      preserveAspectRatio="xMidYMid meet"
      style={{
        position:      'absolute',
        inset:         0,
        width:         '100%',
        height:        '100%',
        pointerEvents: 'none',
        overflow:      'visible',
      }}
    >
      <defs>
        {/* Radial gradient for the main trunk — thicker glow at base */}
        <filter id="tree-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ─────────────────────────────────────────────── */}
      {/* ROOT TENDRILS — always dim, purely decorative  */}
      {/* ─────────────────────────────────────────────── */}
      <path d="M 250 192 C 237 189 220 193 206 190"
        stroke="rgba(201,168,76,0.12)" fill="none" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M 250 192 C 263 189 280 193 294 190"
        stroke="rgba(201,168,76,0.12)" fill="none" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M 250 190 C 244 186 236 189 228 186"
        stroke="rgba(201,168,76,0.07)" fill="none" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M 250 190 C 256 186 264 189 272 186"
        stroke="rgba(201,168,76,0.07)" fill="none" strokeWidth="0.8" strokeLinecap="round" />

      {/* ─────────────────────────────────────────── */}
      {/* MAIN TRUNK — tapers from base to fork       */}
      {/* Split into two strokes for taper effect     */}
      {/* ─────────────────────────────────────────── */}
      {/* Thick base segment */}
      <path
        d="M 250 192 C 248 178 252 162 250 148"
        stroke={allFilled || leftAny || rightAny ? lit : dim}
        fill="none"
        strokeWidth="4.5"
        strokeLinecap="round"
        filter="url(#tree-glow)"
        className={allFilled ? 'trunk-complete' : undefined}
        style={{ transition: 'stroke 0.5s ease' }}
      />
      {/* Mid segment — slightly thinner */}
      <path
        d="M 250 148 C 249 138 250 130 250 120"
        stroke={allFilled || leftAny || rightAny ? lit : dim}
        fill="none"
        strokeWidth="3.2"
        strokeLinecap="round"
        filter="url(#tree-glow)"
        className={allFilled ? 'trunk-complete' : undefined}
        style={{ transition: 'stroke 0.5s ease' }}
      />

      {/* ─────────────────────────────────────────── */}
      {/* MAIN BRANCHES — cubic bezier, structural    */}
      {/* ─────────────────────────────────────────── */}
      {/* Left (paternal) */}
      <path
        d="M 250 120 C 232 112 200 97 165 78"
        strokeWidth="2.4"
        style={struct(leftAny)}
      />
      {/* Right (maternal) */}
      <path
        d="M 250 120 C 268 112 300 97 335 78"
        strokeWidth="2.4"
        style={struct(rightAny)}
      />

      {/* ─────────────────────────────────────────── */}
      {/* JUNCTION OFFSHOOTS — tiny decorative twigs  */}
      {/* ─────────────────────────────────────────── */}
      <path d="M 165 78 C 160 72 152 69 144 63"
        stroke="rgba(201,168,76,0.14)" fill="none"
        strokeWidth="0.9" strokeLinecap="round" />
      <path d="M 165 78 C 168 71 170 64 168 56"
        stroke="rgba(201,168,76,0.1)"  fill="none"
        strokeWidth="0.7" strokeLinecap="round" />
      <path d="M 335 78 C 340 72 348 69 356 63"
        stroke="rgba(201,168,76,0.14)" fill="none"
        strokeWidth="0.9" strokeLinecap="round" />
      <path d="M 335 78 C 332 71 330 64 332 56"
        stroke="rgba(201,168,76,0.1)"  fill="none"
        strokeWidth="0.7" strokeLinecap="round" />

      {/* ─────────────────────────────────────────── */}
      {/* TERMINAL BRANCHES — grow in on selection    */}
      {/* ─────────────────────────────────────────── */}
      {/* Slot 0 — far left */}
      <path
        d="M 165 78 C 145 65 116 49 90 28"
        pathLength="1" strokeWidth="1.6"
        style={grow(filled[0], '0s')}
      />
      {/* Slot 1 — center-left */}
      <path
        d="M 165 78 C 178 64 193 48 208 28"
        pathLength="1" strokeWidth="1.6"
        style={grow(filled[1], '0.07s')}
      />
      {/* Slot 2 — center-right */}
      <path
        d="M 335 78 C 322 64 307 48 292 28"
        pathLength="1" strokeWidth="1.6"
        style={grow(filled[2], '0s')}
      />
      {/* Slot 3 — far right */}
      <path
        d="M 335 78 C 355 64 382 48 410 28"
        pathLength="1" strokeWidth="1.6"
        style={grow(filled[3], '0.07s')}
      />

      {/* ─────────────────────────────────────────── */}
      {/* JUNCTION ORNAMENTS — knot circles           */}
      {/* ─────────────────────────────────────────── */}
      {/* Central fork */}
      <circle cx="250" cy="120" r="4"
        fill={leftAny || rightAny ? 'rgba(201,168,76,0.2)' : 'transparent'}
        stroke={leftAny || rightAny ? lit : 'rgba(201,168,76,0.18)'}
        strokeWidth="0.8"
        style={{ transition: 'all 0.5s ease',
          filter: allFilled ? 'drop-shadow(0 0 7px rgba(201,168,76,0.9))' : glit(leftAny || rightAny) }}
        className={allFilled ? 'trunk-complete' : undefined}
      />
      {/* Left junction */}
      <circle cx="165" cy="78" r="3"
        fill={leftAny ? 'rgba(201,168,76,0.18)' : 'transparent'}
        stroke={leftAny ? lit : 'rgba(201,168,76,0.15)'}
        strokeWidth="0.8"
        style={{ transition: 'all 0.4s ease', filter: glit(leftBothFilled) }}
      />
      {/* Right junction */}
      <circle cx="335" cy="78" r="3"
        fill={rightAny ? 'rgba(201,168,76,0.18)' : 'transparent'}
        stroke={rightAny ? lit : 'rgba(201,168,76,0.15)'}
        strokeWidth="0.8"
        style={{ transition: 'all 0.4s ease', filter: glit(rightBothFilled) }}
      />

      {/* ─────────────────────────────────────────── */}
      {/* TIP DIAMONDS — emblem at each branch end    */}
      {/* ─────────────────────────────────────────── */}
      {([
        { cx: 90,  cy: 28, idx: 0 },
        { cx: 208, cy: 28, idx: 1 },
        { cx: 292, cy: 28, idx: 2 },
        { cx: 410, cy: 28, idx: 3 },
      ] as const).map(({ cx, cy, idx }) => {
        const on = filled[idx];
        return (
          <g key={idx}
            style={{ transition: 'all 0.4s ease',
              filter: on ? 'drop-shadow(0 0 7px rgba(201,168,76,0.85))' : 'none' }}
          >
            {/* Outer glow ring when active */}
            {on && (
              <circle cx={cx} cy={cy} r="9"
                fill="rgba(201,168,76,0.07)"
                stroke="rgba(201,168,76,0.25)"
                strokeWidth="0.5"
              />
            )}
            {/* Diamond */}
            <polygon
              points={`${cx},${cy - 7} ${cx + 5},${cy} ${cx},${cy + 7} ${cx - 5},${cy}`}
              fill={on ? 'rgba(201,168,76,0.3)' : 'transparent'}
              stroke={on ? lit : 'rgba(201,168,76,0.2)'}
              strokeWidth="0.9"
            />
            {/* Center dot */}
            <circle cx={cx} cy={cy} r="1.5"
              fill={on ? lit : 'rgba(201,168,76,0.15)'}
            />
          </g>
        );
      })}
    </svg>
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
  const isMobile = useIsMobile(640);
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
        padding: isMobile ? '0 16px' : '0 40px',
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

        {/* Panel de slots + árbol genealógico */}
        <div style={{
          display: 'flex', gap: '8px',
          marginBottom: '36px',
          flexWrap: 'wrap', justifyContent: 'center',
          width: '100%',
          padding: isMobile ? '14px 12px' : '24px 40px',
          borderRadius: '10px',
          border: '1px solid rgba(201,168,76,0.15)',
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(8px)',
          position: 'relative',
          minHeight: '110px',
        }}>
          {/* Genealogy tree — behind the slots */}
          <GenealogyTree filled={[0,1,2,3].map(i => selected[i] !== undefined)} />

          {/* Slot cards — above the tree */}
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ position: 'relative', zIndex: 1 }}>
              <AncestorSlot index={i} archetype={getSlotArchetype(i)} />
            </div>
          ))}
        </div>

        {/* Grid de arquetipos */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
          gap: isMobile ? '10px' : '16px',
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
              isMobile={isMobile}
            />
          ))}
        </div>

        {/* Botón confirmar */}
        <button
          onClick={() => isComplete && onConfirm(selected)}
          disabled={!isComplete}
          style={{
            padding: isMobile ? '16px 24px' : '18px 72px',
            width: isMobile ? '100%' : 'auto',
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
