import { useEffect, useRef } from 'react'
import { useGameStore, getLifeStage } from '../store/gameStore'
import type { Quarter } from '../systems/timeSystem'
import StatusBar         from '../components/StatusBar'
import InitiativePanel   from '../components/InitiativePanel'
import NarrativeFeed     from '../components/NarrativeFeed'
import LifeTimeline      from '../components/LifeTimeline'
import QuarterAllocation from '../components/QuarterAllocation'
import { useState } from 'react'

const GOLD   = '#C9A84C'
const GARNET = '#8B1A2A'

// ─── Música por etapa vital ────────────────────────────────────────────────────
const STAGE_MUSIC: Record<string, string> = {
  infancia:      '/music/opening.mp3',
  adolescencia:  '/music/young-filmmaker.mp3',
  juventud:      '/music/trails.mp3',
  adultez:       '/music/timelapse.mp3',
  madurez:       '/music/viewpoint.mp3',
  vejez:         '/music/cast-vejez.mp3',
}

// ─── Asignación automática (infancia) ─────────────────────────────────────────
function autoAlloc(): Quarter['allocation'] {
  return { trabajo: 0, estudios: 5, familia: 4, social: 2, salud: 1, ocio: 1 }
}

// ─── Hitos por etapa ──────────────────────────────────────────────────────────
interface Milestone { age: number; label: string; evId: string }

const INFANCIA_MILESTONES: Milestone[] = [
  { age: 6,  label: '1er amigo', evId: 'first_friend'      },
  { age: 8,  label: 'hobby',     evId: 'hobby_discovery'   },
  { age: 10, label: 'conflicto', evId: 'school_conflict'   },
  { age: 12, label: 'talento',   evId: 'talent_discovered' },
]
const ADOLESCENCIA_MILESTONES: Milestone[] = [
  { age: 13, label: 'primer amor',   evId: 'first_love'           },
  { age: 14, label: 'academia',      evId: 'academic_path'        },
  { age: 16, label: '1er trabajo',   evId: 'first_job_idea'       },
  { age: 18, label: 'mayoría edad',  evId: 'adulthood_threshold'  },
]

// Edades de todos los eventos fijos
const FIXED_EVENT_AGES = [6, 8, 10, 11, 12, 13, 14, 16, 17, 18]

function getNextEventAge(currentAge: number): number | null {
  return FIXED_EVENT_AGES.find(a => a > currentAge) ?? null
}

/** Quarters to process before the next event arrives (leaves 4 quarters buffer) */
function getSkipQuarters(currentAge: number): number {
  const next = getNextEventAge(currentAge)
  if (!next) return 0
  return Math.max(0, (next - currentAge) * 4 - 4)
}

export default function GameScreen() {
  const character      = useGameStore(s => s.character)
  const ageYears       = useGameStore(s => s.ageYears)
  const isMuted        = useGameStore(s => s.isMuted)
  const initGame       = useGameStore(s => s.initGame)
  const gameInit       = useGameStore(s => s.gameInitialized)
  const processQuarter = useGameStore(s => s.processQuarter)
  const charFlags      = character?.flags ?? {}

  const stage = getLifeStage(ageYears)

  const [showAllocModal, setShowAllocModal] = useState(false)
  const [mobileTab,      setMobileTab]      = useState<'left' | 'feed'>('feed')

  const audioRef        = useRef<HTMLAudioElement>(null)
  const currentStageRef = useRef<string>('')

  // ── Inicializar partida ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!gameInit && character) initGame()
  }, [character, gameInit, initGame])

  // ── Música reactiva ──────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const s = getLifeStage(ageYears)
    if (currentStageRef.current === s) return
    currentStageRef.current = s
    const track = STAGE_MUSIC[s]
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

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = isMuted ? 0 : 0.7
  }, [isMuted])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.src = STAGE_MUSIC[getLifeStage(ageYears)]
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

  // ── Fase de vida ─────────────────────────────────────────────────────────────
  const isInfancia     = stage === 'infancia'
  const isAdolescencia = stage === 'adolescencia'
  const isAdult        = !isInfancia && !isAdolescencia

  // ── Stage progress bar data ───────────────────────────────────────────────────
  const showStageBar  = isInfancia || isAdolescencia
  const stageMin      = isInfancia ? 0 : 13
  const stageMax      = isInfancia ? 12 : 18
  const stageName     = isInfancia ? 'INFANCIA' : 'ADOLESCENCIA'
  const stageProgress = Math.min(1, (ageYears - stageMin) / Math.max(1, stageMax - stageMin))
  const milestones    = isInfancia ? INFANCIA_MILESTONES : ADOLESCENCIA_MILESTONES
  const BODY_TOP      = showStageBar ? 88 : 60

  // ── Skip logic (infancia only) ────────────────────────────────────────────────
  const skipQuarters  = isInfancia ? getSkipQuarters(ageYears) : 0
  const canSkip       = skipQuarters > 2
  const nextEvAge     = getNextEventAge(ageYears)

  function handleSkip() {
    const n = skipQuarters
    for (let i = 0; i < n; i++) {
      processQuarter(autoAlloc())
    }
  }

  function handleAllocSubmit(alloc: Quarter['allocation']) {
    setShowAllocModal(false)
    processQuarter(alloc)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d0b08',
      color: '#d4c5a0',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <audio ref={audioRef} loop />

      <style>{`
        .game-body {
          display: grid;
          position: fixed;
          bottom: 64px; left: 0; right: 0;
          overflow: hidden;
        }
        .game-body.two-col { grid-template-columns: 55% 45%; }
        .game-body.one-col  { grid-template-columns: 1fr; }
        .game-left  { overflow: hidden; border-right: 1px solid #1a1510; }
        .game-right { overflow: hidden; }
        .mobile-tabs { display: none; }

        @media (max-width: 640px) {
          .game-body { grid-template-columns: 1fr !important; bottom: 104px; }
          .game-left  { display: none; }
          .game-right { display: none; }
          .game-left.tab-active  { display: block; }
          .game-right.tab-active { display: block; }
          .mobile-tabs {
            display: flex;
            position: fixed; bottom: 64px; left: 0; right: 0;
            height: 40px; background: #0d0b08;
            border-top: 1px solid #1a1510; z-index: 99;
          }
          .mobile-tab-btn {
            flex: 1; background: transparent; border: none;
            color: #555; font-size: 0.65rem;
            font-family: Cinzel, serif; letter-spacing: 0.12em;
            cursor: pointer; transition: color 0.15s;
          }
          .mobile-tab-btn.active { color: ${GOLD}; border-bottom: 2px solid ${GOLD}; }
        }
      `}</style>

      {/* ── StatusBar ───────────────────────────────────────────────────────── */}
      <StatusBar />

      {/* ── Barra de progreso de etapa (infancia / adolescencia) ────────────── */}
      {showStageBar && (
        <div style={{
          position: 'fixed', top: 60, left: 0, right: 0, height: 28,
          background: '#0a0806', borderBottom: '1px solid #1a1510',
          zIndex: 90, display: 'flex', alignItems: 'center',
          padding: '0 1rem', gap: '0.75rem',
        }}>
          <span style={{
            fontFamily: 'Cinzel, serif', fontSize: '0.48rem',
            color: '#555', letterSpacing: '0.16em', flexShrink: 0,
          }}>
            {stageName}
          </span>

          {/* Barra con hitos */}
          <div style={{ flex: 1, position: 'relative', height: 3, background: '#1a1510', borderRadius: 2 }}>
            {/* Relleno */}
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: `${stageProgress * 100}%`,
              background: `linear-gradient(90deg, ${GOLD}66, ${GOLD})`,
              borderRadius: 2, transition: 'width 0.6s ease',
            }} />
            {/* Marcadores */}
            {milestones.map(m => {
              const pct    = (m.age - stageMin) / (stageMax - stageMin) * 100
              const fired  = charFlags[`ev_${m.evId}`] === true
              return (
                <div key={m.evId} title={m.label} style={{
                  position: 'absolute', top: '50%', left: `${pct}%`,
                  transform: 'translate(-50%, -50%)',
                }}>
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: fired ? GOLD : '#0a0806',
                    border: `1.5px solid ${fired ? GOLD : '#3a3530'}`,
                    transition: 'background 0.4s, border-color 0.4s',
                    boxShadow: fired ? `0 0 6px ${GOLD}88` : 'none',
                  }} />
                </div>
              )
            })}
          </div>

          <span style={{
            fontFamily: 'Cinzel, serif', fontSize: '0.52rem',
            color: '#666', flexShrink: 0,
          }}>
            {ageYears} / {stageMax}
          </span>
        </div>
      )}

      {/* ══════════════════ INFANCIA (0-12) ══════════════════════════════════ */}
      {isInfancia && (
        <div className="game-body one-col" style={{ top: BODY_TOP }}>
          <div className="game-right tab-active" style={{ position: 'relative' }}>
            <NarrativeFeed />

            {/* Botón principal o bloque de salto */}
            <div style={{
              position: 'absolute', bottom: '1rem', right: '1rem',
              zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem',
            }}>
              {canSkip && nextEvAge !== null && (
                <div style={{
                  background: '#0f0d0a',
                  border: `1px solid ${GARNET}55`,
                  borderRadius: 5,
                  padding: '0.65rem 0.85rem',
                  maxWidth: 260,
                  boxShadow: '0 2px 16px #000c',
                  marginBottom: '0.15rem',
                }}>
                  <p style={{
                    fontFamily: 'Cinzel, serif', fontSize: '0.58rem',
                    color: '#a09080', lineHeight: 1.6, margin: 0,
                    letterSpacing: '0.04em',
                  }}>
                    {character.name} crece. Los años pasan entre juegos,
                    el colegio y la familia.
                  </p>
                  <p style={{
                    fontFamily: 'Cinzel, serif', fontSize: '0.52rem',
                    color: '#555', margin: '0.3rem 0 0', letterSpacing: '0.1em',
                  }}>
                    {ageYears} años → {nextEvAge - 1} años
                  </p>
                  <button
                    onClick={handleSkip}
                    style={{
                      marginTop: '0.5rem',
                      background: `${GOLD}12`,
                      border: `1px solid ${GOLD}55`,
                      color: GOLD,
                      fontFamily: 'Cinzel, serif',
                      fontSize: '0.55rem',
                      letterSpacing: '0.1em',
                      padding: '0.35rem 0.7rem',
                      borderRadius: 3,
                      cursor: 'pointer',
                      width: '100%',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${GOLD}22` }}
                    onMouseLeave={e => { e.currentTarget.style.background = `${GOLD}12` }}
                  >
                    SALTAR AL PRÓXIMO MOMENTO ▶
                  </button>
                </div>
              )}
              <button
                onClick={() => processQuarter(autoAlloc())}
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
                  boxShadow: '0 2px 12px #000a',
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
          <div className="game-body two-col" style={{ top: BODY_TOP }}>
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
          <div className="game-body two-col" style={{ top: BODY_TOP }}>
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
              📋 INICIATIVA
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

      {/* ── Modal de asignación (adultos 18+) ───────────────────────────────── */}
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
