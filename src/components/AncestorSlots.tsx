import { useState, useEffect, useRef } from 'react'
import type { Archetype, AncestorSlot } from '../types/archetype.types'

interface Props {
  slots:           [Archetype | null, Archetype | null, Archetype | null, Archetype | null]
  activeSlot:      AncestorSlot | null
  onRemoveSlot:    (slot: AncestorSlot) => void
  onActivateSlot:  (slot: AncestorSlot) => void
}

const SLOT_CONFIG = [
  { label: 'Abuelo Paterno', color: '#C9A84C' },
  { label: 'Abuela Paterna', color: '#8B1A2A' },
  { label: 'Abuelo Materno', color: '#C9A84C' },
  { label: 'Abuela Materna', color: '#8B1A2A' },
] as const

const STAT_SHORT: Record<string, string> = {
  logica: 'LÓG', creatividad: 'CRE', disciplina: 'DIS',
  carisma: 'CAR', emocional: 'EMO', ambicion: 'AMB',
  fisico: 'FÍS', riesgo: 'RIE', estabilidad: 'EST',
}

const STAT_KEYS = ['logica', 'creatividad', 'disciplina', 'carisma', 'emocional', 'ambicion', 'fisico', 'riesgo', 'estabilidad'] as const

export function AncestorSlots({ slots, activeSlot, onRemoveSlot, onActivateSlot }: Props) {
  // Track which slot was just filled to trigger flash
  const [flashSlot, setFlashSlot] = useState<number | null>(null)
  const prevSlots = useRef(slots)

  useEffect(() => {
    slots.forEach((s, i) => {
      if (s && !prevSlots.current[i]) {
        setFlashSlot(i)
        setTimeout(() => setFlashSlot(null), 600)
      }
    })
    prevSlots.current = slots
  }, [slots])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
      {SLOT_CONFIG.map((config, index) => {
        const slot      = index as AncestorSlot
        const archetype = slots[slot]
        const color     = config.color
        const isActive  = activeSlot === slot
        const isFlash   = flashSlot === slot

        const topStats = archetype
          ? STAT_KEYS.map(k => ({ key: k, value: archetype.stats[k] }))
              .sort((a, b) => b.value - a.value)
              .slice(0, 3)
          : []

        return (
          <div
            key={slot}
            onClick={() => {
              if (archetype) {
                onRemoveSlot(slot)
              } else {
                onActivateSlot(slot)
              }
            }}
            style={{
              position:      'relative',
              display:       'flex',
              flexDirection: 'column',
              alignItems:    'center',
              padding:       '10px 8px 10px',
              textAlign:     'center',
              minHeight:     140,
              background:    archetype ? `${color}08` : isActive ? `${color}10` : '#0f0d0a',
              border:        isFlash
                ? `1px solid ${color}`
                : isActive
                  ? `1px solid ${color}`
                  : archetype
                    ? `1px solid ${color}88`
                    : `1px solid ${color}22`,
              boxShadow: isFlash
                ? `0 0 40px ${color}99`
                : isActive
                  ? `0 0 24px ${color}66`
                  : archetype
                    ? `0 0 16px ${color}22`
                    : 'none',
              borderRadius: 4,
              cursor:       'pointer',
              transform:    isFlash ? 'scale(1.03)' : 'scale(1)',
              transition:   isFlash
                ? 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease'
                : 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            {/* Corner decorations */}
            <span style={{ position: 'absolute', top: 3, left: 5, color, fontSize: '0.55rem', opacity: 0.35, lineHeight: 1, pointerEvents: 'none' }}>┌</span>
            <span style={{ position: 'absolute', top: 3, right: 5, color, fontSize: '0.55rem', opacity: 0.35, lineHeight: 1, pointerEvents: 'none' }}>┐</span>
            <span style={{ position: 'absolute', bottom: 3, left: 5, color, fontSize: '0.55rem', opacity: 0.35, lineHeight: 1, pointerEvents: 'none' }}>└</span>
            <span style={{ position: 'absolute', bottom: 3, right: 5, color, fontSize: '0.55rem', opacity: 0.35, lineHeight: 1, pointerEvents: 'none' }}>┘</span>

            {/* Slot label */}
            <span style={{
              fontFamily:    'Cinzel, serif',
              fontSize:      '0.5rem',
              letterSpacing: '0.05em',
              color,
              opacity:       0.55,
              marginBottom:  6,
              display:       'block',
            }}>
              {config.label}
            </span>

            {archetype ? (
              <>
                {/* Glyph indicator */}
                <span style={{ fontSize: '1rem', color, opacity: 0.7, marginBottom: 4, display: 'block' }}>
                  ◈
                </span>
                {/* Archetype name */}
                <span style={{
                  fontFamily:   'Cinzel, serif',
                  fontSize:     '0.65rem',
                  fontWeight:   700,
                  color,
                  lineHeight:   1.2,
                  marginBottom: 6,
                  display:      'block',
                }}>
                  {archetype.name}
                </span>

                {/* Top 3 stat chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center', marginBottom: 6 }}>
                  {topStats.map(({ key, value }) => (
                    <span key={key} style={{
                      fontFamily:   'Cinzel, serif',
                      fontSize:     '0.42rem',
                      color,
                      opacity:      0.7,
                      padding:      '1px 4px',
                      border:       `1px solid ${color}44`,
                      borderRadius: 2,
                    }}>
                      {STAT_SHORT[key]} {value}
                    </span>
                  ))}
                </div>

                <span style={{
                  fontFamily:    'Cinzel, serif',
                  fontSize:      '0.42rem',
                  color:         '#6b6045',
                  letterSpacing: '0.05em',
                  marginTop:     'auto',
                }}>
                  Clic para eliminar
                </span>
              </>
            ) : isActive ? (
              <>
                <span style={{ fontSize: '1.1rem', color, opacity: 0.5, marginBottom: 6, display: 'block' }}>◈</span>
                <span style={{
                  fontFamily:    'Cinzel, serif',
                  fontSize:      '0.5rem',
                  color,
                  opacity:       0.7,
                  letterSpacing: '0.05em',
                  lineHeight:    1.4,
                }}>
                  Elige un ancestro
                </span>
              </>
            ) : (
              <>
                <span style={{ fontSize: '1.1rem', color: '#2a2620', opacity: 0.6, marginBottom: 4, display: 'block' }}>◈</span>
                <span style={{
                  fontFamily:    'Cinzel, serif',
                  fontSize:      '0.5rem',
                  color:         '#4a4035',
                  letterSpacing: '0.05em',
                }}>
                  vacío
                </span>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
