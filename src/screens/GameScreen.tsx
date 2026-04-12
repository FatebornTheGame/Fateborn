import { useEffect, useRef, useState } from 'react'
import { useGameStore, getLifeStage } from '../store/gameStore'
import type { Quarter } from '../systems/timeSystem'
import StatusBar         from '../components/StatusBar'
import InitiativePanel   from '../components/InitiativePanel'
import NarrativeFeed     from '../components/NarrativeFeed'
import LifeTimeline      from '../components/LifeTimeline'
import QuarterAllocation from '../components/QuarterAllocation'

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

// ─── Asignación automática para infancia ─────────────────────────────────────
function autoAlloc(age: number): Quarter['allocation'] {
  if (age < 13) return { trabajo: 0, estudios: 5, familia: 4, social: 2, salud: 1, ocio: 1 }
  return          { trabajo: 0, estudios: 5, familia: 2, social: 3, salud: 2, ocio: 1 }
}

export default function GameScreen() {
  const character      = useGameStore(s => s.character)
  const ageYears       = useGameStore(s => s.ageYears)
  const isMuted        = useGameStore(s => s.isMuted)
  const initGame       = useGameStore(s => s.initGame)
  const gameInit       = useGameStore(s => s.gameInitialized)
  const processQuarter = useGameStore(s => s.processQuarter)

  const stage = getLifeStage(ageYears)

  // Modal de asignación (solo para fase adulta 18+)
  const [showAllocModal, setShowAllocModal] = useState(false)
  const [mobileTab, setMobileTab]           = useState<'left' | 'feed'>('feed')
  const audioRef        = useRef<HTMLAudioElement>(null)
  const currentStageRef = useRef<string>('')

  // ── Inicializar partida al entrar ───────────────────────────────────────────
  useEffect(() => {
    if (!gameInit && character) initGame()
  }, [character, gameInit, initGame])

  // ── Música reactiva a la etapa vital ────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const s = getLifeStage(ageYears)
    const track = STAGE_MUSIC[s]
    if (currentStageRef.current === s) return
    currentStageRef.current = s
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

  // ── Mute toggle ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = isMuted ? 0 : 0.7
  }, [isMuted])

  // ── Primer arrange ───────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const s = STAGE_MUSIC[getLifeStage(ageYears)]
    audio.src = s
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

  // ── Handlers de asignación ───────────────────────────────────────────────────
  function handleInfanciaAdvance() {
    processQuarter(autoAlloc(ageYears))
  }

  function handleAllocSubmit(alloc: Quarter['allocation']) {
    setShowAllocModal(false)
    processQuarter(alloc)
  }

  // ── Determinar layout por etapa ──────────────────────────────────────────────
  const isInfancia      = stage === 'infancia'
  const isAdolescencia  = stage === 'adolescencia'
  const isAdult         = !isInfancia && !isAdolescencia  // 18+

  // Etiqueta de pestaña izquierda en móvil
  const leftTabLabel = isAdolescencia ? '📅 TRIMESTRE' : '📋 INICIATIVA'

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
          position: fixed;
          top: 60px;
          bottom: 64px;
          left: 0; right: 0;
          overflow: hidden;
        }
        .game-body.two-col {
          grid-template-columns: 55% 45%;
        }
        .game-body.one-col {
          grid-template-columns: 1fr;
        }
        .game-left  { overflow: hidden; border-right: 1px solid #1a1510; }
        .game-right { overflow: hidden; }

        /* ── Tab bar móvil (oculto en desktop) ── */
        .mobile-tabs { display: none; }

        @media (max-width: 640px) {
          .game-body {
            grid-template-columns: 1fr !important;
            bottom: 104px;
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

      {/* ── StatusBar fija arriba ──────────────────────────────────────────── */}
      <StatusBar />

      {/* ══════════════════ INFANCIA (0-12) ══════════════════════════════════ */}
      {isInfancia && (
        <div className="game-body one-col">
          <div className="game-right tab-active" style={{ position: 'relative' }}>
            <NarrativeFeed />
            {/* Botón flotante AVANZAR TRIMESTRE */}
            <div style={{
              position: 'absolute', bottom: '1rem', right: '1rem',
              zIndex: 20,
            }}>
              <button
                onClick={handleInfanciaAdvance}
                style={{
                  background: '#0f0d0a',
                  border: `1px solid ${GOLD}66`,
                  color: GOLD,
                  fontFamily: 'Cinzel, serif',
                  fontSize: '0.62rem',
                  letterSpacing: '0.12em',
                  padding: '0.55rem 1rem',
                  borderRadius: 4,
                  cursor: 'pointer',
                  transition: 'border-color 0.15s, background 0.15s',
                  boxShadow: `0 2px 12px #000a`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = GOLD
                  e.currentTarget.style.background = `${GOLD}18`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = `${GOLD}66`
                  e.currentTarget.style.background = '#0f0d0a'
                }}
              >
                AVANZAR TRIMESTRE ▶
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ ADOLESCENCIA (13-17) ═════════════════════════════ */}
      {isAdolescencia && (
        <>
          <div className={`game-body two-col`}>
            <div className={`game-left${mobileTab === 'left' ? ' tab-active' : ''}`}>
              <QuarterAllocation
                ageYears={ageYears}
                compact={true}
                onSubmit={(alloc) => processQuarter(alloc)}
              />
            </div>
            <div className={`game-right${mobileTab === 'feed' ? ' tab-active' : ''}`}>
              <NarrativeFeed />
            </div>
          </div>
          <div className="mobile-tabs">
            <button
              className={`mobile-tab-btn${mobileTab === 'left' ? ' active' : ''}`}
              onClick={() => setMobileTab('left')}
            >
              📅 TRIMESTRE
            </button>
            <button
              className={`mobile-tab-btn${mobileTab === 'feed' ? ' active' : ''}`}
              onClick={() => setMobileTab('feed')}
            >
              📖 HISTORIA
            </button>
          </div>
        </>
      )}

      {/* ══════════════════ ADULTO (18+) ═════════════════════════════════════ */}
      {isAdult && (
        <>
          <div className="game-body two-col">
            <div className={`game-left${mobileTab === 'left' ? ' tab-active' : ''}`}>
              <InitiativePanel onRequestQuarter={() => setShowAllocModal(true)} />
            </div>
            <div className={`game-right${mobileTab === 'feed' ? ' tab-active' : ''}`}>
              <NarrativeFeed />
            </div>
          </div>
          <div className="mobile-tabs">
            <button
              className={`mobile-tab-btn${mobileTab === 'left' ? ' active' : ''}`}
              onClick={() => setMobileTab('left')}
            >
              {leftTabLabel}
            </button>
            <button
              className={`mobile-tab-btn${mobileTab === 'feed' ? ' active' : ''}`}
              onClick={() => setMobileTab('feed')}
            >
              📖 HISTORIA
            </button>
          </div>
        </>
      )}

      {/* ── Modal de asignación trimestral (adultos 18+) ────────────────────── */}
      {showAllocModal && (
        <QuarterAllocation
          ageYears={ageYears}
          compact={false}
          onSubmit={handleAllocSubmit}
          onCancel={() => setShowAllocModal(false)}
        />
      )}

      {/* ── LifeTimeline fija abajo ───────────────────────────────────────── */}
      <LifeTimeline />
    </div>
  )
}
