import { useTranslation }                from 'react-i18next'
import type { Lifestyle, LifestyleType } from '../systems/lifestyleSystem'
import type { GameState }               from '../types/game.types'
import { colors, fonts, transitions }   from '../styles/tokens'

interface Props {
  gameState:      GameState
  lifestyle:      Lifestyle | null
  allLifestyles:  Lifestyle[]
  canAdvance:     boolean
  hasPending:     boolean
  onSetLifestyle: (type: LifestyleType) => void
  onAdvance:      () => void
}

const ALLOC_KEYS = ['trabajo', 'estudios', 'familia', 'social', 'salud', 'ocio'] as const
type AllocKey = typeof ALLOC_KEYS[number]

function stageKey(age: number): string {
  if (age < 13) return 'game.stages.infancia'
  if (age < 31) return 'game.stages.juventud'
  if (age < 51) return 'game.stages.adulto'
  if (age < 71) return 'game.stages.madurez'
  return 'game.stages.ancianidad'
}

function AllocationBar({ label, value, max = 6 }: { label: string; value: number; max?: number }) {
  const pct = Math.min(1, value / max) * 100
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{
        fontFamily:    fonts.display,
        fontSize:      '0.45rem',
        color:         colors.text.faint,
        width:         48,
        flexShrink:    0,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 8, background: colors.bg.tertiary, borderRadius: 4 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: `${colors.gold}66`, borderRadius: 4 }} />
      </div>
    </div>
  )
}

export function LifestylePanel({
  gameState,
  lifestyle,
  allLifestyles,
  canAdvance,
  hasPending,
  onSetLifestyle,
  onAdvance,
}: Props) {
  const { t }        = useTranslation()
  const isDisabled   = !canAdvance || !lifestyle

  const topAllocs = lifestyle
    ? ALLOC_KEYS
        .map(k => ({ key: k, value: lifestyle.allocation[k] }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 3)
    : []

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: fonts.display }}>

      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${colors.border.default}`, flexShrink: 0 }}>
        <span style={{ fontSize: '0.55rem', letterSpacing: '0.25em', color: colors.text.muted, textTransform: 'uppercase' }}>
          {t('game.lifestyle.title')}
        </span>
      </div>

      {/* Current stage */}
      <div style={{ padding: '8px 20px', borderBottom: `1px solid ${colors.bg.tertiary}`, flexShrink: 0 }}>
        <span style={{ fontSize: '0.6rem', color: colors.text.faint, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          {t(stageKey(gameState.ageYears))} · {gameState.totalQuarters} {t('game.lifestyle.quarters')}
        </span>
      </div>

      {/* Lifestyle list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {allLifestyles.map(ls => {
          const active = lifestyle?.type === ls.type
          return (
            <button
              key={ls.type}
              onClick={() => onSetLifestyle(ls.type)}
              style={{
                width:        '100%',
                textAlign:    'left',
                padding:      '14px 20px',
                background:   active ? `${colors.gold}0f` : 'transparent',
                borderTop:    'none',
                borderRight:  'none',
                borderBottom: 'none',
                borderLeft:   active ? `3px solid ${colors.gold}` : '3px solid transparent',
                cursor:       'pointer',
                transition:   `all ${transitions.fast}`,
              }}
              onMouseEnter={e => {
                if (!active) {
                  const btn = e.currentTarget as HTMLButtonElement
                  btn.style.background = colors.bg.tertiary
                  btn.style.borderLeft = `3px solid ${colors.border.warm}`
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  const btn = e.currentTarget as HTMLButtonElement
                  btn.style.background = 'transparent'
                  btn.style.borderLeft = '3px solid transparent'
                }
              }}
            >
              <span style={{
                display:       'block',
                fontFamily:    fonts.display,
                fontSize:      '0.7rem',
                color:         active ? colors.gold : colors.text.passive,
                fontWeight:    active ? 600 : 400,
                letterSpacing: '0.1em',
              }}>
                {ls.label}
              </span>
              <span style={{
                display:    'block',
                fontFamily: fonts.body,
                fontStyle:  'italic',
                fontSize:   '0.6rem',
                color:      active ? colors.text.secondary : colors.text.dim,
                marginTop:  4,
              }}>
                {ls.description}
              </span>
            </button>
          )
        })}

        {/* Top 3 allocation bars */}
        {lifestyle && topAllocs.length > 0 && (
          <div style={{
            padding:       '12px 20px',
            borderTop:     `1px solid ${colors.bg.tertiary}`,
            borderBottom:  `1px solid ${colors.bg.tertiary}`,
            display:       'flex',
            flexDirection: 'column',
            gap:           8,
          }}>
            {topAllocs.map(({ key, value }) => (
              <AllocationBar key={key} label={t(`game.lifestyle.alloc.${key as AllocKey}`)} value={value} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom: hint + advance button */}
      <div style={{ flexShrink: 0 }}>
        {hasPending && (
          <div style={{ padding: '8px 20px', textAlign: 'center' }}>
            <span style={{
              fontFamily:    fonts.display,
              fontSize:      '0.55rem',
              letterSpacing: '0.15em',
              color:         colors.text.secondary,
              opacity:       0.8,
              textTransform: 'uppercase',
            }}>
              {t('game.lifestyle.decide')}
            </span>
          </div>
        )}
        {!hasPending && !lifestyle && (
          <div style={{ padding: '8px 20px', textAlign: 'center' }}>
            <span style={{
              fontFamily:    fonts.display,
              fontSize:      '0.55rem',
              letterSpacing: '0.1em',
              color:         colors.text.muted,
              textTransform: 'uppercase',
            }}>
              {t('game.lifestyle.choose')}
            </span>
          </div>
        )}
        <button
          onClick={isDisabled ? undefined : onAdvance}
          disabled={isDisabled}
          style={{
            width:         '100%',
            padding:       16,
            fontFamily:    fonts.display,
            fontSize:      '0.7rem',
            letterSpacing: '0.25em',
            fontWeight:    700,
            textTransform: 'uppercase',
            border:        isDisabled ? `1px solid ${colors.border.warm}` : 'none',
            cursor:        isDisabled ? 'not-allowed' : 'pointer',
            background:    isDisabled ? colors.bg.disabled : colors.gold,
            color:         isDisabled ? colors.text.muted : colors.bg.primary,
            opacity:       isDisabled ? 0.45 : 1,
            minHeight:     44,
            transition:    `background ${transitions.fast}`,
          }}
          onMouseEnter={e => {
            if (!isDisabled) (e.currentTarget as HTMLButtonElement).style.background = '#d4b05a'
          }}
          onMouseLeave={e => {
            if (!isDisabled) (e.currentTarget as HTMLButtonElement).style.background = colors.gold
          }}
        >
          {t('game.lifestyle.advance')}
        </button>
      </div>
    </div>
  )
}
