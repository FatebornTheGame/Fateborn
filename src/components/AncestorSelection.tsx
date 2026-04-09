import { useState, useMemo } from 'react';
import { useTrack } from '../hooks/useTrack';
import { useIsMobile } from '../hooks/useIsMobile';
import { archetypes } from '../data/archetypes';
import { ARCHETYPE_CONTRIBUTIONS } from '../data/archetypeStats';
import { COUNTRIES, TIER_LABELS, TIER_COLORS } from '../data/countries';
import type { Archetype } from '../types';
import type { Country } from '../store/gameStore';
import { useGameStore } from '../store/gameStore';
import StatRadar from './StatRadar';
import type { CharacterStats } from '../types';

// ─── Brand ────────────────────────────────────────────────────────────────────
const GOLD       = '#c9a84c';
const GOLD_LIGHT = '#e8d08a';
const GARNET     = '#8b1a2a';

// ─── Slot config ──────────────────────────────────────────────────────────────
// Per CLAUDE.md: Slots 1 y 3 = abuelos masculinos, Slots 2 y 4 = abuelas femeninas
// Slots 1+2 = línea paterna, Slots 3+4 = línea materna

interface SlotDef {
  label: string;
  sublabel: string;
  isFeminine: boolean;
  accentColor: string;
}

const SLOT_DEFS: SlotDef[] = [
  { label: 'Abuelo Paterno',  sublabel: 'Línea paterna',  isFeminine: false, accentColor: GOLD   },
  { label: 'Abuela Paterna',  sublabel: 'Línea paterna',  isFeminine: true,  accentColor: GARNET },
  { label: 'Abuelo Materno',  sublabel: 'Línea materna',  isFeminine: false, accentColor: GOLD   },
  { label: 'Abuela Materna',  sublabel: 'Línea materna',  isFeminine: true,  accentColor: GARNET },
];

// ─── Diamond ornament ─────────────────────────────────────────────────────────
function Diamond({ color, size = 10 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill={color} style={{ flexShrink: 0 }}>
      <polygon points="5,0 10,5 5,10 0,5" />
    </svg>
  );
}

// ─── Slot badge ───────────────────────────────────────────────────────────────
function AncestorSlot({
  slotDef,
  archetype,
}: {
  slotDef: SlotDef;
  archetype?: Archetype;
}) {
  const filled = !!archetype;
  const ac = slotDef.accentColor;

  return (
    <div style={{
      flex: 1,
      minWidth: 0,
      padding: '10px 12px',
      borderRadius: '7px',
      border: `1px solid ${filled ? ac + '60' : 'rgba(255,255,255,0.05)'}`,
      background: filled ? `${ac}0a` : 'rgba(0,0,0,0.2)',
      transition: 'all 0.3s ease',
      boxShadow: filled ? `0 0 14px ${ac}22` : 'none',
    }}>
      <div className="cinzel" style={{
        fontSize: '7.5px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: filled ? `${ac}aa` : 'rgba(255,255,255,0.12)',
        marginBottom: '5px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {slotDef.label}
      </div>
      {filled ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '16px', lineHeight: 1, flexShrink: 0 }}>{archetype!.symbol}</span>
          <span className="cinzel" style={{
            fontSize: '10px',
            fontWeight: 700,
            color: slotDef.isFeminine ? '#e8a0a0' : GOLD_LIGHT,
            letterSpacing: '0.06em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {archetype!.name.replace(/^(El|La) /, '')}
          </span>
        </div>
      ) : (
        <span className="crimson" style={{
          fontSize: '12px',
          fontStyle: 'italic',
          color: 'rgba(255,255,255,0.12)',
        }}>
          — vacío —
        </span>
      )}
    </div>
  );
}

// ─── Archetype card with mini radar ──────────────────────────────────────────
function ArchetypeCard({
  archetype,
  count,
  totalSelected,
  nextSlotFeminine,
  onAdd,
  onRemove,
  isMobile,
}: {
  archetype:        Archetype;
  count:            number;
  totalSelected:    number;
  nextSlotFeminine: boolean;
  onAdd:            () => void;
  onRemove:         () => void;
  isMobile:         boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const isSelected = count > 0;
  const canAdd = totalSelected < 4;

  const stats = ARCHETYPE_CONTRIBUTIONS[archetype.id] as CharacterStats;

  const slotColor = nextSlotFeminine ? GARNET : GOLD;
  const borderColor = isSelected
    ? `${slotColor}55`
    : hovered
    ? `${archetype.accentColor}44`
    : `${archetype.accentColor}18`;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '14px',
        borderRadius: '8px',
        border: `1px solid ${borderColor}`,
        background: isSelected
          ? `${slotColor}08`
          : hovered
          ? 'rgba(255,255,255,0.02)'
          : 'rgba(13,10,6,0.85)',
        boxShadow: isSelected
          ? `0 0 18px ${slotColor}22, 0 4px 20px rgba(0,0,0,0.5)`
          : 'none',
        transition: 'all 0.25s ease',
        backdropFilter: 'blur(8px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
        background: isSelected
          ? `linear-gradient(90deg, transparent, ${slotColor}, transparent)`
          : `linear-gradient(90deg, transparent, ${archetype.accentColor}50, transparent)`,
        transition: 'all 0.3s ease',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontSize: isMobile ? '20px' : '22px', lineHeight: 1, flexShrink: 0 }}>
          {archetype.symbol}
        </span>
        <div className="cinzel" style={{
          color: isSelected ? (slotColor === GOLD ? GOLD_LIGHT : '#e8a0a0') : `${archetype.accentColor}ee`,
          fontSize: isMobile ? '11px' : '13px',
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          lineHeight: 1.2,
          flex: 1,
        }}>
          {archetype.name}
        </div>
        {isSelected && (
          <div style={{
            width: '22px', height: '22px', borderRadius: '50%',
            background: `${slotColor}20`,
            border: `1px solid ${slotColor}60`,
            color: slotColor === GOLD ? GOLD_LIGHT : '#e8a0a0',
            fontSize: '11px', fontWeight: 700, fontFamily: "'Cinzel', serif",
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {count}
          </div>
        )}
      </div>

      {/* Description */}
      <p className="crimson" style={{
        color: '#8a7458',
        fontSize: '12px',
        lineHeight: 1.55,
        marginBottom: '10px',
        fontStyle: 'italic',
        flex: 1,
      }}>
        {archetype.description}
      </p>

      {/* Mini radar chart */}
      {stats && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
          <StatRadar
            stats={stats}
            active={true}
            size={isMobile ? 100 : 120}
          />
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <button
          onClick={onAdd}
          disabled={!canAdd}
          style={{
            flex: 1,
            padding: '9px 0',
            minHeight: '44px',
            borderRadius: '5px',
            border: `1px solid ${canAdd ? `${GOLD}50` : 'rgba(255,255,255,0.05)'}`,
            background: canAdd ? `${GOLD}0c` : 'rgba(255,255,255,0.01)',
            color: canAdd ? GOLD_LIGHT : '#2a1a10',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.1em',
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
            minHeight: '44px',
            borderRadius: '5px',
            border: `1px solid ${isSelected ? 'rgba(160,50,40,0.45)' : 'rgba(255,255,255,0.03)'}`,
            background: isSelected ? 'rgba(160,50,40,0.07)' : 'rgba(255,255,255,0.01)',
            color: isSelected ? '#d07070' : '#1a0e08',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.1em',
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

// ─── Country selector ─────────────────────────────────────────────────────────
function CountrySelector({
  selected,
  onSelect,
}: {
  selected: Country;
  onSelect: (c: Country) => void;
}) {
  const [open, setOpen] = useState(false);

  const tierColor = TIER_COLORS[selected.tier] ?? GOLD;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          padding: '12px 16px',
          minHeight: '44px',
          borderRadius: '7px',
          border: `1px solid ${open ? 'rgba(201,168,76,0.35)' : 'rgba(201,168,76,0.15)'}`,
          background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(8px)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'border-color 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: GOLD_LIGHT,
          }}>
            {selected.nombre}
          </span>
          <span style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '8px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: tierColor,
            padding: '2px 7px',
            borderRadius: '3px',
            border: `1px solid ${tierColor}44`,
            background: `${tierColor}10`,
          }}>
            {TIER_LABELS[selected.tier]}
          </span>
        </div>
        <span style={{
          color: 'rgba(201,168,76,0.4)',
          fontSize: '14px',
          transform: open ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.2s ease',
          display: 'inline-block',
        }}>
          ›
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '4px',
          borderRadius: '7px',
          border: '1px solid rgba(201,168,76,0.15)',
          background: 'rgba(10,8,5,0.97)',
          backdropFilter: 'blur(16px)',
          zIndex: 100,
          maxHeight: '280px',
          overflowY: 'auto',
          boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
        }}>
          {([1, 2, 3, 4] as const).map(tier => (
            <div key={tier}>
              <div style={{
                padding: '6px 12px 4px',
                fontFamily: "'Cinzel', serif",
                fontSize: '7px',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: `${TIER_COLORS[tier]}55`,
                borderTop: tier > 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                {TIER_LABELS[tier]}
              </div>
              {COUNTRIES.filter(c => c.tier === tier).map(c => {
                const isSel = c.nombre === selected.nombre;
                return (
                  <button
                    key={c.nombre}
                    onClick={() => { onSelect(c); setOpen(false); }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '9px 16px',
                      minHeight: '44px',
                      background: isSel ? `${TIER_COLORS[tier]}10` : 'transparent',
                      border: 'none',
                      borderLeft: isSel ? `2px solid ${TIER_COLORS[tier]}` : '2px solid transparent',
                      cursor: 'pointer',
                      fontFamily: "'Cinzel', serif",
                      fontSize: '12px',
                      fontWeight: isSel ? 700 : 400,
                      letterSpacing: '0.06em',
                      color: isSel ? GOLD_LIGHT : 'rgba(201,168,76,0.55)',
                      transition: 'all 0.15s ease',
                    }}
                    onPointerEnter={e => { if (!isSel) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)'; }}
                    onPointerLeave={e => { if (!isSel) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  >
                    {c.nombre}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function AncestorSelection() {
  useTrack('/music/opening.mp3');
  const isMobile = useIsMobile(640);

  const setAncestorIds = useGameStore(s => s.setAncestorIds);
  const storeSetCountry = useGameStore(s => s.setCountry);
  const setScreen      = useGameStore(s => s.setScreen);

  const [selected, setSelected]       = useState<string[]>([]);
  const [country,  setCountry]        = useState<Country>(COUNTRIES.find(c => c.nombre === 'España')!);

  const countOf    = (id: string) => selected.filter(s => s === id).length;
  const isComplete = selected.length === 4;
  const remaining  = 4 - selected.length;

  // The next slot to fill: determines masculine/feminine coloring on "Añadir"
  const nextSlotFeminine = useMemo(() => {
    const nextIdx = selected.length; // 0-3
    return nextIdx < 4 ? SLOT_DEFS[nextIdx].isFeminine : false;
  }, [selected.length]);

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
    return id ? archetypes.find(a => a.id === id) : undefined;
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
        padding: isMobile ? '24px 0 56px' : '40px 0 64px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Vignette */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(5,3,2,0.72) 100%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '1400px',
        padding: isMobile ? '0 14px' : '0 40px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>

        {/* Title */}
        <img
          src="/fateborn_title.png"
          alt="FATEBORN"
          style={{
            width: '100%', maxWidth: '480px', height: 'auto',
            marginBottom: '4px', mixBlendMode: 'screen', display: 'block',
          }}
        />

        {/* Ornament */}
        <div className="ornament-divider" style={{ marginBottom: '12px' }}>
          <Diamond color={`${GOLD}50`} />
        </div>

        {/* Subtitle */}
        <p className="cinzel" style={{
          color: 'rgba(201,168,76,0.35)',
          fontSize: '10px',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          margin: '0 0 28px',
          textAlign: 'center',
        }}>
          Elige tus ancestros
        </p>

        {/* ── 4 Ancestor slots panel ── */}
        <div style={{
          width: '100%',
          padding: isMobile ? '14px 12px' : '18px 24px',
          borderRadius: '10px',
          border: '1px solid rgba(201,168,76,0.12)',
          background: 'rgba(0,0,0,0.28)',
          backdropFilter: 'blur(8px)',
          marginBottom: '16px',
        }}>
          {/* Slot row */}
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
          }}>
            {[0, 1, 2, 3].map(i => (
              <AncestorSlot
                key={i}
                slotDef={SLOT_DEFS[i]}
                archetype={getSlotArchetype(i)}
              />
            ))}
          </div>

          {/* Progress hint */}
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <span className="cinzel" style={{
              fontSize: '9px',
              letterSpacing: '0.22em',
              color: isComplete ? 'rgba(201,168,76,0.6)' : 'rgba(255,255,255,0.18)',
              textTransform: 'uppercase',
            }}>
              {isComplete
                ? '✦ Linaje completo'
                : `${remaining} ancestro${remaining !== 1 ? 's' : ''} pendiente${remaining !== 1 ? 's' : ''}`}
            </span>
          </div>
        </div>

        {/* ── Country selector ── */}
        <div style={{ width: '100%', marginBottom: '32px' }}>
          <p className="cinzel" style={{
            fontSize: '9px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.35)',
            margin: '0 0 10px',
          }}>
            País de origen
          </p>
          <CountrySelector selected={country} onSelect={setCountry} />
          <p className="crimson" style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.25)',
            margin: '8px 0 0',
            fontStyle: 'italic',
            lineHeight: 1.5,
          }}>
            El país donde naces define el coste de vida, las oportunidades y la estabilidad social.
          </p>
        </div>

        {/* ── Archetype grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? '8px' : '14px',
          width: '100%',
          marginBottom: '40px',
        }}>
          {archetypes.slice(0, 8).map(archetype => (
            <ArchetypeCard
              key={archetype.id}
              archetype={archetype}
              count={countOf(archetype.id)}
              totalSelected={selected.length}
              nextSlotFeminine={nextSlotFeminine}
              onAdd={() => handleAdd(archetype.id)}
              onRemove={() => handleRemove(archetype.id)}
              isMobile={isMobile}
            />
          ))}
        </div>

        {/* ── CTA button ── */}
        <button
          onClick={() => {
            if (!isComplete) return;
            setAncestorIds(selected);
            storeSetCountry(country);
            setScreen('birth');
          }}
          disabled={!isComplete}
          style={{
            padding: isMobile ? '16px 24px' : '18px 72px',
            width: isMobile ? '100%' : 'auto',
            minHeight: '54px',
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
              ? '0 0 24px rgba(201,168,76,0.2), 0 0 60px rgba(201,168,76,0.08), inset 0 1px 0 rgba(201,168,76,0.15)'
              : 'none',
          }}
          onPointerEnter={e => {
            if (isComplete) {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 36px rgba(201,168,76,0.35), 0 0 80px rgba(201,168,76,0.12), inset 0 1px 0 rgba(201,168,76,0.2)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.7)';
            }
          }}
          onPointerLeave={e => {
            if (isComplete) {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 24px rgba(201,168,76,0.2), 0 0 60px rgba(201,168,76,0.08), inset 0 1px 0 rgba(201,168,76,0.15)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.55)';
            }
          }}
        >
          {isComplete
            ? 'Comenzar el Viaje →'
            : `Selecciona ${remaining} ancestro${remaining !== 1 ? 's' : ''} más`}
        </button>

        {/* Bottom ornament */}
        <div className="ornament-divider" style={{ marginTop: '40px', maxWidth: '300px' }}>
          <Diamond color={`${GOLD}28`} />
        </div>

      </div>
    </div>
  );
}
