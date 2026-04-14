import { useState }                           from 'react'
import { useTranslation }                     from 'react-i18next'
import { playMusic, stopMusic, getCurrentSrc } from '../utils/audio'
import { colors, transitions }                from '../styles/tokens'

export function MuteButton() {
  const { t }      = useTranslation()
  const [isMuted, setIsMuted] = useState(false)

  function handleClick() {
    if (isMuted) {
      const src = getCurrentSrc()
      if (src) playMusic(src)
      setIsMuted(false)
    } else {
      stopMusic()
      setIsMuted(true)
    }
  }

  return (
    <button
      onClick={handleClick}
      title={isMuted ? t('mute.unmute') : t('mute.mute')}
      style={{
        position:       'fixed',
        bottom:         60,
        right:          20,
        zIndex:         100,
        width:          36,
        height:         36,
        borderRadius:   '50%',
        background:     colors.bg.secondary,
        border:         `1px solid ${colors.border.default}`,
        cursor:         'pointer',
        transition:     transitions.fast,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        0,
      }}
      onMouseEnter={e => {
        const btn = e.currentTarget as HTMLButtonElement
        btn.style.border     = `1px solid ${colors.gold}`
        btn.style.background = colors.bg.tertiary
        const icon = btn.firstElementChild as HTMLElement | null
        if (icon) icon.style.color = colors.gold
      }}
      onMouseLeave={e => {
        const btn = e.currentTarget as HTMLButtonElement
        btn.style.border     = `1px solid ${colors.border.default}`
        btn.style.background = colors.bg.secondary
        const icon = btn.firstElementChild as HTMLElement | null
        if (icon) icon.style.color = colors.text.muted
      }}
    >
      <span style={{ fontSize: 14, color: colors.text.muted, lineHeight: 1, userSelect: 'none', transition: `color ${transitions.fast}` }}>
        {isMuted ? '🔇' : '🔊'}
      </span>
    </button>
  )
}
