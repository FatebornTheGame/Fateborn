import { useState } from 'react'
import { playMusic, stopMusic, getCurrentSrc } from '../utils/audio'

export function MuteButton() {
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
      title={isMuted ? 'Activar música' : 'Silenciar música'}
      style={{
        position:     'fixed',
        bottom:       60,
        right:        20,
        zIndex:       100,
        width:        36,
        height:       36,
        borderRadius: '50%',
        background:   '#141210',
        border:       '1px solid #2a2620',
        cursor:       'pointer',
        transition:   'all 0.2s',
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'center',
        padding:      0,
      }}
      onMouseEnter={e => {
        const btn = e.currentTarget as HTMLButtonElement
        btn.style.border     = '1px solid #C9A84C'
        btn.style.background = '#1c1915'
        const icon = btn.firstElementChild as HTMLElement | null
        if (icon) icon.style.color = '#C9A84C'
      }}
      onMouseLeave={e => {
        const btn = e.currentTarget as HTMLButtonElement
        btn.style.border     = '1px solid #2a2620'
        btn.style.background = '#141210'
        const icon = btn.firstElementChild as HTMLElement | null
        if (icon) icon.style.color = '#6b6045'
      }}
    >
      <span style={{ fontSize: 14, color: '#6b6045', lineHeight: 1, userSelect: 'none', transition: 'color 0.2s' }}>
        {isMuted ? '🔇' : '🔊'}
      </span>
    </button>
  )
}
