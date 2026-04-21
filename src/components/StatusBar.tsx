import { useTranslation }              from 'react-i18next'
import type { Character, Stats, Economy } from '../types/game.types'
import { colors, fonts }               from '../styles/tokens'

interface Props {
  character: Character
  stats:     Stats
  ageYears:  number
  economy:   Economy
}

function liquidezColor(n: number): string {
  if (n > 500)  return '#5a9c5a'
  if (n >= 0)   return colors.gold
  return '#c44444'
}

function formatLiquidez(n: number): string {
  return Math.abs(n).toLocaleString('es-ES') + '€'
}

type VitalKey = 'fisico' | 'emocional' | 'estabilidad'

const VITAL_STATS: { key: VitalKey; tKey: string }[] = [
  { key: 'fisico',      tKey: 'game.stats.fis' },
  { key: 'emocional',   tKey: 'game.stats.emo' },
  { key: 'estabilidad', tKey: 'game.stats.est' },
]

const VITAL_STAT_COLOR: Record<VitalKey, string> = {
  fisico:      colors.stats.vital,
  emocional:   colors.stats.social,
  estabilidad: colors.stats.vital,
}

function stageKey(age: number): string {
  if (age < 13) return 'game.stages.infancia'
  if (age < 31) return 'game.stages.juventud'
  if (age < 51) return 'game.stages.adulto'
  if (age < 71) return 'game.stages.madurez'
  return 'game.stages.ancianidad'
}

export function StatusBar({ character, stats, ageYears, economy }: Props) {
  const { t } = useTranslation()

  return (
    <header style={{
      position:             'fixed',
      top:                  0,
      left:                 0,
      right:                0,
      zIndex:               50,
      height:               56,
      display:              'flex',
      alignItems:           'center',
      padding:              '0 20px',
      gap:                  20,
      background:           `${colors.bg.primary}ee`,
      backdropFilter:       'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom:         `1px solid ${colors.border.default}`,
    }}>

      {/* Character name — fonts.body para preservar exactamente lo escrito por el jugador */}
      <span style={{
        fontFamily:   fonts.body,
        fontSize:     '0.85rem',
        fontWeight:   600,
        color:        colors.text.narrative,
        whiteSpace:   'nowrap',
        overflow:     'hidden',
        textOverflow: 'ellipsis',
        maxWidth:     160,
      }}>
        {character.name}
      </span>

      <div style={{ width: 1, height: 20, background: colors.border.default, flexShrink: 0 }} />

      {/* Age */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, flexShrink: 0 }}>
        <span style={{ fontFamily: fonts.display, fontSize: '1.1rem', fontWeight: 700, color: colors.gold }}>
          {ageYears}
        </span>
        <span style={{ fontFamily: fonts.display, fontSize: '0.45rem', color: colors.text.muted, letterSpacing: '0.2em', marginLeft: 3 }}>
          {t('game.status.years')}
        </span>
      </div>

      {/* Life stage */}
      <span style={{
        fontFamily:    fonts.display,
        fontSize:      '0.55rem',
        color:         colors.text.muted,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        whiteSpace:    'nowrap',
      }}>
        {t(stageKey(ageYears))}
      </span>

      <div className="hidden sm:block" style={{ width: 1, height: 20, background: colors.border.default, flexShrink: 0 }} />

      {/* Economy: liquidez indicator — hidden until the character has real income */}
      {(economy.liquidez !== 0 || economy.ingresosMensual !== 0) && (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, flexShrink: 0 }}>
          <span style={{
            fontFamily:    fonts.display,
            fontSize:      '0.5rem',
            color:         liquidezColor(economy.liquidez),
            letterSpacing: '0.05em',
            fontWeight:    700,
            lineHeight:    1,
          }}>
            {economy.liquidez < 0 ? '−' : ''}€
          </span>
          <span style={{
            fontFamily:    fonts.display,
            fontSize:      '0.72rem',
            fontWeight:    700,
            color:         liquidezColor(economy.liquidez),
            letterSpacing: '0.02em',
            lineHeight:    1,
          }}>
            {formatLiquidez(economy.liquidez)}
          </span>
        </div>
      )}

      <div className="hidden sm:block" style={{ width: 1, height: 20, background: colors.border.default, flexShrink: 0 }} />

      {/* Vital stat bars — always pushed to the right */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginLeft: 'auto' }}>
        {VITAL_STATS.map(({ key, tKey }) => {
          const value = stats[key]
          return (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
              <span style={{ fontFamily: fonts.display, fontSize: '0.45rem', color: colors.text.muted, letterSpacing: '0.05em' }}>
                {t(tKey)}
              </span>
              <div style={{ width: 60, height: 8, background: colors.border.default, borderRadius: 4 }}>
                <div style={{
                  height:       '100%',
                  width:        `${(value / 10) * 100}%`,
                  background:   VITAL_STAT_COLOR[key],
                  borderRadius: 4,
                  transition:   'width 0.4s ease',
                }} />
              </div>
            </div>
          )
        })}
      </div>
    </header>
  )
}
