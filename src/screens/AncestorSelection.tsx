import { useGameStore } from '../store/gameStore'
import { ARCHETYPES } from '../data/archetypes'
import { COUNTRIES, TIER_LABELS } from '../data/countries'
import type { Archetype } from '../types/game.types'

// ─── Paleta ───────────────────────────────────────────────────────────────────
const GOLD   = '#C9A84C'
const GARNET = '#8B1A2A'
const BG     = '#0d0b08'
const TEXT   = '#d4c5a0'
const MUTED  = '#555'

// ─── Colores de tier actualizados ────────────────────────────────────────────
const TIER_PALETTE: Record<number, string> = {
  1: '#4aff8a',   // verde  — Desarrollado
  2: '#4a9eff',   // azul   — Emergente
  3: '#C9A84C',   // dorado — En desarrollo
  4: '#8B1A2A',   // granate — Frágil
}

// ─── Color de stat según grupo cognitivo/social/vital ────────────────────────
const STAT_COLOR: Record<string, string> = {
  logica: '#4a9eff',     creatividad: '#4a9eff', disciplina: '#4a9eff',
  carisma: '#C9A84C',    emocional: '#C9A84C',   ambicion: '#C9A84C',
  fisico: '#4aff8a',     riesgo: '#4aff8a',      estabilidad: '#4aff8a',
}

const STAT_LABELS: Record<string, string> = {
  logica: 'Lógica', creatividad: 'Creatividad', disciplina: 'Disciplina',
  carisma: 'Carisma', emocional: 'Emocional',  ambicion: 'Ambición',
  fisico: 'Físico',  riesgo: 'Riesgo',          estabilidad: 'Estabilidad',
}

// ─── Slots (display order → store index) ─────────────────────────────────────
const SLOT_DEFS = [
  { label: 'ABUELO 1', storeIdx: 0 as 0|1|2|3, color: GOLD   },
  { label: 'ABUELO 2', storeIdx: 2 as 0|1|2|3, color: GOLD   },
  { label: 'ABUELA 1', storeIdx: 1 as 0|1|2|3, color: GARNET },
  { label: 'ABUELA 2', storeIdx: 3 as 0|1|2|3, color: GARNET },
]

function topStats(arch: Archetype) {
  return [...arch.stats].sort((a, b) => b.value - a.value).slice(0, 4)
}

export default function AncestorSelection() {
  const ancestors       = useGameStore(s => s.ancestors)
  const selectedCountry = useGameStore(s => s.selectedCountry)
  const setAncestor     = useGameStore(s => s.setAncestor)
  const setCountry      = useGameStore(s => s.setCountry)
  const confirmAncestors = useGameStore(s => s.confirmAncestors)
  const setScreen       = useGameStore(s => s.setScreen)

  const allFull  = ancestors.every(a => a !== null)
  const canStart = allFull && selectedCountry !== null

  const countInSlots   = (id: string) => ancestors.filter(a => a === id).length
  const firstEmptyMale   = ([0, 2] as const).find(i => ancestors[i] === null) ?? null
  const firstEmptyFemale = ([1, 3] as const).find(i => ancestors[i] === null) ?? null

  function addToSlot(id: string, gender: 'male' | 'female') {
    const slot = gender === 'male' ? firstEmptyMale : firstEmptyFemale
    if (slot !== null) setAncestor(slot, id)
  }

  function handleStart() {
    confirmAncestors()
    setScreen('birth')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: BG,
      color: TEXT,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1.5rem 1rem 3rem',
      gap: '2rem',
    }}>

      {/* ── CSS para hover de cartas ─────────────────────────────────────────── */}
      <style>{`
        .arch-card {
          background: #1a1510;
          border: 1px solid #3a2e1e;
          border-radius: 6px;
          padding: 0.85rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          transition: border-color 0.2s, box-shadow 0.2s, opacity 0.2s;
          cursor: default;
        }
        .arch-card:not(.arch-disabled):hover {
          border-color: ${GOLD};
          box-shadow: 0 0 10px ${GOLD}33;
        }
        .arch-card.sel-gold {
          border: 2px solid ${GOLD} !important;
          box-shadow: 0 0 14px ${GOLD}55 !important;
        }
        .arch-card.sel-garnet {
          border: 2px solid ${GARNET} !important;
          box-shadow: 0 0 14px ${GARNET}66 !important;
        }
        .arch-card.arch-disabled {
          opacity: 0.4;
          pointer-events: none;
        }

        .slot-box {
          transition: background 0.3s, border-color 0.3s;
        }

        .btn-start:not(:disabled):hover {
          background: ${GOLD} !important;
          color: ${BG} !important;
          box-shadow: 0 0 18px ${GOLD}66;
        }

        .card-btn {
          flex: 1;
          background: transparent;
          font-family: 'Cinzel', serif;
          font-size: 0.6rem;
          letter-spacing: 0.08em;
          border-radius: 3px;
          cursor: pointer;
          transition: background 0.15s;
          min-height: 44px;
          padding: 0.35rem 0.2rem;
        }
        .card-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .card-btn-gold {
          border: 1px solid ${GOLD};
          color: ${GOLD};
        }
        .card-btn-gold:not(:disabled):hover {
          background: ${GOLD}25;
        }
        .card-btn-garnet {
          border: 1px solid ${GARNET};
          color: ${GARNET};
        }
        .card-btn-garnet:not(:disabled):hover {
          background: ${GARNET}30;
        }
      `}</style>

      {/* ── Logo ────────────────────────────────────────────────────────────── */}
      <img
        src="/fateborn_title.png"
        alt="Fateborn"
        style={{
          width: '100%',
          maxWidth: '500px',
          mixBlendMode: 'screen',
          opacity: 0.9,
          userSelect: 'none',
          pointerEvents: 'none',
          marginTop: '0.5rem',
        }}
      />

      {/* ── Subtítulo ───────────────────────────────────────────────────────── */}
      <p style={{
        fontFamily: 'Cinzel, serif',
        color: `${GOLD}77`,
        fontSize: 'clamp(0.65rem, 2.5vw, 0.85rem)',
        letterSpacing: '0.22em',
        textAlign: 'center',
        margin: '-1.2rem 0 0',
        lineHeight: 1.8,
      }}>
        DE SU SANGRE NACES.<br />DE TUS DECISIONES TE FORJAS.
      </p>

      {/* ── Panel de 4 slots ────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0.5rem',
        width: '100%',
        maxWidth: '600px',
      }}>
        {SLOT_DEFS.map(({ label, storeIdx, color }) => {
          const filled = ancestors[storeIdx]
          const arch   = filled ? ARCHETYPES.find(a => a.id === filled) : null
          return (
            <div
              key={label}
              className="slot-box"
              onClick={() => filled && setAncestor(storeIdx, null)}
              title={filled ? 'Clic para quitar' : ''}
              style={{
                border: `2px ${filled ? 'solid' : 'dashed'} ${color}${filled ? '' : '66'}`,
                borderRadius: 4,
                padding: '0.5rem 0.25rem',
                minHeight: 80,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.2rem',
                cursor: filled ? 'pointer' : 'default',
                background: filled ? `${color}18` : 'transparent',
                boxShadow: filled ? `0 0 10px ${color}33` : 'none',
              }}
            >
              <span style={{
                fontSize: '0.58rem',
                color: filled ? color : `${color}88`,
                fontFamily: 'Cinzel, serif',
                letterSpacing: '0.1em',
                textAlign: 'center',
              }}>
                {label}
              </span>

              {arch ? (
                <>
                  <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{arch.symbol}</span>
                  <span style={{ fontSize: '0.58rem', color: TEXT, textAlign: 'center', lineHeight: 1.2 }}>
                    {arch.name.replace(/^El |^La /, '')}
                  </span>
                </>
              ) : (
                <span style={{
                  fontSize: '0.6rem',
                  color: `${MUTED}99`,
                  fontStyle: 'italic',
                  marginTop: '0.15rem',
                }}>
                  — vacío —
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Grid de arquetipos ──────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '0.75rem',
        width: '100%',
        maxWidth: '760px',
      }}>
        {ARCHETYPES.map(arch => {
          const timesUsed  = countInSlots(arch.id)
          const disabled   = timesUsed >= 2
          const inMaleSlot = ancestors[0] === arch.id || ancestors[2] === arch.id
          const inFemaleSlot = ancestors[1] === arch.id || ancestors[3] === arch.id
          const maleFull   = firstEmptyMale === null
          const femaleFull = firstEmptyFemale === null
          const top4       = topStats(arch)

          let cardClass = 'arch-card'
          if (disabled)    cardClass += ' arch-disabled'
          else if (inMaleSlot && inFemaleSlot) cardClass += ' arch-disabled'
          else if (inMaleSlot)   cardClass += ' sel-gold'
          else if (inFemaleSlot) cardClass += ' sel-garnet'

          return (
            <div key={arch.id} className={cardClass}>

              {/* Emoji + nombre */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', lineHeight: 1 }}>{arch.symbol}</div>
                <div style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '0.75rem',
                  color: arch.accentColor,
                  letterSpacing: '0.08em',
                  marginTop: '0.3rem',
                }}>
                  {arch.name}
                </div>
              </div>

              {/* Descripción */}
              <p style={{
                fontSize: '0.62rem',
                color: MUTED,
                margin: 0,
                lineHeight: 1.5,
                textAlign: 'center',
              }}>
                {arch.description}
              </p>

              {/* Top-4 stats con colores por grupo */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {top4.map(s => (
                  <div key={s.stat} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.56rem', color: MUTED, width: 66, flexShrink: 0 }}>
                      {STAT_LABELS[s.stat]}
                    </span>
                    <div style={{
                      flex: 1, height: 6, background: '#2a2420',
                      borderRadius: 3, overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${s.value * 10}%`,
                        height: '100%',
                        background: STAT_COLOR[s.stat],
                        borderRadius: 3,
                      }} />
                    </div>
                    <span style={{ fontSize: '0.56rem', color: MUTED, width: 12, textAlign: 'right' }}>
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Botones */}
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.15rem' }}>
                <button
                  className="card-btn card-btn-gold"
                  disabled={disabled || maleFull || (inMaleSlot && !inFemaleSlot && maleFull)}
                  onClick={() => addToSlot(arch.id, 'male')}
                >
                  + ABUELO
                </button>
                <button
                  className="card-btn card-btn-garnet"
                  disabled={disabled || femaleFull || (inFemaleSlot && !inMaleSlot && femaleFull)}
                  onClick={() => addToSlot(arch.id, 'female')}
                >
                  + ABUELA
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Selector de país ────────────────────────────────────────────────── */}
      <div style={{ width: '100%', maxWidth: '760px' }}>
        <label style={{
          display: 'block',
          fontFamily: 'Cinzel, serif',
          fontSize: '0.62rem',
          color: MUTED,
          letterSpacing: '0.2em',
          marginBottom: '0.5rem',
        }}>
          PAÍS DE NACIMIENTO
        </label>
        <div style={{ position: 'relative' }}>
          <select
            value={selectedCountry ?? ''}
            onChange={e => setCountry(e.target.value)}
            style={{
              width: '100%',
              background: '#1a1510',
              border: `1px solid ${selectedCountry ? GOLD : '#3a2e1e'}`,
              color: selectedCountry ? TEXT : `${MUTED}`,
              fontFamily: 'system-ui, sans-serif',
              fontSize: '0.9rem',
              padding: '0.75rem 2.5rem 0.75rem 1rem',
              minHeight: 44,
              borderRadius: 4,
              appearance: 'none',
              cursor: 'pointer',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
          >
            <option value="" disabled>Elige tu país de nacimiento…</option>
            {[1, 2, 3, 4].map(tier => (
              <optgroup
                key={tier}
                label={`${TIER_LABELS[tier]}`}
              >
                {COUNTRIES.filter(c => c.tier === tier).map(c => (
                  <option key={c.nombre} value={c.nombre}>
                    {c.nombre}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <span style={{
            position: 'absolute',
            right: '0.9rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: selectedCountry ? GOLD : MUTED,
            pointerEvents: 'none',
            fontSize: '0.7rem',
          }}>▼</span>
        </div>
        {/* Indicador de tier del país seleccionado */}
        {selectedCountry && (() => {
          const c = COUNTRIES.find(c => c.nombre === selectedCountry)
          return c ? (
            <div style={{
              marginTop: '0.4rem',
              fontSize: '0.65rem',
              color: TIER_PALETTE[c.tier],
              letterSpacing: '0.12em',
            }}>
              {TIER_LABELS[c.tier].toUpperCase()}
            </div>
          ) : null
        })()}
      </div>

      {/* ── Botón COMENZAR ──────────────────────────────────────────────────── */}
      <button
        className="btn-start"
        disabled={!canStart}
        onClick={handleStart}
        style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '1rem',
          letterSpacing: '0.2em',
          padding: '0.9rem 3rem',
          minHeight: 44,
          border: `2px solid ${canStart ? GOLD : '#3a2e1e'}`,
          background: canStart ? `${GOLD}18` : 'transparent',
          color: canStart ? GOLD : '#3a2e1e',
          cursor: canStart ? 'pointer' : 'not-allowed',
          opacity: canStart ? 1 : 0.4,
          transition: 'all 0.2s',
          width: '100%',
          maxWidth: '400px',
          borderRadius: 3,
        }}
      >
        COMENZAR EL VIAJE →
      </button>

      {/* Indicador de progreso */}
      {!canStart && (
        <p style={{ fontSize: '0.68rem', color: MUTED, textAlign: 'center', margin: '-1.2rem 0 0' }}>
          {!allFull
            ? `${ancestors.filter(Boolean).length} / 4 ancestros seleccionados`
            : 'Elige un país para continuar'}
        </p>
      )}
    </div>
  )
}
