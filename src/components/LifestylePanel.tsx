import { useState }                        from 'react'
import { useTranslation }                from 'react-i18next'
import type { Lifestyle, LifestyleType } from '../systems/lifestyleSystem'
import type { GameState }               from '../types/game.types'
import { colors, fonts, transitions }   from '../styles/tokens'

interface Props {
  gameState:        GameState
  lifestyle:        Lifestyle | null
  allLifestyles:    Lifestyle[]
  canStartLiving:   boolean
  isLiving:         boolean
  hasPending:       boolean
  isFirstVisit?:    boolean
  onSetLifestyle:   (type: LifestyleType) => void
  onStartLiving:    () => void
}

const ALLOC_KEYS = ['trabajo', 'estudios', 'familia', 'social', 'salud', 'ocio'] as const
type AllocKey = typeof ALLOC_KEYS[number]

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
  canStartLiving,
  isLiving,
  hasPending,
  isFirstVisit,
  onSetLifestyle,
  onStartLiving,
}: Props) {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded]   = useState(isFirstVisit ?? false)
  const [pendingType, setPendingType] = useState<LifestyleType | null>(null)

  const isDisabled = !canStartLiving

  const topAllocs = lifestyle
    ? ALLOC_KEYS
        .map(k => ({ key: k, value: lifestyle.allocation[k] }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 3)
    : []

  function handleExpand() {
    setPendingType(lifestyle?.type ?? null)
    setIsExpanded(true)
  }

  function handleConfirm() {
    if (pendingType) onSetLifestyle(pendingType)
    setIsExpanded(false)
  }

  function handleStartLiving() {
    setIsExpanded(false)
    onStartLiving()
  }

  // ── EXPANDED ────────────────────────────────────────────────────────────────
  if (isExpanded) {
    return (
      <div style={{
        fontFamily:    fonts.display,
        display:       'flex',
        flexDirection: 'column',
        height:        '100%',
        ...(isFirstVisit ? { animation: 'lp-first-pulse 1.5s ease-in-out infinite' } : {}),
      }}>
        {isFirstVisit && (
          <style>{`
            @keyframes lp-first-pulse {
              0%, 100% { box-shadow: 0 0 0 2px rgba(201,168,76,0.25); }
              50%       { box-shadow: 0 0 0 2px rgba(201,168,76,0.9); }
            }
          `}</style>
        )}

        {/* Scrollable area: header + list + bars */}
        <div style={{ flex: 1, overflowY: 'auto' }}>

        {/* First-visit header */}
        {isFirstVisit && (
          <div style={{
            padding:      '14px 20px 12px',
            textAlign:    'center',
            borderBottom: `1px solid ${colors.bg.tertiary}`,
          }}>
            <p style={{
              fontFamily:    fonts.display,
              fontSize:      '0.65rem',
              letterSpacing: '0.2em',
              fontWeight:    700,
              color:         colors.gold,
              textTransform: 'uppercase',
              margin:        0,
            }}>
              {t('game.lifestyle.firstTitle')}
            </p>
            <p style={{
              fontFamily: fonts.body,
              fontStyle:  'italic',
              fontSize:   '0.72rem',
              color:      colors.text.narrative,
              margin:     '5px 0 0',
            }}>
              {t('game.lifestyle.firstSub')}
            </p>
          </div>
        )}

        {allLifestyles.map(ls => {
          const selected = (pendingType ?? lifestyle?.type) === ls.type
          return (
            <button
              key={ls.type}
              onClick={() => setPendingType(ls.type)}
              style={{
                width:        '100%',
                textAlign:    'left',
                padding:      '14px 20px',
                background:   selected ? `${colors.gold}0f` : 'transparent',
                borderTop:    'none',
                borderRight:  'none',
                borderBottom: 'none',
                borderLeft:   selected ? `3px solid ${colors.gold}` : '3px solid transparent',
                cursor:       'pointer',
                transition:   `all ${transitions.fast}`,
              }}
              onMouseEnter={e => {
                if (!selected) {
                  const btn = e.currentTarget as HTMLButtonElement
                  btn.style.background  = colors.bg.tertiary
                  btn.style.borderLeft  = `3px solid ${colors.border.warm}`
                }
              }}
              onMouseLeave={e => {
                if (!selected) {
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
                color:         selected ? colors.gold : colors.text.passive,
                fontWeight:    selected ? 600 : 400,
                letterSpacing: '0.1em',
              }}>
                {ls.label}
              </span>
              <span style={{
                display:    'block',
                fontFamily: fonts.body,
                fontStyle:  'italic',
                fontSize:   '0.6rem',
                color:      selected ? colors.text.secondary : colors.text.dim,
                marginTop:  4,
              }}>
                {ls.description}
              </span>
            </button>
          )
        })}

        {/* Allocation bars for pending selection */}
        {pendingType && (() => {
          const pending = allLifestyles.find(ls => ls.type === pendingType)
          const bars = pending
            ? ALLOC_KEYS
                .map(k => ({ key: k, value: pending.allocation[k] }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 3)
            : []
          return bars.length > 0 ? (
            <div style={{
              padding:       '10px 20px',
              borderTop:     `1px solid ${colors.bg.tertiary}`,
              display:       'flex',
              flexDirection: 'column',
              gap:           7,
            }}>
              {bars.map(({ key, value }) => (
                <AllocationBar key={key} label={t(`game.lifestyle.alloc.${key as AllocKey}`)} value={value} />
              ))}
            </div>
          ) : null
        })()}

        </div>{/* end scrollable area */}

        <button
          onClick={pendingType ? handleConfirm : undefined}
          disabled={!pendingType}
          style={{
            width:         '100%',
            height:        isFirstVisit ? 52 : undefined,
            padding:       isFirstVisit ? 0 : 14,
            fontFamily:    fonts.display,
            fontSize:      isFirstVisit ? '0.6rem' : '0.65rem',
            letterSpacing: '0.25em',
            fontWeight:    700,
            textTransform: 'uppercase',
            border:        'none',
            cursor:        pendingType ? 'pointer' : 'not-allowed',
            background:    pendingType ? colors.gold : colors.bg.disabled,
            color:         pendingType ? colors.bg.primary : colors.text.muted,
            opacity:       pendingType ? 1 : 0.45,
            minHeight:     44,
            transition:    `background ${transitions.fast}`,
          }}
          onMouseEnter={e => {
            if (pendingType) (e.currentTarget as HTMLButtonElement).style.background = '#d4b05a'
          }}
          onMouseLeave={e => {
            if (pendingType) (e.currentTarget as HTMLButtonElement).style.background = colors.gold
          }}
        >
          {isFirstVisit ? t('game.lifestyle.confirmFirst') : t('game.lifestyle.confirm')}
        </button>
      </div>
    )
  }

  // ── COLLAPSED (default) ──────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: fonts.display }}>

      {/* Active lifestyle chip row */}
      <div style={{
        display:      'flex',
        alignItems:   'center',
        gap:          10,
        padding:      '0 16px',
        height:       48,
        borderBottom: `1px solid ${colors.border.default}`,
      }}>
        <span style={{
          fontFamily:    fonts.display,
          fontSize:      '0.6rem',
          letterSpacing: '0.1em',
          color:         colors.gold,
          fontWeight:    600,
          textTransform: 'uppercase',
          whiteSpace:    'nowrap',
        }}>
          {lifestyle?.label ?? '—'}
        </span>

        <span style={{ color: colors.border.default, flexShrink: 0 }}>·</span>

        {/* Top 3 alloc abbreviations + values */}
        <div style={{ display: 'flex', gap: 8, flex: 1, overflow: 'hidden' }}>
          {topAllocs.map(({ key, value }) => {
            const abbr = t(`game.lifestyle.alloc.${key as AllocKey}`).substring(0, 3).toUpperCase()
            return (
              <span key={key} style={{
                fontFamily:    fonts.display,
                fontSize:      '0.42rem',
                letterSpacing: '0.05em',
                color:         colors.text.muted,
                textTransform: 'uppercase',
                whiteSpace:    'nowrap',
              }}>
                {abbr}<span style={{ color: colors.text.secondary, marginLeft: 2 }}>{value}</span>
              </span>
            )
          })}
        </div>

        {/* CAMBIAR button */}
        <button
          onClick={handleExpand}
          style={{
            fontFamily:    fonts.display,
            fontSize:      '0.42rem',
            letterSpacing: '0.12em',
            color:         colors.text.muted,
            textTransform: 'uppercase',
            background:    'transparent',
            border:        `1px solid ${colors.border.default}`,
            padding:       '3px 8px',
            cursor:        'pointer',
            whiteSpace:    'nowrap',
            flexShrink:    0,
            transition:    `all ${transitions.fast}`,
          }}
          onMouseEnter={e => {
            const btn = e.currentTarget as HTMLButtonElement
            btn.style.color        = colors.gold
            btn.style.borderColor  = `${colors.gold}66`
          }}
          onMouseLeave={e => {
            const btn = e.currentTarget as HTMLButtonElement
            btn.style.color       = colors.text.muted
            btn.style.borderColor = colors.border.default
          }}
        >
          {t('game.lifestyle.change')}
        </button>
      </div>

      {/* Pending decision hint */}
      {hasPending && (
        <div style={{ padding: '6px 16px', textAlign: 'center' }}>
          <span style={{
            fontFamily:    fonts.display,
            fontSize:      '0.5rem',
            letterSpacing: '0.15em',
            color:         colors.text.secondary,
            opacity:       0.8,
            textTransform: 'uppercase',
          }}>
            {t('game.lifestyle.decide')}
          </span>
        </div>
      )}

      {/* No lifestyle chosen hint */}
      {!hasPending && !lifestyle && (
        <div style={{ padding: '6px 16px', textAlign: 'center' }}>
          <span style={{
            fontFamily:    fonts.display,
            fontSize:      '0.5rem',
            letterSpacing: '0.1em',
            color:         colors.text.muted,
            textTransform: 'uppercase',
          }}>
            {t('game.lifestyle.choose')}
          </span>
        </div>
      )}

      {/* VIVIR / VIVIENDO button — hidden when there's a pending event */}
      {!hasPending && (
        <button
          onClick={isDisabled ? undefined : handleStartLiving}
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
          {isLiving ? t('game.lifestyle.living') : t('game.lifestyle.vivir')}
        </button>
      )}
    </div>
  )
}
