import { useState, useEffect, useMemo } from 'react';
import { useTrack } from '../hooks/useTrack';
import { useIsMobile } from '../hooks/useIsMobile';
import { archetypes } from '../data/archetypes';
import type { Character } from '../types';

// ─── Brand colors ──────────────────────────────────────────────────────────────
const GOLD       = '#c9a84c';
const GOLD_LIGHT = '#e8d08a';

// ─── Stat system ───────────────────────────────────────────────────────────────

// Contribution of each archetype to each of the 9 inherited stats (0–10 scale)
const CONTRIBUTIONS: Record<string, Record<string, number>> = {
  atleta:      { logica: 4, creatividad: 3, disciplina: 8, carisma: 5, emocional: 4, ambicion: 6, fisico: 9, riesgo: 6, estabilidad: 5 },
  academico:   { logica: 9, creatividad: 6, disciplina: 8, carisma: 4, emocional: 5, ambicion: 6, fisico: 3, riesgo: 2, estabilidad: 7 },
  artista:     { logica: 5, creatividad: 9, disciplina: 4, carisma: 7, emocional: 8, ambicion: 5, fisico: 4, riesgo: 6, estabilidad: 4 },
  lider:       { logica: 7, creatividad: 6, disciplina: 7, carisma: 9, emocional: 6, ambicion: 9, fisico: 6, riesgo: 5, estabilidad: 6 },
  obrero:      { logica: 4, creatividad: 3, disciplina: 9, carisma: 4, emocional: 5, ambicion: 5, fisico: 8, riesgo: 4, estabilidad: 8 },
  emprendedor: { logica: 7, creatividad: 7, disciplina: 6, carisma: 8, emocional: 5, ambicion: 9, fisico: 5, riesgo: 8, estabilidad: 4 },
  cuidador:    { logica: 5, creatividad: 6, disciplina: 6, carisma: 7, emocional: 9, ambicion: 4, fisico: 5, riesgo: 3, estabilidad: 8 },
  explorador:  { logica: 6, creatividad: 8, disciplina: 5, carisma: 6, emocional: 6, ambicion: 7, fisico: 7, riesgo: 9, estabilidad: 3 },
};

const STAT_GROUPS = [
  {
    key: 'cognitivo',
    label: 'Cognitivo',
    color: '#7eb8f7',
    glow: 'rgba(126,184,247,0.25)',
    stats: [
      { key: 'logica',      label: 'Lógica'      },
      { key: 'creatividad', label: 'Creatividad'  },
      { key: 'disciplina',  label: 'Disciplina'   },
    ],
  },
  {
    key: 'social',
    label: 'Social',
    color: GOLD,
    glow: 'rgba(201,168,76,0.25)',
    stats: [
      { key: 'carisma',   label: 'Carisma'    },
      { key: 'emocional', label: 'Emocional'  },
      { key: 'ambicion',  label: 'Ambición'   },
    ],
  },
  {
    key: 'vital',
    label: 'Vital',
    color: '#6ee7a0',
    glow: 'rgba(110,231,160,0.25)',
    stats: [
      { key: 'fisico',      label: 'Físico'       },
      { key: 'riesgo',      label: 'Riesgo'       },
      { key: 'estabilidad', label: 'Estabilidad'  },
    ],
  },
];

const HIDDEN_GENES_POOL = [
  'Memoria fotográfica latente',
  'Resistencia sobrehumana',
  'Don de la persuasión',
  'Instinto de supervivencia',
  'Intuición artística profunda',
  'Visión estratégica innata',
  'Empatía sin límites',
  'Espíritu indomable',
  'Voluntad de hierro',
  'Carisma magnético',
  'Agudeza sensorial elevada',
  'Pensamiento lateral espontáneo',
];

function calculateStats(ids: string[]): Record<string, number> {
  const keys = ['logica', 'creatividad', 'disciplina', 'carisma', 'emocional', 'ambicion', 'fisico', 'riesgo', 'estabilidad'];
  const result: Record<string, number> = {};
  for (const key of keys) {
    const avg = ids.reduce((sum, id) => sum + (CONTRIBUTIONS[id]?.[key] ?? 5), 0) / ids.length;
    const mutation = Math.random() * 0.2 - 0.1; // ±10%
    result[key] = Math.min(10, Math.max(1, parseFloat((avg * (1 + mutation)).toFixed(1))));
  }
  return result;
}

function pickHiddenGenes(): string[] {
  const shuffled = [...HIDDEN_GENES_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.random() < 0.5 ? 2 : 3);
}

// Nombres femeninos por arquetipo (para abuelas)
const FEMININE_NAME: Record<string, string> = {
  atleta:      'Atleta',
  academico:   'Académica',
  artista:     'Artista',
  lider:       'Líder',
  obrero:      'Obrera',
  emprendedor: 'Emprendedora',
  cuidador:    'Cuidadora',
  explorador:  'Exploradora',
};

// Nombre corto según género
function archetypeName(id: string, feminine: boolean): string {
  if (feminine) return FEMININE_NAME[id] ?? id;
  // Masculine: strip "El " prefix from full name
  const arch = archetypes.find((a) => a.id === id);
  return arch ? arch.name.replace(/^(El|La) /, '') : id;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function Diamond({ color }: { color: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill={color} style={{ flexShrink: 0 }}>
      <polygon points="5,0 10,5 5,10 0,5" />
    </svg>
  );
}

function StatBar({
  label,
  value,
  color,
  active,
  delay,
}: {
  label: string;
  value: number;
  color: string;
  active: boolean;
  delay: number;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{
        fontFamily: "'Cinzel', serif",
        fontSize: '11px',
        color: '#8a7558',
        width: '82px',
        textAlign: 'right',
        flexShrink: 0,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}>
        {label}
      </span>
      <div style={{
        flex: 1,
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '99px',
        height: '6px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{
          width: active ? `${value * 10}%` : '0%',
          height: '100%',
          background: `linear-gradient(90deg, ${color}66, ${color})`,
          borderRadius: '99px',
          boxShadow: `0 0 8px ${color}60`,
          transition: `width 1.3s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        }} />
      </div>
      <span style={{
        fontFamily: "'Cinzel', serif",
        fontSize: '12px',
        color: active ? color : '#3a2a10',
        width: '28px',
        flexShrink: 0,
        transition: `color 0.4s ease ${delay + 1}s`,
      }}>
        {value}
      </span>
    </div>
  );
}

function StatGroup({
  group,
  stats,
  active,
  groupIndex,
}: {
  group: typeof STAT_GROUPS[0];
  stats: Record<string, number>;
  active: boolean;
  groupIndex: number;
}) {
  return (
    <div
      className="fade-up"
      style={{
        animationDelay: `${1.2 + groupIndex * 0.15}s`,
        padding: '20px 22px',
        borderRadius: '10px',
        border: `1px solid ${group.color}25`,
        background: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Group header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${group.color}40, transparent)` }} />
        <span style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: group.color,
          textShadow: `0 0 12px ${group.glow}`,
        }}>
          {group.label}
        </span>
        <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, transparent, ${group.color}40)` }} />
      </div>
      {/* Stats */}
      {group.stats.map((s, i) => (
        <StatBar
          key={s.key}
          label={s.label}
          value={stats[s.key] ?? 5}
          color={group.color}
          active={active}
          delay={groupIndex * 0.15 + i * 0.18}
        />
      ))}
    </div>
  );
}

// ─── Main screen ───────────────────────────────────────────────────────────────

export default function BirthScreen({
  ancestorIds,
  onConfirm,
}: {
  ancestorIds: string[];
  onConfirm: (character: Character) => void;
}) {
  useTrack('/music/trails.mp3');
  const isMobile = useIsMobile();
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'hombre' | 'mujer' | null>(null);
  const [barsActive, setBarsActive] = useState(false);

  // Computed once on mount
  const stats      = useMemo(() => calculateStats(ancestorIds), []);
  const hiddenGenes = useMemo(() => pickHiddenGenes(), []);

  useEffect(() => {
    const t = setTimeout(() => setBarsActive(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const canConfirm = name.trim().length >= 2 && gender !== null;

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
        <div className="ornament-divider" style={{ marginBottom: '36px' }}>
          <Diamond color={`${GOLD}50`} />
        </div>

        {/* ── Narrative ─────────────────────────────────────────────────── */}
        <div style={{
          textAlign: 'center',
          marginBottom: '44px',
          maxWidth: '680px',
        }}>
          {[
            <>Tu abuelo <em style={{ color: GOLD_LIGHT, fontStyle: 'normal' }}>{archetypeName(ancestorIds[0], false)}</em> y tu abuela <em style={{ color: GOLD_LIGHT, fontStyle: 'normal' }}>{archetypeName(ancestorIds[2], true)}</em> forjaron a tu padre.</>,
            <>Tu abuelo <em style={{ color: GOLD_LIGHT, fontStyle: 'normal' }}>{archetypeName(ancestorIds[1], false)}</em> y tu abuela <em style={{ color: GOLD_LIGHT, fontStyle: 'normal' }}>{archetypeName(ancestorIds[3], true)}</em> forjaron a tu madre.</>,
            <>De su sangre naces tú{name.trim().length >= 2 ? `, ${name.trim()}.` : '.'}</>,
          ].map((line, i) => (
            <p
              key={i}
              className={`crimson fade-up`}
              style={{
                fontSize: i === 2 ? (isMobile ? '18px' : '22px') : (isMobile ? '15px' : '18px'),
                lineHeight: 1.7,
                color: i === 2 ? GOLD_LIGHT : '#b09070',
                margin: '0 0 6px',
                fontStyle: 'italic',
                letterSpacing: i === 2 ? '0.12em' : '0.03em',
                textTransform: i === 2 ? 'uppercase' : 'none',
                animationDelay: `${0.4 + i * 0.45}s`,
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* ── Gender selector ────────────────────────────────────────────── */}
        <div
          className="fade-up"
          style={{ animationDelay: '1.4s', width: '100%', maxWidth: '440px', marginBottom: '32px' }}
        >
          <label className="cinzel" style={{
            display: 'block',
            textAlign: 'center',
            fontSize: '10px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#5a4a2e',
            marginBottom: '14px',
          }}>
            Tu género
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            {(['hombre', 'mujer'] as const).map((g) => {
              const selected = gender === g;
              return (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  style={{
                    flex: 1,
                    padding: '14px 0',
                    borderRadius: '7px',
                    border: `1px solid ${selected ? 'rgba(201,168,76,0.6)' : 'rgba(255,255,255,0.07)'}`,
                    background: selected ? 'rgba(201,168,76,0.1)' : 'rgba(0,0,0,0.3)',
                    color: selected ? GOLD_LIGHT : '#5a4530',
                    fontFamily: "'Cinzel', serif",
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: selected ? '0 0 20px rgba(201,168,76,0.15)' : 'none',
                    backdropFilter: 'blur(6px)',
                  }}
                  onMouseEnter={(e) => {
                    if (!selected) {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.3)';
                      (e.currentTarget as HTMLButtonElement).style.color = '#c8b080';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selected) {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.07)';
                      (e.currentTarget as HTMLButtonElement).style.color = '#5a4530';
                    }
                  }}
                >
                  {g === 'hombre' ? 'Hombre' : 'Mujer'}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Name input ─────────────────────────────────────────────────── */}
        <div
          className="fade-up"
          style={{ animationDelay: '1.6s', width: '100%', maxWidth: '440px', marginBottom: '48px' }}
        >
          <label className="cinzel" style={{
            display: 'block',
            textAlign: 'center',
            fontSize: '10px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#5a4a2e',
            marginBottom: '12px',
          }}>
            Tu nombre
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={32}
            placeholder="Escribe tu nombre..."
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              borderBottom: `1px solid ${name.length >= 2 ? 'rgba(201,168,76,0.6)' : 'rgba(201,168,76,0.2)'}`,
              outline: 'none',
              fontFamily: "'Cinzel', serif",
              fontSize: '24px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: GOLD_LIGHT,
              textAlign: 'center',
              padding: '8px 4px',
              transition: 'border-color 0.3s ease',
              caretColor: GOLD,
            }}
            onFocus={(e) => { e.currentTarget.style.borderBottomColor = 'rgba(201,168,76,0.8)'; }}
            onBlur={(e) => { e.currentTarget.style.borderBottomColor = name.length >= 2 ? 'rgba(201,168,76,0.6)' : 'rgba(201,168,76,0.2)'; }}
          />
          {/* Placeholder styled separately via CSS can't be done inline; fake hint */}
          {name.length === 0 && (
            <p className="crimson" style={{
              textAlign: 'center',
              color: '#3a2a18',
              fontSize: '12px',
              marginTop: '8px',
              letterSpacing: '0.1em',
              fontStyle: 'italic',
            }}>
              Mínimo 2 caracteres
            </p>
          )}
        </div>

        {/* ── Stats section ──────────────────────────────────────────────── */}
        <div style={{ width: '100%', marginBottom: '40px' }}>
          {/* Section header */}
          <div
            className="fade-up ornament-divider"
            style={{ marginBottom: '24px', animationDelay: '1.1s', maxWidth: '100%' }}
          >
            <span className="cinzel" style={{
              fontSize: '11px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: GOLD,
              whiteSpace: 'nowrap',
              padding: '0 16px',
            }}>
              Herencia Ancestral
            </span>
          </div>

          {/* 3-column stat groups */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '12px',
            width: '100%',
          }}>
            {STAT_GROUPS.map((group, gi) => (
              <StatGroup
                key={group.key}
                group={group}
                stats={stats}
                active={barsActive}
                groupIndex={gi}
              />
            ))}
          </div>
        </div>

        {/* ── Genes ocultos ──────────────────────────────────────────────── */}
        <div
          className="fade-up"
          style={{
            animationDelay: '1.7s',
            width: '100%',
            maxWidth: '600px',
            marginBottom: '48px',
            padding: '22px 32px',
            borderRadius: '10px',
            border: '1px solid rgba(201,168,76,0.08)',
            background: 'rgba(0,0,0,0.25)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2))' }} />
            <span className="cinzel" style={{
              fontSize: '9px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.4)',
            }}>
              Genes Ocultos
            </span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(201,168,76,0.2), transparent)' }} />
          </div>

          {/* Gene items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {hiddenGenes.map((_, i) => (
              <div
                key={i}
                className="gene-pulse"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  animationDelay: `${i * 0.8}s`,
                }}
              >
                <span style={{ color: 'rgba(201,168,76,0.2)', fontSize: '10px' }}>◈</span>
                <span style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(201,168,76,0.35)',
                }}>
                  Talento latente detectado...
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA button ─────────────────────────────────────────────────── */}
        <button
          className="fade-up"
          onClick={() => canConfirm && gender && onConfirm({ name: name.trim(), gender, birthYear: 1943 + Math.floor(Math.random() * 21), stats: stats as unknown as import('../types').CharacterStats, ancestorIds, flags: {} })}
          disabled={!canConfirm}
          style={{
            animationDelay: '1.9s',
            padding: isMobile ? '16px 24px' : '18px 72px',
            width: isMobile ? '100%' : 'auto',
            borderRadius: '7px',
            border: `1px solid ${canConfirm ? 'rgba(201,168,76,0.55)' : 'rgba(255,255,255,0.05)'}`,
            background: canConfirm
              ? 'linear-gradient(135deg, rgba(201,168,76,0.18), rgba(139,100,30,0.25))'
              : 'rgba(255,255,255,0.02)',
            color: canConfirm ? GOLD_LIGHT : '#2a1f10',
            fontSize: '15px',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            cursor: canConfirm ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            fontFamily: "'Cinzel', serif",
            boxShadow: canConfirm
              ? '0 0 24px rgba(201,168,76,0.2), 0 0 60px rgba(201,168,76,0.08), inset 0 1px 0 rgba(201,168,76,0.15)'
              : 'none',
          }}
          onMouseEnter={(e) => {
            if (canConfirm) {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.boxShadow = '0 0 36px rgba(201,168,76,0.35), 0 0 80px rgba(201,168,76,0.12), inset 0 1px 0 rgba(201,168,76,0.2)';
              b.style.borderColor = 'rgba(201,168,76,0.75)';
            }
          }}
          onMouseLeave={(e) => {
            if (canConfirm) {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.boxShadow = '0 0 24px rgba(201,168,76,0.2), 0 0 60px rgba(201,168,76,0.08), inset 0 1px 0 rgba(201,168,76,0.15)';
              b.style.borderColor = 'rgba(201,168,76,0.55)';
            }
          }}
        >
          Comenzar tu Vida →
        </button>

        {/* Bottom ornament */}
        <div className="ornament-divider fade-up" style={{ marginTop: '44px', maxWidth: '300px', animationDelay: '2s' }}>
          <Diamond color={`${GOLD}30`} />
        </div>

      </div>
    </div>
  );
}
