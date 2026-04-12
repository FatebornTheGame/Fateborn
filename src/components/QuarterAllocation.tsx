import { useState } from 'react'
import type { Quarter } from '../systems/timeSystem'

const GOLD   = '#C9A84C'
const GARNET = '#8B1A2A'
const BG2    = '#0f0d0a'
const TOTAL  = 13

type Alloc = Quarter['allocation']

interface ActivityDef {
  key: keyof Alloc
  label: string
  icon: string
  desc: string
  color: string
  minAge: number
}

const ACTIVITIES: ActivityDef[] = [
  { key: 'estudios', label: 'ESTUDIOS',  icon: '📚', color: '#4a9eff', minAge: 0,
    desc: 'Invierte en tu futuro académico' },
  { key: 'familia',  label: 'FAMILIA',   icon: '🏠', color: '#4aff8a', minAge: 0,
    desc: 'Los lazos familiares necesitan cuidado' },
  { key: 'social',   label: 'AMIGOS',    icon: '◉',  color: GOLD,      minAge: 0,
    desc: 'Las amistades se construyen con tiempo y presencia' },
  { key: 'salud',    label: 'DEPORTE',   icon: '✚',  color: '#ff7f50', minAge: 0,
    desc: 'El cuerpo y la mente se fortalecen juntos' },
  { key: 'ocio',     label: 'OCIO',      icon: '♪',  color: '#9b6bff', minAge: 0,
    desc: 'Descansar también es necesario' },
  { key: 'trabajo',  label: 'TRABAJO',   icon: '💼', color: '#ffb84a', minAge: 16,
    desc: 'Actividad laboral remunerada' },
]

function getDefaultAlloc(_age: number): Alloc {
  return { trabajo: 0, estudios: 0, familia: 0, social: 0, salud: 0, ocio: 0 }
}

interface Props {
  ageYears: number
  onSubmit: (alloc: Alloc) => void
  onCancel?: () => void
  compact?: boolean // true = panel inline, false = modal
}

export default function QuarterAllocation({ ageYears, onSubmit, onCancel, compact = false }: Props) {
  const [alloc, setAlloc] = useState<Alloc>(getDefaultAlloc(ageYears))

  const used      = Object.values(alloc).reduce((a, b) => a + b, 0)
  const remaining = TOTAL - used
  const ready     = remaining === 0

  const visible = ACTIVITIES.filter(a => a.minAge <= ageYears)

  function adjust(key: keyof Alloc, delta: number) {
    setAlloc(prev => {
      const next = prev[key] + delta
      if (next < 0) return prev
      if (delta > 0 && remaining <= 0) return prev
      return { ...prev, [key]: next }
    })
  }

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', height: compact ? '100%' : 'auto', gap: 0 }}>
      {/* Header */}
      <div style={{
        padding: compact ? '0.6rem 1rem' : '1rem 1.5rem',
        borderBottom: `1px solid #1a1510`,
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        background: BG2,
        position: compact ? 'sticky' : 'static', top: 0, zIndex: 1,
      }}>
        <span style={{ fontSize: '0.9rem' }}>⏱</span>
        <span style={{
          fontFamily: 'Cinzel, serif', fontSize: '0.62rem',
          color: '#555', letterSpacing: '0.18em', flex: 1,
        }}>
          TIENES 13 SEMANAS. ¿CÓMO VAS A VIVIRLAS?
        </span>
        <span style={{
          fontFamily: 'Cinzel, serif', fontSize: '0.8rem', fontWeight: 700,
          color: ready ? GOLD : remaining > 0 ? '#ffb84a' : GARNET,
        }}>
          {remaining > 0 ? `${remaining} libres` : ready ? '✓' : `${-remaining} de más`}
        </span>
      </div>

      {/* Actividades */}
      <div style={{ flex: 1, overflowY: 'auto', padding: compact ? '0.4rem 0.5rem' : '0.75rem 1rem' }}>
        {visible.map(act => {
          const val = alloc[act.key]
          const canAdd = remaining > 0
          const canSub = val > 0
          return (
            <div key={act.key} style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.5rem 0.6rem',
              borderRadius: 4,
              marginBottom: '0.3rem',
              background: val > 0 ? `${act.color}0d` : '#0a0806',
              border: `1px solid ${val > 0 ? `${act.color}33` : '#1a1510'}`,
              transition: 'background 0.15s, border-color 0.15s',
            }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>{act.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'Cinzel, serif', fontSize: '0.65rem',
                  color: val > 0 ? act.color : '#555', letterSpacing: '0.12em',
                }}>
                  {act.label}
                </div>
                <div style={{ fontSize: '0.55rem', color: '#3a3530', marginTop: 1 }}>
                  {act.desc}
                </div>
              </div>

              {/* Contador */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
                <button
                  onClick={() => adjust(act.key, -1)}
                  disabled={!canSub}
                  style={{
                    width: 22, height: 22, border: `1px solid #2a2420`,
                    background: canSub ? '#1a1510' : 'transparent',
                    color: canSub ? '#888' : '#2a2420',
                    cursor: canSub ? 'pointer' : 'not-allowed',
                    borderRadius: 3, fontSize: '0.75rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >−</button>

                <span style={{
                  fontFamily: 'Cinzel, serif', fontSize: '0.85rem', fontWeight: 700,
                  color: val > 0 ? act.color : '#333',
                  width: 18, textAlign: 'center',
                }}>
                  {val}
                </span>

                <button
                  onClick={() => adjust(act.key, 1)}
                  disabled={!canAdd}
                  style={{
                    width: 22, height: 22, border: `1px solid #2a2420`,
                    background: canAdd ? '#1a1510' : 'transparent',
                    color: canAdd ? '#888' : '#2a2420',
                    cursor: canAdd ? 'pointer' : 'not-allowed',
                    borderRadius: 3, fontSize: '0.75rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >+</button>
              </div>

              {/* Mini barra */}
              <div style={{ width: 32, height: 3, background: '#1a1510', borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
                <div style={{
                  width: `${(val / TOTAL) * 100}%`, height: '100%',
                  background: act.color, borderRadius: 2,
                  transition: 'width 0.2s',
                }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Barra de distribución visual */}
      <div style={{ padding: '0 0.75rem', marginBottom: '0.4rem' }}>
        <div style={{ height: 4, background: '#1a1510', borderRadius: 2, overflow: 'hidden', display: 'flex' }}>
          {visible.filter(a => alloc[a.key] > 0).map(act => (
            <div key={act.key} style={{
              width: `${(alloc[act.key] / TOTAL) * 100}%`,
              background: act.color,
              transition: 'width 0.2s',
            }} />
          ))}
        </div>
      </div>

      {/* Botones */}
      <div style={{
        padding: compact ? '0.5rem 0.75rem' : '0.75rem 1rem',
        display: 'flex', gap: '0.5rem',
        borderTop: `1px solid #1a1510`,
        background: BG2,
      }}>
        {onCancel && (
          <button onClick={onCancel} style={{
            flex: 1, background: 'transparent',
            border: `1px solid #2a2420`, color: '#555',
            fontFamily: 'Cinzel, serif', fontSize: '0.58rem',
            letterSpacing: '0.12em', padding: '0.5rem',
            cursor: 'pointer', borderRadius: 3,
          }}>
            CANCELAR
          </button>
        )}
        <button
          onClick={() => ready && onSubmit(alloc)}
          disabled={!ready}
          style={{
            flex: 2, background: ready ? `${GOLD}18` : 'transparent',
            border: `1px solid ${ready ? GOLD : '#2a2420'}`,
            color: ready ? GOLD : '#333',
            fontFamily: 'Cinzel, serif', fontSize: '0.62rem',
            letterSpacing: '0.14em', padding: '0.6rem',
            cursor: ready ? 'pointer' : 'not-allowed',
            borderRadius: 3,
            transition: 'all 0.15s',
          }}
        >
          {ready ? 'VIVIR ESTE TRIMESTRE ▶' : `TE QUEDAN ${remaining} SEMANA${remaining !== 1 ? 'S' : ''} POR ASIGNAR`}
        </button>
      </div>
    </div>
  )

  if (!compact) {
    // Modal overlay
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: '#0d0b08cc',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
        onClick={(e) => { if (e.target === e.currentTarget) onCancel?.() }}
      >
        <div style={{
          background: BG2,
          border: `1px solid ${GOLD}44`,
          borderRadius: 6,
          width: '100%', maxWidth: 420,
          maxHeight: '85vh',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>
          {content}
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: '100%', background: BG2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {content}
    </div>
  )
}
