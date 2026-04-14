import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import type { AncestorSlot } from '../types/archetype.types'
import type { Archetype } from '../types/archetype.types'
import { ARCHETYPES } from '../data/archetypes'
import { COUNTRIES } from '../data/countries'

// ─── Static maps ─────────────────────────────────────────────────────────────

const STAT_KEYS = [
  'logica', 'creatividad', 'disciplina',
  'carisma', 'emocional', 'ambicion',
  'fisico', 'riesgo', 'estabilidad',
] as const

const STAT_SHORT: Record<string, string> = {
  logica: 'LÓG', creatividad: 'CRE', disciplina: 'DIS',
  carisma: 'CAR', emocional: 'EMO', ambicion: 'AMB',
  fisico: 'FÍS', riesgo: 'RIE', estabilidad: 'EST',
}

const GLYPH: Record<string, string> = {
  academico: '✦', lider: '⚜',    atleta: '◈',  artista: '✧',
  filosofo:  '◎', emprendedor: '◆', cuidador: '♾', explorador: '✺',
  medico:    '✙', militar: '⚔',   politico: '⚑', criminal: '◉',
  marinero:  '⛵', sacerdote: '☩', mercader: '⬡', abogado: '⚖', obrero: '⚙',
}

// Slot 0,2 = grandfather (dorado) · Slot 1,3 = grandmother (granate)
const SLOT_ACCENT  = ['#C9A84C', '#8B1A2A', '#C9A84C', '#8B1A2A'] as const
const SLOT_LABELS  = ['ABUELO PATERNO', 'ABUELA PATERNA', 'ABUELO MATERNO', 'ABUELA MATERNA'] as const

// ─── Helper ───────────────────────────────────────────────────────────────────

function top3Stats(archetype: Archetype) {
  return STAT_KEYS
    .map(k => ({ key: k, value: archetype.stats[k] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AncestorSelection() {
  const selectedAncestors = useGameStore(s => s.selectedAncestors)
  const selectedCountry   = useGameStore(s => s.selectedCountry)
  const selectAncestor    = useGameStore(s => s.selectAncestor)
  const removeAncestor    = useGameStore(s => s.removeAncestor)
  const setCountry        = useGameStore(s => s.setCountry)
  const confirmAncestors  = useGameStore(s => s.confirmAncestors)
  const setScreen         = useGameStore(s => s.setScreen)

  const [activeSlot,  setActiveSlot]  = useState<AncestorSlot | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [hoveredSlot, setHoveredSlot] = useState<AncestorSlot | null>(null)

  const filledCount = selectedAncestors.filter(Boolean).length
  const canConfirm  = filledCount === 4 && !!selectedCountry

  // Times each archetype id appears across all 4 slots
  const archetypeCount = new Map<string, number>()
  for (const a of selectedAncestors) {
    if (a) archetypeCount.set(a.id, (archetypeCount.get(a.id) ?? 0) + 1)
  }

  // ── Interaction handlers ────────────────────────────────────────────────────

  function handleSlotClick(slot: AncestorSlot) {
    if (selectedAncestors[slot]) {
      // Filled slot → clear it
      removeAncestor(slot)
      if (activeSlot === slot) setActiveSlot(null)
    } else {
      // Empty slot → activate / deactivate
      setActiveSlot(prev => (prev === slot ? null : slot))
    }
  }

  function handleCardClick(archetype: Archetype) {
    if (filledCount === 4) return
    if (activeSlot !== null && !selectedAncestors[activeSlot]) {
      selectAncestor(archetype, activeSlot)
      setActiveSlot(null)
    } else {
      const firstEmpty = ([0, 1, 2, 3] as AncestorSlot[]).find(i => !selectedAncestors[i])
      if (firstEmpty !== undefined) selectAncestor(archetype, firstEmpty)
    }
  }

  // ── Decorative line shared in header ───────────────────────────────────────
  const decorLine = (
    <div style={{
      maxWidth:   480,
      margin:     '0 auto',
      height:     1,
      width:      '100%',
      background: 'linear-gradient(90deg, transparent, #C9A84C44, #C9A84C, #C9A84C44, transparent)',
    }} />
  )

  return (
    <div
      className="animate-screen-enter"
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#0d0b08' }}
    >
      {/* ── Atmospheric background ─────────────────────────────────────────── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #1a1408 0%, #0d0b08 60%, #080604 100%)' }} />
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px',
      }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, #000000cc 100%)' }} />

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div style={{ flexShrink: 0, position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 24px 16px', gap: 8 }}>
        {decorLine}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative' }}>
          <h1 style={{
            fontFamily:    'Cinzel, serif',
            fontSize:      'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight:    700,
            letterSpacing: '0.35em',
            color:         '#C9A84C',
            textShadow:    '0 0 40px #C9A84C33',
            margin:        0,
          }}>
            ✦ LINAJE ✦
          </h1>
          <button
            onClick={() => setScreen('start')}
            style={{ position: 'absolute', right: 0, fontFamily: 'Cinzel, serif', fontSize: '0.6rem', color: '#3a3228', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.1em', transition: 'color 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#6b6045' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#3a3228' }}
          >
            ← volver
          </button>
        </div>
        <p style={{ fontFamily: 'Cinzel, serif', fontSize: '0.7rem', color: '#6b6045', letterSpacing: '0.2em', margin: 0, textAlign: 'center' }}>
          Elige los 4 ancestros que forjan tu herencia
        </p>
        {decorLine}
      </div>

      {/* ── Scrollable body ───────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1, padding: '16px 24px 32px' }}>

        {/* ── 4 SLOTS ─────────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {([0, 1, 2, 3] as AncestorSlot[]).map(slot => {
            const accent    = SLOT_ACCENT[slot]
            const filled    = selectedAncestors[slot]
            const isActive  = activeSlot === slot
            const isHovered = hoveredSlot === slot
            const stats     = filled ? top3Stats(filled) : []

            return (
              <div key={slot} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Slot label */}
                <span style={{
                  fontFamily:    'Cinzel, serif',
                  fontSize:      '0.5rem',
                  letterSpacing: '0.2em',
                  color:         `${accent}66`,
                  textAlign:     'center',
                  display:       'block',
                }}>
                  {SLOT_LABELS[slot]}
                </span>

                {/* Slot box */}
                <div
                  onClick={() => handleSlotClick(slot)}
                  onMouseEnter={() => setHoveredSlot(slot)}
                  onMouseLeave={() => setHoveredSlot(null)}
                  style={{
                    position:        'relative',
                    minHeight:       130,
                    background:      '#0f0d0a',
                    border:          `1px solid ${(isActive || (!!filled && isHovered)) ? accent : '#2a2620'}`,
                    borderRadius:    4,
                    cursor:          'pointer',
                    transition:      'all 0.3s',
                    display:         'flex',
                    flexDirection:   'column',
                    alignItems:      'center',
                    justifyContent:  'center',
                    padding:         '10px 8px',
                    boxShadow:       filled
                      ? isHovered ? `0 0 20px ${accent}44` : `0 0 12px ${accent}22`
                      : isActive  ? `0 0 20px ${accent}44` : 'none',
                  }}
                >
                  {/* Corner decorations */}
                  <span style={{ position: 'absolute', top: 4,    left: 5,  fontSize: '0.8rem', color: `${accent}44`, lineHeight: 1, userSelect: 'none' }}>┌</span>
                  <span style={{ position: 'absolute', top: 4,    right: 5, fontSize: '0.8rem', color: `${accent}44`, lineHeight: 1, userSelect: 'none' }}>┐</span>
                  <span style={{ position: 'absolute', bottom: 4, left: 5,  fontSize: '0.8rem', color: `${accent}44`, lineHeight: 1, userSelect: 'none' }}>└</span>
                  <span style={{ position: 'absolute', bottom: 4, right: 5, fontSize: '0.8rem', color: `${accent}44`, lineHeight: 1, userSelect: 'none' }}>┘</span>

                  {filled ? (
                    /* Slot lleno */
                    <>
                      <span style={{ fontSize: '2rem', color: accent, lineHeight: 1, marginBottom: 4 }}>
                        {GLYPH[filled.id] ?? '◆'}
                      </span>
                      <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.65rem', fontWeight: 700, color: '#d4b87a', letterSpacing: '0.1em', textAlign: 'center', marginBottom: 4 }}>
                        {filled.name}
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center', marginBottom: 4 }}>
                        {stats.map(({ key }) => (
                          <span key={key} style={{ fontFamily: 'Cinzel, serif', fontSize: '0.5rem', color: accent, border: `1px solid ${accent}`, opacity: 0.5, padding: '2px 6px', borderRadius: 2 }}>
                            {STAT_SHORT[key]}
                          </span>
                        ))}
                      </div>
                      <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.45rem', color: '#3a3228', marginTop: 4 }}>
                        × eliminar
                      </span>
                    </>
                  ) : (
                    /* Slot vacío */
                    <>
                      <span style={{ fontSize: '1.6rem', color: isActive ? accent : '#2a2620', lineHeight: 1, marginBottom: 4, transition: 'color 0.3s', userSelect: 'none' }}>
                        ◈
                      </span>
                      <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.6rem', color: isActive ? accent : '#2a2620', letterSpacing: '0.1em', transition: 'color 0.3s' }}>
                        vacío
                      </span>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* ── FILA META: país + progreso ───────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', marginBottom: 20 }}>

          {/* Country selector */}
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontFamily: 'Cinzel, serif', fontSize: '0.55rem', color: '#6b6045', letterSpacing: '0.15em', marginBottom: 6 }}>
              PAÍS DE NACIMIENTO
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedCountry}
                onChange={e => setCountry(e.target.value)}
                style={{
                  width:        '100%',
                  appearance:   'none',
                  background:   '#141210',
                  border:       '1px solid #3a3228',
                  color:        selectedCountry ? '#C9A84C' : '#3a3228',
                  fontFamily:   'Cinzel, serif',
                  fontSize:     '0.8rem',
                  padding:      '10px 40px 10px 16px',
                  borderRadius: 2,
                  cursor:       'pointer',
                  outline:      'none',
                }}
              >
                <option value="" disabled style={{ background: '#141210', color: '#3a3228' }}>Elige tu país...</option>
                {COUNTRIES.map(c => (
                  <option key={c.name} value={c.name} style={{ background: '#141210', color: '#C9A84C' }}>
                    {c.name}
                  </option>
                ))}
              </select>
              <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#C9A84C', pointerEvents: 'none', fontSize: '0.8rem', userSelect: 'none' }}>
                ▾
              </span>
            </div>
          </div>

          {/* Progress dots + counter */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingBottom: 2 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {([0, 1, 2, 3] as AncestorSlot[]).map(i => {
                const filled = !!selectedAncestors[i]
                const color  = SLOT_ACCENT[i]
                return (
                  <div key={i} style={{
                    width:        10,
                    height:       10,
                    borderRadius: '50%',
                    background:   filled ? color : '#2a2620',
                    boxShadow:    filled ? `0 0 6px ${color}88` : 'none',
                    transition:   'all 0.25s',
                  }} />
                )
              })}
            </div>
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.6rem', color: '#6b6045' }}>
              {filledCount} / 4
            </span>
          </div>
        </div>

        {/* ── SEPARADOR ───────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #2a2620)' }} />
          <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.55rem', color: '#3a3228', letterSpacing: '0.25em', whiteSpace: 'nowrap' }}>
            ELIGE TU LINAJE
          </span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(270deg, transparent, #2a2620)' }} />
        </div>

        {/* ── GRID DE CARTAS ──────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 28 }}>
          {ARCHETYPES.map(archetype => {
            const isHovered  = hoveredCard === archetype.id
            const count      = archetypeCount.get(archetype.id) ?? 0
            const isDisabled = filledCount === 4
            const stats      = top3Stats(archetype)

            return (
              <div
                key={archetype.id}
                onClick={() => { if (!isDisabled) handleCardClick(archetype) }}
                onMouseEnter={() => { if (!isDisabled) setHoveredCard(archetype.id) }}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  position:       'relative',
                  background:     '#0f0d0a',
                  border:         `1px solid ${isHovered ? '#C9A84C44' : '#2a2620'}`,
                  borderRadius:   4,
                  padding:        '20px 14px 16px',
                  minHeight:      210,
                  display:        'flex',
                  flexDirection:  'column',
                  alignItems:     'center',
                  cursor:         isDisabled ? 'not-allowed' : 'pointer',
                  transition:     'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                  transform:      isHovered ? 'translateY(-3px)' : 'translateY(0)',
                  boxShadow:      isHovered ? '0 8px 24px #C9A84C11' : 'none',
                  opacity:        isDisabled ? 0.5 : 1,
                  overflow:       'hidden',
                }}
              >
                {/* Top accent line */}
                <div style={{
                  position:   'absolute',
                  top:        0,
                  left:       0,
                  right:      0,
                  height:     1,
                  background: isHovered ? 'linear-gradient(90deg, transparent, #C9A84C, transparent)' : 'transparent',
                  transition: 'background 0.25s ease',
                }} />

                {/* ×N badge — only when in more than 1 slot */}
                {count > 1 && (
                  <div style={{
                    position:     'absolute',
                    top:          6,
                    right:        6,
                    fontFamily:   'Cinzel, serif',
                    fontSize:     '0.5rem',
                    fontWeight:   700,
                    background:   '#C9A84C',
                    color:        '#0d0b08',
                    padding:      '2px 5px',
                    borderRadius: 2,
                    lineHeight:   1.4,
                  }}>
                    ×{count}
                  </div>
                )}

                {/* Glyph */}
                <span style={{
                  fontSize:     '2.2rem',
                  lineHeight:   1,
                  marginBottom: 6,
                  color:        isHovered ? '#C9A84C' : '#2a2620',
                  textShadow:   isHovered ? '0 0 20px #C9A84C66' : 'none',
                  transition:   'color 0.2s ease, text-shadow 0.2s ease',
                  userSelect:   'none',
                }}>
                  {GLYPH[archetype.id] ?? '◆'}
                </span>

                {/* Name */}
                <span style={{
                  fontFamily:    'Cinzel, serif',
                  fontSize:      '0.65rem',
                  fontWeight:    700,
                  letterSpacing: '0.18em',
                  color:         isHovered ? '#C9A84C' : '#5a4a30',
                  display:       'block',
                  marginBottom:  4,
                  textAlign:     'center',
                  transition:    'color 0.2s ease',
                }}>
                  {archetype.name}
                </span>

                {/* Lore */}
                <span style={{
                  fontFamily: 'Georgia, serif',
                  fontStyle:  'italic',
                  fontSize:   '0.55rem',
                  color:      '#3a3228',
                  lineHeight: 1.5,
                  margin:     '6px 0',
                  textAlign:  'center',
                  display:    'block',
                }}>
                  "{archetype.lore}"
                </span>

                {/* Top 3 stat bars */}
                <div style={{ marginTop: 'auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {stats.map(({ key, value }) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.45rem', color: '#3a3228', width: 24, textAlign: 'right', flexShrink: 0 }}>
                        {STAT_SHORT[key]}
                      </span>
                      <div style={{ flex: 1, height: 2, background: '#1c1915', borderRadius: 1, overflow: 'hidden' }}>
                        <div style={{
                          height:     '100%',
                          width:      `${(value / 10) * 100}%`,
                          background: isHovered ? 'linear-gradient(90deg, #C9A84C66, #C9A84C)' : '#3a3228',
                          transition: 'background 0.25s ease',
                        }} />
                      </div>
                      <span style={{
                        fontFamily: 'Cinzel, serif',
                        fontSize:   '0.55rem',
                        color:      isHovered ? '#C9A84C' : '#3a3228',
                        width:      14,
                        textAlign:  'right',
                        transition: 'color 0.25s ease',
                      }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* ── CTA FINAL ───────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <p style={{ fontFamily: 'Cinzel, serif', fontSize: '0.6rem', color: '#3a3228', letterSpacing: '0.15em', textAlign: 'center', margin: 0, minHeight: '1.1rem' }}>
            {filledCount < 4
              ? `${4 - filledCount} ${(4 - filledCount) === 1 ? 'ancestro' : 'ancestros'} por elegir`
              : !selectedCountry
                ? 'Elige un país de nacimiento'
                : ''}
          </p>
          <button
            onClick={canConfirm ? confirmAncestors : undefined}
            disabled={!canConfirm}
            style={{
              background:    '#C9A84C',
              color:         '#0d0b08',
              fontFamily:    'Cinzel, serif',
              fontSize:      '0.8rem',
              fontWeight:    700,
              letterSpacing: '0.25em',
              padding:       '16px 56px',
              borderRadius:  2,
              border:        'none',
              cursor:        canConfirm ? 'pointer' : 'not-allowed',
              boxShadow:     canConfirm ? '0 0 32px #C9A84C33, 0 4px 16px #00000066' : 'none',
              opacity:       canConfirm ? 1 : 0.3,
              transition:    'all 0.25s ease',
            }}
            onMouseEnter={e => { if (canConfirm) (e.currentTarget as HTMLButtonElement).style.background = '#d4b05a' }}
            onMouseLeave={e => { if (canConfirm) (e.currentTarget as HTMLButtonElement).style.background = '#C9A84C' }}
          >
            FORJAR MI HERENCIA
          </button>
        </div>
      </div>
    </div>
  )
}
