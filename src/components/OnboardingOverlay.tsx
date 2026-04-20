import { useTranslation } from 'react-i18next'
import { colors, fonts }  from '../styles/tokens'

interface Props { onDone: () => void }

// Arrow pointing right in SVG space; rotated by parent wrapper to face target UI.
function PulseArrow({ deg }: { deg: number }) {
  return (
    <div style={{
      display:        'flex',
      justifyContent: 'center',
      marginBottom:   20,
      transform:      `rotate(${deg}deg)`,
    }}>
      <svg
        width="38" height="38" viewBox="0 0 38 38"
        style={{ animation: 'ob-pulse 1.5s ease-in-out infinite' }}
        aria-hidden="true"
      >
        <path
          d="M6 19 L28 19 M21 11 L29 19 L21 27"
          stroke={colors.gold}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

// Only shown for step 2 — pointing toward the VIVIR button (bottom-left).
// Step 1 is now handled by the expanded LifestylePanel on first visit.
export function OnboardingOverlay({ onDone }: Props) {
  const { t } = useTranslation()

  return (
    <div
      style={{
        position:       'fixed',
        inset:          0,
        zIndex:         200,
        background:     'rgba(13, 11, 8, 0.85)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        pointerEvents:  'all',
      }}
    >
      <style>{`
        @keyframes ob-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(1.3); }
        }
      `}</style>

      <div style={{
        maxWidth:   290,
        width:      '85vw',
        padding:    '32px 28px',
        background: colors.bg.secondary,
        border:     `1px solid ${colors.border.warm}`,
        textAlign:  'center',
      }}>
        {/* Arrow points down-left toward the VIVIR button */}
        <PulseArrow deg={135} />

        <p style={{
          fontFamily:    fonts.display,
          fontSize:      '1rem',
          letterSpacing: '0.15em',
          fontWeight:    700,
          color:         colors.gold,
          textTransform: 'uppercase',
          margin:        '0 0 12px',
        }}>
          {t('game.onboarding.step2.title')}
        </p>

        <p style={{
          fontFamily: fonts.body,
          fontStyle:  'italic',
          fontSize:   '0.85rem',
          color:      colors.text.narrative,
          lineHeight: 1.6,
          margin:     '0 0 24px',
        }}>
          {t('game.onboarding.step2.sub')}
        </p>

        <button
          onClick={onDone}
          style={{
            width:         '100%',
            minHeight:     44,
            fontFamily:    fonts.display,
            fontSize:      '0.65rem',
            letterSpacing: '0.2em',
            fontWeight:    700,
            textTransform: 'uppercase',
            background:    colors.gold,
            color:         colors.bg.primary,
            border:        'none',
            cursor:        'pointer',
          }}
        >
          {t('game.onboarding.step2.cta')}
        </button>
      </div>
    </div>
  )
}
