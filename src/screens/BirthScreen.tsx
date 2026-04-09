import { useMemo, useRef, useEffect, useState } from 'react'
import { useGameStore, computeStats } from '../store/gameStore'
import { ARCHETYPES } from '../data/archetypes'
import StatsRadar from '../components/StatsRadar'
import type { CharacterStats } from '../types/game.types'

// ─── Paleta ───────────────────────────────────────────────────────────────────
const GOLD   = '#C9A84C'
const GARNET = '#8B1A2A'
const BG     = '#0d0b08'
const TEXT   = '#d4c5a0'
const MUTED  = '#555'

// ─── Convierte ArchetypeStat[] → CharacterStats ───────────────────────────────
function archetypeToStats(id: string): CharacterStats {
  const arch = ARCHETYPES.find(a => a.id === id)
  const base: CharacterStats = {
    logica: 5, creatividad: 5, disciplina: 5,
    carisma: 5, emocional: 5, ambicion: 5,
    fisico: 5, riesgo: 5, estabilidad: 5,
  }
  if (!arch) return base
  for (const s of arch.stats) base[s.stat] = s.value
  return base
}

// ─── Líneas narrativas con tiempos de fade-in ────────────────────────────────
interface NarrativeLine {
  text: string
  big?: boolean
  delay: string  // CSS animation-delay
}

export default function BirthScreen() {
  const ancestors      = useGameStore(s => s.ancestors)
  const startNewGame   = useGameStore(s => s.startNewGame)

  const [name,   setName]   = useState('')
  const [gender, setGender] = useState<'hombre' | 'mujer' | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // ── Nombres de los 4 ancestros ─────────────────────────────────────────────
  const getName = (id: string | null) =>
    id ? (ARCHETYPES.find(a => a.id === id)?.name.replace(/^El |^La /, '') ?? '—') : '—'

  const abueloPaterno = getName(ancestors[0])
  const abuelaPaterna = getName(ancestors[1])
  const abueloMaterno = getName(ancestors[2])
  const abuelaMaterna = getName(ancestors[3])

  // ── Stats calculados una sola vez ─────────────────────────────────────────
  const computedStats = useMemo<CharacterStats>(() => {
    const filled = ancestors.filter(Boolean) as string[]
    if (filled.length < 4) return {
      logica: 5, creatividad: 5, disciplina: 5,
      carisma: 5, emocional: 5, ambicion: 5,
      fisico: 5, riesgo: 5, estabilidad: 5,
    }
    return computeStats(ancestors.map(id => archetypeToStats(id!)))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])  // solo al montar — intencional: los stats son fijos al nacer

  // ── Líneas narrativas ─────────────────────────────────────────────────────
  const lines: NarrativeLine[] = [
    { text: `Tu abuelo ${abueloPaterno} y tu abuela ${abuelaPaterna}`, delay: '0s' },
    { text: 'forjaron a tu padre.',                                      delay: '0.5s' },
    { text: `Tu abuelo ${abueloMaterno} y tu abuela ${abuelaMaterna}`,  delay: '1.2s' },
    { text: 'forjaron a tu madre.',                                      delay: '1.7s' },
    { text: 'DE SU SANGRE NACES TÚ.',                                   delay: '2.6s', big: true },
  ]

  const canStart = name.trim().length >= 2 && gender !== null

  // ── Música: fade in de Trails ──────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0
    audio.play().catch(() => {})
    let vol = 0
    const fade = setInterval(() => {
      vol = Math.min(1, vol + 0.04)
      audio.volume = vol
      if (vol >= 1) clearInterval(fade)
    }, 100)
    return () => clearInterval(fade)
  }, [])

  function handleStart() {
    if (!canStart) return
    startNewGame(name.trim(), gender!, computedStats)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: BG,
      color: TEXT,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '3rem 1.25rem 4rem',
      gap: '2.5rem',
    }}>
      <audio ref={audioRef} src="/music/trails.mp3" loop />

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .birth-line {
          opacity: 0;
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .birth-section {
          opacity: 0;
          animation: fadeIn 0.8s ease-out forwards;
        }
        .gender-btn {
          flex: 1;
          min-height: 52px;
          background: transparent;
          font-family: 'Cinzel', serif;
          font-size: 0.85rem;
          letter-spacing: 0.2em;
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .gender-btn:not(.gender-active):hover {
          border-color: ${GOLD}88 !important;
          color: ${GOLD}88 !important;
        }
        .gender-active {
          border-color: ${GOLD} !important;
          color: ${GOLD} !important;
          box-shadow: 0 0 14px ${GOLD}44;
        }
        .btn-start-birth:not(:disabled):hover {
          background: ${GOLD} !important;
          color: ${BG} !important;
          box-shadow: 0 0 20px ${GOLD}66;
        }
      `}</style>

      {/* ── Narrativa ───────────────────────────────────────────────────────── */}
      <div style={{
        textAlign: 'center',
        maxWidth: 520,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
      }}>
        {lines.map((line, i) => (
          <p
            key={i}
            className="birth-line"
            style={{
              animationDelay: line.delay,
              margin: 0,
              fontFamily: 'Cinzel, serif',
              letterSpacing: line.big ? '0.18em' : '0.08em',
              lineHeight: 1.7,
              fontSize: line.big
                ? 'clamp(1.1rem, 4vw, 1.5rem)'
                : 'clamp(0.8rem, 2.8vw, 1rem)',
              color: line.big ? GOLD : `${TEXT}cc`,
              marginTop: line.big ? '1rem' : 0,
            }}
          >
            {line.text}
          </p>
        ))}
      </div>

      {/* ── Selector de género ──────────────────────────────────────────────── */}
      <div
        className="birth-section"
        style={{ animationDelay: '3.4s', width: '100%', maxWidth: 380 }}
      >
        <p style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '0.6rem',
          color: MUTED,
          letterSpacing: '0.22em',
          textAlign: 'center',
          margin: '0 0 0.75rem',
        }}>
          GÉNERO
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {(['hombre', 'mujer'] as const).map(g => (
            <button
              key={g}
              className={`gender-btn${gender === g ? ' gender-active' : ''}`}
              onClick={() => setGender(g)}
              style={{
                border: `2px solid ${gender === g ? GOLD : '#3a2e1e'}`,
                color: gender === g ? GOLD : MUTED,
              }}
            >
              {g === 'hombre' ? 'HOMBRE' : 'MUJER'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Campo de nombre ─────────────────────────────────────────────────── */}
      <div
        className="birth-section"
        style={{ animationDelay: '3.7s', width: '100%', maxWidth: 380 }}
      >
        <p style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '0.6rem',
          color: MUTED,
          letterSpacing: '0.22em',
          textAlign: 'center',
          margin: '0 0 0.75rem',
        }}>
          NOMBRE
        </p>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={32}
          placeholder="Escribe tu nombre..."
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            borderBottom: `2px solid ${name.length >= 2 ? GOLD : '#3a2e1e'}`,
            color: TEXT,
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
            textAlign: 'center',
            padding: '0.5rem 0',
            outline: 'none',
            transition: 'border-color 0.3s',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* ── Herencia ancestral + radar ───────────────────────────────────────── */}
      <div
        className="birth-section"
        style={{
          animationDelay: '4s',
          width: '100%',
          maxWidth: 480,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        {/* Separador */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
          <div style={{ flex: 1, height: 1, background: '#2a2420' }} />
          <span style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '0.6rem',
            color: `${GOLD}88`,
            letterSpacing: '0.22em',
            whiteSpace: 'nowrap',
          }}>
            HERENCIA ANCESTRAL
          </span>
          <div style={{ flex: 1, height: 1, background: '#2a2420' }} />
        </div>

        {/* Radar SVG */}
        <StatsRadar stats={computedStats} animDelay={400} />

        {/* Todos los stats en texto bajo el radar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.35rem 1rem',
          width: '100%',
          maxWidth: 360,
        }}>
          {(Object.entries(computedStats) as [keyof CharacterStats, number][]).map(([key, val]) => {
            const color = ['logica','creatividad','disciplina'].includes(key)
              ? '#4a9eff'
              : ['carisma','emocional','ambicion'].includes(key)
              ? GOLD
              : '#4aff8a'
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: color, flexShrink: 0,
                }} />
                <span style={{ fontSize: '0.62rem', color: MUTED, flex: 1 }}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
                <span style={{ fontSize: '0.65rem', color: TEXT, fontWeight: 600 }}>
                  {val.toFixed(1)}
                </span>
              </div>
            )
          })}
        </div>

        {/* Genes ocultos */}
        <div style={{
          width: '100%',
          border: '1px solid #2a2420',
          borderRadius: 4,
          padding: '1rem',
        }}>
          <p style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '0.58rem',
            color: `${GOLD}66`,
            letterSpacing: '0.2em',
            margin: '0 0 0.75rem',
            textAlign: 'center',
          }}>
            PREDISPOSICIONES DETECTADAS
          </p>
          {[
            '✦ talento latente en desarrollo...',
            '✦ predisposición oculta sin revelar...',
            '✦ herencia ancestral sin despertar...',
          ].map((line, i) => (
            <p key={i} style={{
              fontSize: '0.7rem',
              color: TEXT,
              opacity: 0.15,
              margin: i === 0 ? 0 : '0.3rem 0 0',
              fontStyle: 'italic',
              letterSpacing: '0.06em',
            }}>
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* ── Botón COMENZAR ──────────────────────────────────────────────────── */}
      <div
        className="birth-section"
        style={{
          animationDelay: '4.3s',
          width: '100%',
          maxWidth: 380,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.6rem',
        }}
      >
        <button
          className="btn-start-birth"
          disabled={!canStart}
          onClick={handleStart}
          style={{
            width: '100%',
            fontFamily: 'Cinzel, serif',
            fontSize: '1rem',
            letterSpacing: '0.2em',
            padding: '0.9rem 2rem',
            minHeight: 48,
            border: `2px solid ${canStart ? GOLD : '#3a2e1e'}`,
            background: canStart ? `${GOLD}18` : 'transparent',
            color: canStart ? GOLD : '#3a2e1e',
            opacity: canStart ? 1 : 0.4,
            cursor: canStart ? 'pointer' : 'not-allowed',
            borderRadius: 3,
            transition: 'all 0.2s',
          }}
        >
          COMENZAR TU VIDA →
        </button>

        {!canStart && (
          <p style={{ fontSize: '0.65rem', color: MUTED, textAlign: 'center', margin: 0 }}>
            {!gender && name.length < 2
              ? 'Elige un género y escribe tu nombre'
              : !gender
              ? 'Elige un género para continuar'
              : 'Escribe tu nombre (mínimo 2 caracteres)'}
          </p>
        )}
      </div>

      {/* ── Línea de separación inferior ────────────────────────────────────── */}
      <div style={{
        width: '100%', maxWidth: 480,
        display: 'flex', alignItems: 'center', gap: '1rem',
        opacity: 0.3,
      }}>
        <div style={{ flex: 1, height: 1, background: GARNET }} />
        <span style={{ fontSize: '0.5rem', color: GARNET, letterSpacing: '0.3em' }}>FATEBORN</span>
        <div style={{ flex: 1, height: 1, background: GARNET }} />
      </div>
    </div>
  )
}
