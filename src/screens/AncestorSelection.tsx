import { useGameStore } from '../store/gameStore'
import { ARCHETYPES } from '../data/archetypes'
import { COUNTRIES, TIER_LABELS, TIER_COLORS } from '../data/countries'
import type { Archetype } from '../types/game.types'

// ─── Constantes visuales ──────────────────────────────────────────────────────
const GOLD   = '#C9A84C'
const GARNET = '#8B1A2A'
const BG     = '#0d0b08'
const TEXT   = '#d4c5a0'
const MUTED  = '#666'

// ─── Mapa de nombre de stat → etiqueta ───────────────────────────────────────
const STAT_LABELS: Record<string, string> = {
  logica: 'Lógica', creatividad: 'Creatividad', disciplina: 'Disciplina',
  carisma: 'Carisma', emocional: 'Emocional',  ambicion: 'Ambición',
  fisico: 'Físico',  riesgo: 'Riesgo',          estabilidad: 'Estabilidad',
}

// ─── Slots visuales: orden display → índice en store ─────────────────────────
// CLAUDE.md: 0,2 = abuelos masculinos | 1,3 = abuelas femeninas
const SLOT_DEFS = [
  { label: 'ABUELO 1', storeIdx: 0 as 0|1|2|3, color: GOLD   },
  { label: 'ABUELO 2', storeIdx: 2 as 0|1|2|3, color: GOLD   },
  { label: 'ABUELA 1', storeIdx: 1 as 0|1|2|3, color: GARNET },
  { label: 'ABUELA 2', storeIdx: 3 as 0|1|2|3, color: GARNET },
]

// ─── Top-4 stats de un arquetipo ─────────────────────────────────────────────
function topStats(arch: Archetype) {
  return [...arch.stats].sort((a, b) => b.value - a.value).slice(0, 4)
}

export default function AncestorSelection() {
  const ancestors      = useGameStore(s => s.ancestors)
  const selectedCountry = useGameStore(s => s.selectedCountry)
  const setAncestor    = useGameStore(s => s.setAncestor)
  const setCountry     = useGameStore(s => s.setCountry)
  const confirmAncestors = useGameStore(s => s.confirmAncestors)
  const setScreen      = useGameStore(s => s.setScreen)

  const allFull  = ancestors.every(a => a !== null)
  const canStart = allFull && selectedCountry !== null

  // Cuántas veces aparece un arquetipo en los slots
  const countInSlots = (id: string) => ancestors.filter(a => a === id).length

  // Primer slot vacío de abuelos [0,2] / abuelas [1,3]
  const firstEmptyMale   = ([0, 2] as const).find(i => ancestors[i] === null) ?? null
  const firstEmptyFemale = ([1, 3] as const).find(i => ancestors[i] === null) ?? null

  function addToSlot(archetypeId: string, gender: 'male' | 'female') {
    const slot = gender === 'male' ? firstEmptyMale : firstEmptyFemale
    if (slot !== null) setAncestor(slot, archetypeId)
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
        color: `${GOLD}88`,
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
              onClick={() => filled && setAncestor(storeIdx, null)}
              title={filled ? 'Clic para quitar' : ''}
              style={{
                border: `2px ${filled ? 'solid' : 'dashed'} ${color}`,
                borderRadius: 4,
                padding: '0.5rem 0.25rem',
                minHeight: 72,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.2rem',
                cursor: filled ? 'pointer' : 'default',
                transition: 'background 0.15s',
                background: filled ? `${color}18` : 'transparent',
              }}
            >
              <span style={{ fontSize: '0.6rem', color, fontFamily: 'Cinzel, serif', letterSpacing: '0.12em', textAlign: 'center' }}>
                {label}
              </span>
              {arch ? (
                <>
                  <span style={{ fontSize: '1.3rem' }}>{arch.symbol}</span>
                  <span style={{ fontSize: '0.6rem', color: TEXT, textAlign: 'center', lineHeight: 1.2 }}>
                    {arch.name.replace(/^El |^La /, '')}
                  </span>
                </>
              ) : (
                <span style={{ fontSize: '1.2rem', color: `${color}44` }}>＋</span>
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
          const timesUsed   = countInSlots(arch.id)
          const disabled    = timesUsed >= 2
          const maleFull    = firstEmptyMale === null
          const femaleFull  = firstEmptyFemale === null
          const top4        = topStats(arch)

          return (
            <div
              key={arch.id}
              style={{
                border: `1px solid ${disabled ? '#333' : arch.accentColor}44`,
                borderRadius: 6,
                background: disabled ? '#111' : '#100e0b',
                padding: '0.85rem 0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                opacity: disabled ? 0.4 : 1,
                transition: 'opacity 0.2s',
              }}
            >
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
                fontSize: '0.65rem',
                color: MUTED,
                margin: 0,
                lineHeight: 1.5,
                textAlign: 'center',
              }}>
                {arch.description}
              </p>

              {/* Top-4 stats */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {top4.map(s => (
                  <div key={s.stat} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.58rem', color: MUTED, width: 68, flexShrink: 0 }}>
                      {STAT_LABELS[s.stat]}
                    </span>
                    <div style={{ flex: 1, height: 4, background: '#222', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{
                        width: `${s.value * 10}%`,
                        height: '100%',
                        background: arch.accentColor,
                        borderRadius: 2,
                      }} />
                    </div>
                    <span style={{ fontSize: '0.58rem', color: MUTED, width: 14, textAlign: 'right' }}>
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Botones */}
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem' }}>
                <CardButton
                  label="+ ABUELO"
                  color={GOLD}
                  disabled={disabled || maleFull}
                  onClick={() => addToSlot(arch.id, 'male')}
                />
                <CardButton
                  label="+ ABUELA"
                  color={GARNET}
                  disabled={disabled || femaleFull}
                  onClick={() => addToSlot(arch.id, 'female')}
                />
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
          fontSize: '0.65rem',
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
              background: '#100e0b',
              border: `1px solid ${selectedCountry ? GOLD : '#333'}`,
              color: selectedCountry ? TEXT : MUTED,
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
            <option value="" disabled>Elige tu país…</option>
            {[1, 2, 3, 4].map(tier => (
              <optgroup
                key={tier}
                label={`── ${TIER_LABELS[tier]} ──`}
                style={{ color: TIER_COLORS[tier] }}
              >
                {COUNTRIES.filter(c => c.tier === tier).map(c => (
                  <option key={c.nombre} value={c.nombre}>
                    {c.nombre}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {/* Chevron decorativo */}
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
      </div>

      {/* ── Botón COMENZAR ──────────────────────────────────────────────────── */}
      <button
        disabled={!canStart}
        onClick={handleStart}
        style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '1rem',
          letterSpacing: '0.2em',
          padding: '0.9rem 3rem',
          minHeight: 44,
          border: `2px solid ${canStart ? GOLD : '#333'}`,
          background: canStart ? `${GOLD}18` : 'transparent',
          color: canStart ? GOLD : '#444',
          cursor: canStart ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s',
          width: '100%',
          maxWidth: '400px',
        }}
        onMouseEnter={e => {
          if (!canStart) return
          const b = e.currentTarget
          b.style.background = GOLD
          b.style.color = BG
        }}
        onMouseLeave={e => {
          if (!canStart) return
          const b = e.currentTarget
          b.style.background = `${GOLD}18`
          b.style.color = GOLD
        }}
      >
        COMENZAR EL VIAJE →
      </button>

      {/* Indicador de progreso */}
      {!canStart && (
        <p style={{ fontSize: '0.7rem', color: MUTED, textAlign: 'center', margin: '-1.2rem 0 0' }}>
          {!allFull
            ? `${ancestors.filter(Boolean).length} / 4 ancestros elegidos`
            : 'Elige un país para continuar'}
        </p>
      )}
    </div>
  )
}

// ─── Botón compacto dentro de cada carta ─────────────────────────────────────
function CardButton({
  label, color, disabled, onClick,
}: {
  label: string; color: string; disabled: boolean; onClick: () => void
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        flex: 1,
        background: 'transparent',
        border: `1px solid ${disabled ? '#333' : color}`,
        color: disabled ? '#444' : color,
        fontSize: '0.58rem',
        fontFamily: 'Cinzel, serif',
        letterSpacing: '0.08em',
        padding: '0.35rem 0.2rem',
        minHeight: 28,
        cursor: disabled ? 'not-allowed' : 'pointer',
        borderRadius: 3,
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => {
        if (disabled) return
        e.currentTarget.style.background = `${color}22`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent'
      }}
    >
      {label}
    </button>
  )
}
