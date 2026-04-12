import { useEffect, useRef, useState } from 'react'
import { useGameStore, getLifeStage } from '../store/gameStore'
import StatusBar    from '../components/StatusBar'
import InitiativePanel from '../components/InitiativePanel'
import NarrativeFeed   from '../components/NarrativeFeed'
import LifeTimeline    from '../components/LifeTimeline'

const GOLD = '#C9A84C'

// ─── Música por etapa vital ────────────────────────────────────────────────────
const STAGE_MUSIC: Record<string, string> = {
  infancia:      '/music/opening.mp3',
  adolescencia:  '/music/young-filmmaker.mp3',
  juventud:      '/music/trails.mp3',
  adultez:       '/music/timelapse.mp3',
  madurez:       '/music/viewpoint.mp3',
  vejez:         '/music/cast-vejez.mp3',
}

export default function GameScreen() {
  const character     = useGameStore(s => s.character)
  const ageYears      = useGameStore(s => s.ageYears)
  const isMuted       = useGameStore(s => s.isMuted)
  const initGame      = useGameStore(s => s.initGame)
  const gameInit      = useGameStore(s => s.gameInitialized)

  const [mobileTab, setMobileTab] = useState<'initiative' | 'feed'>('feed')
  const audioRef = useRef<HTMLAudioElement>(null)
  const currentStageRef = useRef<string>('')

  // ── Inicializar partida al entrar ─────────────────────────────────────────
  useEffect(() => {
    if (!gameInit && character) initGame()
  }, [character, gameInit, initGame])

  // ── Música reactiva a la etapa vital ──────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const stage = getLifeStage(ageYears)
    const track = STAGE_MUSIC[stage]
    if (currentStageRef.current === stage) return
    currentStageRef.current = stage

    // Fade out → change → fade in
    let vol = audio.volume
    const fadeOut = setInterval(() => {
      vol = Math.max(0, vol - 0.08)
      audio.volume = vol
      if (vol <= 0) {
        clearInterval(fadeOut)
        audio.src = track
        audio.play().catch(() => {})
        let v2 = 0
        const fadeIn = setInterval(() => {
          v2 = Math.min(isMuted ? 0 : 0.7, v2 + 0.06)
          audio.volume = v2
          if (v2 >= (isMuted ? 0 : 0.7)) clearInterval(fadeIn)
        }, 80)
      }
    }, 80)
    return () => clearInterval(fadeOut)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ageYears])

  // ── Mute toggle ───────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = isMuted ? 0 : 0.7
  }, [isMuted])

  // ── Primer arrange ────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const stage = STAGE_MUSIC[getLifeStage(ageYears)]
    audio.src = stage
    audio.volume = 0
    audio.play().catch(() => {})
    currentStageRef.current = getLifeStage(ageYears)
    let v = 0
    const fade = setInterval(() => {
      v = Math.min(isMuted ? 0 : 0.7, v + 0.05)
      audio.volume = v
      if (v >= (isMuted ? 0 : 0.7)) clearInterval(fade)
    }, 100)
    return () => clearInterval(fade)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!character) return null

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d0b08',
      color: '#d4c5a0',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <audio ref={audioRef} loop />

      <style>{`
        /* ── Layout desktop ── */
        .game-body {
          display: grid;
          grid-template-columns: 55% 45%;
          position: fixed;
          top: 60px;
          bottom: 64px;
          left: 0; right: 0;
          overflow: hidden;
        }
        .game-left  { overflow: hidden; border-right: 1px solid #1a1510; }
        .game-right { overflow: hidden; }

        /* ── Tab bar móvil (oculto en desktop) ── */
        .mobile-tabs {
          display: none;
        }

        @media (max-width: 640px) {
          .game-body {
            grid-template-columns: 1fr;
            bottom: 104px; /* timeline + tabs */
          }
          .game-left  { display: none; }
          .game-right { display: none; }
          .game-left.tab-active  { display: block; }
          .game-right.tab-active { display: block; }

          .mobile-tabs {
            display: flex;
            position: fixed;
            bottom: 64px;
            left: 0; right: 0;
            height: 40px;
            background: #0d0b08;
            border-top: 1px solid #1a1510;
            z-index: 99;
          }
          .mobile-tab-btn {
            flex: 1;
            background: transparent;
            border: none;
            color: #555;
            font-size: 0.65rem;
            font-family: Cinzel, serif;
            letter-spacing: 0.12em;
            cursor: pointer;
            transition: color 0.15s;
          }
          .mobile-tab-btn.active {
            color: ${GOLD};
            border-bottom: 2px solid ${GOLD};
          }
        }
      `}</style>

      {/* ── StatusBar fija arriba ─────────────────────────────────────────── */}
      <StatusBar />

      {/* ── Cuerpo: dos columnas ──────────────────────────────────────────── */}
      <div className="game-body">
        <div className={`game-left${mobileTab === 'initiative' ? ' tab-active' : ''}`}>
          <InitiativePanel />
        </div>
        <div className={`game-right${mobileTab === 'feed' ? ' tab-active' : ''}`}>
          <NarrativeFeed />
        </div>
      </div>

      {/* ── Tab bar móvil ────────────────────────────────────────────────── */}
      <div className="mobile-tabs">
        <button
          className={`mobile-tab-btn${mobileTab === 'initiative' ? ' active' : ''}`}
          onClick={() => setMobileTab('initiative')}
        >
          📋 INICIATIVA
        </button>
        <button
          className={`mobile-tab-btn${mobileTab === 'feed' ? ' active' : ''}`}
          onClick={() => setMobileTab('feed')}
        >
          📖 HISTORIA
        </button>
      </div>

      {/* ── LifeTimeline fija abajo ───────────────────────────────────────── */}
      <LifeTimeline />

    </div>
  )
}
