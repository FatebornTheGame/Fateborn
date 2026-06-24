import { useState }                    from 'react'
import { useTranslation }              from 'react-i18next'
import { useGameStore }               from '../store/gameStore'
import type { AncestorSlot }          from '../types/archetype.types'
import type { Archetype }             from '../types/archetype.types'
import { ARCHETYPES }                 from '../data/archetypes'
import { COUNTRIES }                  from '../data/countries'
import { MuteButton }                 from '../components/MuteButton'
import { AtmosphericBackground }      from '../styles/AtmosphericBackground'
import { colors, fonts, transitions } from '../styles/tokens'

// ─── Static maps ─────────────────────────────────────────────────────────────

const STAT_KEYS = [
  'logica', 'creatividad', 'disciplina',
  'carisma', 'emocional', 'ambicion',
  'fisico', 'riesgo', 'estabilidad',
] as const

const GLYPH: Record<string, string> = {
  academico: '✦', lider: '⚜',    atleta: '◈',  artista: '✧',
  filosofo:  '◎', emprendedor: '◆', cuidador: '♾', explorador: '✺',
  medico:    '✙', militar: '⚔',   politico: '⚑', criminal: '◉',
  marinero:  '⛵', sacerdote: '☩', mercader: '⬡', abogado: '⚖', obrero: '⚙',
}

// Slot 0,2 = grandfather (gold) · Slot 1,3 = grandmother (crimson)
const SLOT_ACCENT = [colors.gold, colors.crimson, colors.gold, colors.crimson] as const

// ─── Helper ───────────────────────────────────────────────────────────────────

function top3Stats(archetype: Archetype) {
  return STAT_KEYS
    .map(k => ({ key: k, value: archetype.stats[k] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AncestorSelection() {
  const { t }             = useTranslation()
  const selectedAncestors = useGameStore(s => s.selectedAncestors)
  const selectedCountry   = useGameStore(s => s.selectedCountry)
  const selectAncestor    = useGameStore(s => s.selectAncestor)
  const removeAncestor    = useGameStore(s => s.removeAncestor)
  const setCountry        = useGameStore(s => s.setCountry)
  const confirmAncestors  = useGameStore(s => s.confirmAncestors)
  const setScreen         = useGameStore(s => s.setScreen)

  const dynastyMode       = useGameStore(s => s.dynastyMode)
  const dynastyParentSlot = useGameStore(s => s.dynastyParentSlot)

  const [activeSlot,  setActiveSlot]  = useState<AncestorSlot | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [hoveredSlot, setHoveredSlot] = useState<AncestorSlot | null>(null)

  const filledCount = selectedAncestors.filter(Boolean).length
  const canConfirm  = filledCount === 4 && !!selectedCountry

  const archetypeCount = new Map<string, number>()
  for (const a of selectedAncestors) {
    if (a) archetypeCount.set(a.id, (archetypeCount.get(a.id) ?? 0) + 1)
  }

  function isDynastySlot(slot: AncestorSlot): boolean {
    return dynastyMode && dynastyParentSlot === slot
  }

  function handleSlotClick(slot: AncestorSlot) {
    if (isDynastySlot(slot)) return
    if (selectedAncestors[slot]) {
      removeAncestor(slot)
      if (activeSlot === slot) setActiveSlot(null)
    } else {
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

  const decorLine = (
    <div style={{
      maxWidth:   480,
      margin:     '0 auto',
      height:     1,
      width:      '100%',
      background: `linear-gradient(90deg, transparent, ${colors.gold}66, ${colors.gold}, ${colors.gold}66, transparent)`,
    }} />
  )

  return (
    <div
      className="animate-screen-enter"
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: colors.bg.primary }}
    >
      <AtmosphericBackground />
      <MuteButton />

      {/* Scrollable body — header + slots + country son sticky dentro de este scroll container */}
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1 }}>

        {/* STICKY BLOCK: header + slots + country */}
        <div style={{
          position:   'sticky',
          top:        0,
          zIndex:     10,
          background: `${colors.bg.primary}f8`,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          paddingBottom: 16,
        }}>
          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 24px 16px', gap: 8 }}>
            {decorLine}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative' }}>
              <h1 style={{
                fontFamily:    fonts.display,
                fontSize:      'clamp(1.6rem, 4vw, 2.4rem)',
                fontWeight:    700,
                letterSpacing: '0.35em',
                color:         colors.gold,
                textShadow:    `0 0 40px ${colors.gold}33`,
                margin:        0,
              }}>
                {t('ancestors.title')}
              </h1>
              <button
                onClick={() => setScreen('start')}
                style={{
                  position:      'absolute',
                  right:         0,
                  fontFamily:    fonts.display,
                  fontSize:      '0.6rem',
                  color:         colors.border.warm,
                  background:    'none',
                  border:        'none',
                  cursor:        'pointer',
                  letterSpacing: '0.1em',
                  transition:    `color ${transitions.fast}`,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = colors.text.muted }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = colors.border.warm }}
              >
                {t('ancestors.back')}
              </button>
            </div>
            <p style={{ fontFamily: fonts.display, fontSize: '0.7rem', color: colors.text.muted, letterSpacing: '0.2em', margin: 0, textAlign: 'center' }}>
              {t('ancestors.subtitle')}
            </p>
            <p style={{ fontFamily: fonts.body, fontStyle: 'italic', fontSize: '0.8rem', color: '#6b5535', lineHeight: 1.7, margin: '4px 0 0', textAlign: 'center', maxWidth: 440 }}>
              {t('ancestors.context')}
            </p>
            {decorLine}
          </div>

          {/* 4 SLOTS */}
          <div style={{ padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {([0, 1, 2, 3] as AncestorSlot[]).map(slot => {
            const accent     = SLOT_ACCENT[slot]
            const filled     = selectedAncestors[slot]
            const isActive   = activeSlot === slot
            const isHovered  = hoveredSlot === slot
            const isDynasty  = isDynastySlot(slot)
            const stats      = filled ? top3Stats(filled) : []

            return (
              <div key={slot} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{
                  fontFamily:    fonts.display,
                  fontSize:      '0.5rem',
                  letterSpacing: '0.2em',
                  color:         `${accent}66`,
                  textAlign:     'center',
                  display:       'block',
                }}>
                  {t(`ancestors.slotLabels.${slot}`)}
                </span>

                <div
                  onClick={() => handleSlotClick(slot)}
                  onMouseEnter={() => setHoveredSlot(slot)}
                  onMouseLeave={() => setHoveredSlot(null)}
                  style={{
                    position:       'relative',
                    minHeight:      130,
                    background:     colors.bg.card,
                    border:         `1px solid ${(isActive || (!!filled && isHovered)) ? accent : colors.border.default}`,
                    borderRadius:   4,
                    cursor:         'pointer',
                    transition:     'all 0.3s',
                    display:        'flex',
                    flexDirection:  'column',
                    alignItems:     'center',
                    justifyContent: 'center',
                    padding:        '10px 8px',
                    boxShadow:      filled
                      ? isHovered ? `0 0 20px ${accent}44` : `0 0 12px ${accent}22`
                      : isActive  ? `0 0 20px ${accent}44` : 'none',
                  }}
                >
                  <span style={{ position: 'absolute', top: 4,    left: 5,  fontSize: '0.8rem', color: `${accent}44`, lineHeight: 1, userSelect: 'none' }}>┌</span>
                  <span style={{ position: 'absolute', top: 4,    right: 5, fontSize: '0.8rem', color: `${accent}44`, lineHeight: 1, userSelect: 'none' }}>┐</span>
                  <span style={{ position: 'absolute', bottom: 4, left: 5,  fontSize: '0.8rem', color: `${accent}44`, lineHeight: 1, userSelect: 'none' }}>└</span>
                  <span style={{ position: 'absolute', bottom: 4, right: 5, fontSize: '0.8rem', color: `${accent}44`, lineHeight: 1, userSelect: 'none' }}>┘</span>

                  {filled ? (
                    <>
                      {isDynasty && (
                        <span style={{
                          position:     'absolute',
                          top:          5,
                          left:         5,
                          fontFamily:   fonts.display,
                          fontSize:     '0.4rem',
                          letterSpacing: '0.1em',
                          color:        colors.crimson,
                          background:   `${colors.crimson}22`,
                          padding:      '1px 4px',
                          borderRadius: 2,
                        }}>
                          ★
                        </span>
                      )}
                      <span style={{ fontSize: '2rem', color: isDynasty ? colors.crimson : accent, lineHeight: 1, marginBottom: 4 }}>
                        {isDynasty ? '★' : (GLYPH[filled.id] ?? '◆')}
                      </span>
                      <span style={{ fontFamily: fonts.display, fontSize: '0.65rem', fontWeight: 700, color: isDynasty ? colors.crimson : '#d4b87a', letterSpacing: '0.1em', textAlign: 'center', marginBottom: 4 }}>
                        {filled.name}
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center', marginBottom: 4 }}>
                        {stats.map(({ key }) => (
                          <span key={key} style={{ fontFamily: fonts.display, fontSize: '0.5rem', color: isDynasty ? colors.crimson : accent, border: `1px solid ${isDynasty ? colors.crimson : accent}`, opacity: 0.5, padding: '2px 6px', borderRadius: 2 }}>
                            {t(`statAbbr.${key}`)}
                          </span>
                        ))}
                      </div>
                      {!isDynasty && (
                        <span style={{ fontFamily: fonts.display, fontSize: '0.45rem', color: colors.border.warm, marginTop: 4 }}>
                          {t('ancestors.slotRemove')}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: '1.6rem', color: isActive ? accent : colors.border.default, lineHeight: 1, marginBottom: 4, transition: `color 0.3s`, userSelect: 'none' }}>
                        ◈
                      </span>
                      <span style={{ fontFamily: fonts.display, fontSize: '0.6rem', color: isActive ? accent : colors.border.default, letterSpacing: '0.1em', transition: `color 0.3s` }}>
                        {t('ancestors.slotEmpty')}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>

          {/* META ROW: country + progress */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', marginBottom: 0 }}>

          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontFamily: fonts.display, fontSize: '0.55rem', color: colors.text.muted, letterSpacing: '0.15em', marginBottom: 6 }}>
              {t('ancestors.country')}
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedCountry}
                onChange={e => setCountry(e.target.value)}
                style={{
                  width:        '100%',
                  appearance:   'none',
                  background:   colors.bg.secondary,
                  border:       `1px solid ${colors.border.warm}`,
                  color:        selectedCountry ? colors.gold : colors.border.warm,
                  fontFamily:   fonts.display,
                  fontSize:     '0.8rem',
                  padding:      '10px 40px 10px 16px',
                  borderRadius: 2,
                  cursor:       'pointer',
                  outline:      'none',
                }}
              >
                <option value="" disabled style={{ background: colors.bg.secondary, color: colors.border.warm }}>
                  {t('ancestors.selectCountry')}
                </option>
                {COUNTRIES.map(c => (
                  <option key={c.name} value={c.name} style={{ background: colors.bg.secondary, color: colors.gold }}>
                    {c.name}
                  </option>
                ))}
              </select>
              <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: colors.gold, pointerEvents: 'none', fontSize: '0.8rem', userSelect: 'none' }}>
                ▾
              </span>
            </div>
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingBottom: 2 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {([0, 1, 2, 3] as AncestorSlot[]).map(i => {
                const isFilled = !!selectedAncestors[i]
                const color    = SLOT_ACCENT[i]
                return (
                  <div key={i} style={{
                    width:        10,
                    height:       10,
                    borderRadius: '50%',
                    background:   isFilled ? color : colors.border.default,
                    boxShadow:    isFilled ? `0 0 6px ${color}88` : 'none',
                    transition:   'all 0.25s',
                  }} />
                )
              })}
            </div>
            <span style={{ fontFamily: fonts.display, fontSize: '0.6rem', color: colors.text.muted }}>
              {filledCount} / 4
            </span>
          </div>
          </div>{/* end META ROW */}
          </div>{/* end slots+meta padding wrapper */}
        </div>{/* end STICKY BLOCK */}

        {/* Scrollable cards section */}
        <div style={{ padding: '0 24px 32px' }}>

        {/* Separator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${colors.border.default})` }} />
          <span style={{ fontFamily: fonts.display, fontSize: '0.55rem', color: colors.border.warm, letterSpacing: '0.25em', whiteSpace: 'nowrap' }}>
            {t('ancestors.lineageLabel')}
          </span>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(270deg, transparent, ${colors.border.default})` }} />
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 12, marginBottom: 28 }}>
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
                  background:     colors.bg.card,
                  border:         `1px solid ${isHovered ? `${colors.gold}44` : colors.border.default}`,
                  borderRadius:   4,
                  padding:        '20px 14px 16px',
                  minHeight:      210,
                  display:        'flex',
                  flexDirection:  'column',
                  alignItems:     'center',
                  cursor:         isDisabled ? 'not-allowed' : 'pointer',
                  transition:     `all ${transitions.normal}`,
                  transform:      isHovered ? 'translateY(-3px)' : 'translateY(0)',
                  boxShadow:      isHovered ? `0 8px 24px ${colors.gold}11` : 'none',
                  opacity:        isDisabled ? 0.5 : 1,
                  overflow:       'hidden',
                }}
              >
                {/* Top accent line */}
                <div style={{
                  position:   'absolute',
                  top:        0, left: 0, right: 0,
                  height:     1,
                  background: isHovered ? `linear-gradient(90deg, transparent, ${colors.gold}, transparent)` : 'transparent',
                  transition: `background ${transitions.fast}`,
                }} />

                {/* ×N badge */}
                {count > 1 && (
                  <div style={{
                    position:     'absolute',
                    top:          6,
                    right:        6,
                    fontFamily:   fonts.display,
                    fontSize:     '0.5rem',
                    fontWeight:   700,
                    background:   colors.gold,
                    color:        colors.bg.primary,
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
                  color:        isHovered ? colors.gold : colors.text.faint,
                  textShadow:   isHovered ? `0 0 20px ${colors.gold}66` : 'none',
                  transition:   `color ${transitions.fast}, text-shadow ${transitions.fast}`,
                  userSelect:   'none',
                }}>
                  {GLYPH[archetype.id] ?? '◆'}
                </span>

                {/* Name */}
                <span style={{
                  fontFamily:    fonts.display,
                  fontSize:      '0.65rem',
                  fontWeight:    700,
                  letterSpacing: '0.18em',
                  color:         isHovered ? colors.gold : colors.text.secondary,
                  display:       'block',
                  marginBottom:  4,
                  textAlign:     'center',
                  transition:    `color ${transitions.fast}`,
                }}>
                  {archetype.name}
                </span>

                {/* Lore */}
                <span style={{
                  fontFamily: fonts.body,
                  fontStyle:  'italic',
                  fontSize:   '0.55rem',
                  color:      '#5a4a38',
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
                      <span style={{ fontFamily: fonts.display, fontSize: '0.45rem', color: colors.text.secondary, width: 24, textAlign: 'right', flexShrink: 0 }}>
                        {t(`statAbbr.${key}`)}
                      </span>
                      <div style={{ flex: 1, height: 2, background: colors.bg.tertiary, borderRadius: 1, overflow: 'hidden' }}>
                        <div style={{
                          height:     '100%',
                          width:      `${(value / 10) * 100}%`,
                          background: isHovered ? `linear-gradient(90deg, ${colors.gold}66, ${colors.gold})` : colors.text.secondary,
                          transition: `background ${transitions.fast}`,
                        }} />
                      </div>
                      <span style={{
                        fontFamily: fonts.display,
                        fontSize:   '0.55rem',
                        color:      isHovered ? colors.gold : colors.text.secondary,
                        width:      14,
                        textAlign:  'right',
                        transition: `color ${transitions.fast}`,
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

        {/* CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <p style={{ fontFamily: fonts.display, fontSize: '0.6rem', color: '#6b6045', letterSpacing: '0.15em', textAlign: 'center', margin: 0, minHeight: '1.1rem' }}>
            {filledCount < 4
              ? t('ancestors.remaining_other', { count: 4 - filledCount })
              : !selectedCountry
                ? t('ancestors.noCountry')
                : ''}
          </p>
          <button
            onClick={canConfirm ? confirmAncestors : undefined}
            disabled={!canConfirm}
            style={{
              background:    canConfirm ? colors.gold : '#1c1915',
              color:         canConfirm ? colors.bg.primary : '#6b6045',
              fontFamily:    fonts.display,
              fontSize:      '0.8rem',
              fontWeight:    700,
              letterSpacing: '0.25em',
              padding:       '16px 56px',
              borderRadius:  2,
              border:        canConfirm ? 'none' : '1px solid #3a3228',
              cursor:        canConfirm ? 'pointer' : 'not-allowed',
              boxShadow:     canConfirm ? `0 0 32px ${colors.gold}33` : 'none',
              opacity:       1,
              transition:    `all ${transitions.normal}`,
            }}
            onMouseEnter={e => { if (canConfirm) (e.currentTarget as HTMLButtonElement).style.background = '#d4b05a' }}
            onMouseLeave={e => { if (canConfirm) (e.currentTarget as HTMLButtonElement).style.background = colors.gold }}
          >
            {t('ancestors.proceed')}
          </button>
        </div>
        </div>{/* end scrollable cards section */}
      </div>{/* end body scroll container */}
    </div>
  )
}
