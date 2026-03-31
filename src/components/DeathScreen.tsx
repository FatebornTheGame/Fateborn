import { useState, useEffect, useMemo } from 'react';
import { useTrack } from '../hooks/useTrack';
import type { Character, CharacterStats, NarrativeFlags } from '../types';

// ─── Brand colors ──────────────────────────────────────────────────────────────
const GOLD       = '#c9a84c';
const GOLD_LIGHT = '#e8d08a';
const GOLD_DIM   = '#7a5c28';
const GARNET     = '#8b1a2a';

// ─── Score calculation ─────────────────────────────────────────────────────────

function sh(value: string | undefined, map: Record<string, number>): number {
  return value !== undefined ? (map[value] ?? 50) : 50;
}

interface Scores {
  logros: number;
  felicidad: number;
  impacto: number;
  autenticidad: number;
  total: number;
}

function calcScores(flags: NarrativeFlags, stats: CharacterStats): Scores {
  // LOGROS (0-40)
  const logrosStats = ((stats.ambicion + stats.disciplina) / 20) * 100;
  const logrosChoices = (
    sh(flags.encrucijada as string, { universidad: 75, trabajo: 85, aventura: 55 }) +
    sh(flags.oportunidad as string, {
      inversion: 85, liderazgo: 80, carrera: 80, creativo: 75,
      investigacion: 70, deporte: 70, expedicion: 65, social: 60, institucion: 55,
    }) +
    sh(flags.familia as string, { carrera: 80, equilibrio: 65, construir: 45 })
  ) / 3;
  const logros = Math.min(40, Math.round(((logrosStats + logrosChoices) / 2) * 0.40));

  // FELICIDAD (0-30)
  const felicidadStats = ((stats.emocional + stats.estabilidad) / 20) * 100;
  const felicidadChoices = (
    sh(flags.primer_amor as string,  { confesion: 80, amistad: 85, distancia: 50 }) +
    sh(flags.amor_serio as string,   { entrega: 90, despacio: 75, miedo: 35 }) +
    sh(flags.familia as string,      { construir: 90, equilibrio: 80, carrera: 40 }) +
    sh(flags.tiempo_final as string, { gratitud: 90, calma: 85, intensidad: 70 }) +
    sh(flags.ultimo_dia as string,   { personas: 90, paz: 85, solo: 60 })
  ) / 5;
  const felicidad = Math.min(30, Math.round(((felicidadStats + felicidadChoices) / 2) * 0.30));

  // IMPACTO (0-20)
  const impactoStats = ((stats.carisma + stats.emocional) / 20) * 100;
  const impactoChoices = (
    sh(flags.legado as string,        { personas: 90, obra: 85, valores: 80 }) +
    sh(flags.sabiduria as string,     { preguntas: 90, presencia: 85, experiencia: 80 }) +
    sh(flags.reconciliacion as string,{ escuchar: 90, abrir: 85, cerrar: 50 }) +
    sh(flags.oportunidad as string,   {
      social: 90, cuidado: 85, liderazgo: 80, creativo: 70,
      investigacion: 65, carrera: 60, deporte: 60, expedicion: 55, inversion: 50, institucion: 55,
    })
  ) / 4;
  const impacto = Math.min(20, Math.round(((impactoStats + impactoChoices) / 2) * 0.20));

  // AUTENTICIDAD (0-10)
  const autenticidadStats = ((stats.disciplina + stats.estabilidad) / 20) * 100;
  const autenticidadChoices = (
    sh(flags.tentacion as string, { rechazo: 90, fachada: 55, probar: 45 }) +
    sh(flags.balance as string,   { aceptacion: 90, orgullo: 80, deuda: 65 }) +
    sh(flags.perdon as string,    { propio: 90, soltar: 85, otro: 75 }) +
    sh(flags.recuerdos as string, { curiosidad: 85, gratitud: 80, pena: 60 })
  ) / 4;
  const autenticidad = Math.min(10, Math.round(((autenticidadStats + autenticidadChoices) / 2) * 0.10));

  return { logros, felicidad, impacto, autenticidad, total: logros + felicidad + impacto + autenticidad };
}

// ─── Epitafio dinámico ─────────────────────────────────────────────────────────

function generateEpitafio(flags: NarrativeFlags, gender: 'hombre' | 'mujer', name: string): string[] {
  const m = gender === 'hombre';
  const sentences: string[] = [];

  // 1 — Identidad / talento
  const vocacion = flags.vocacion as string;
  const talento  = flags.talento_infancia as string;

  const identityMap: Record<string, string> = {
    ciencias:      `Tuvo una mente que nunca dejó de buscar respuestas, incluso cuando las preguntas se volvían incómodas.`,
    investigacion: `Tuvo una mente que nunca dejó de buscar respuestas, incluso cuando las preguntas se volvían incómodas.`,
    logica:        `Tuvo una mente que nunca dejó de buscar respuestas, incluso cuando las preguntas se volvían incómodas.`,
    arte:          `Dejó en el mundo cosas que no existían antes de que ${m ? 'él' : 'ella'} llegara.`,
    creativo:      `Dejó en el mundo cosas que no existían antes de que ${m ? 'él' : 'ella'} llegara.`,
    creatividad:   `Dejó en el mundo cosas que no existían antes de que ${m ? 'él' : 'ella'} llegara.`,
    estudio:       `Construyó su vida con la misma constancia con la que se construyen las cosas que duran.`,
    disciplina:    `Construyó su vida con la misma constancia con la que se construyen las cosas que duran.`,
    liderazgo:     `Las personas que ${m ? 'lo' : 'la'} conocieron recuerdan cómo hacía que cada una se sintiera vista.`,
    carisma:       `Las personas que ${m ? 'lo' : 'la'} conocieron recuerdan cómo hacía que cada una se sintiera vista.`,
    cuidado:       `Vivió hacia afuera, siempre ${m ? 'atento' : 'atenta'} a lo que los demás no podían decir en voz alta.`,
    social:        `Vivió hacia afuera, siempre ${m ? 'atento' : 'atenta'} a lo que los demás no podían decir en voz alta.`,
    emocional:     `Vivió hacia afuera, siempre ${m ? 'atento' : 'atenta'} a lo que los demás no podían decir en voz alta.`,
    ambicion:      `Quiso siempre más, y eso ${m ? 'lo' : 'la'} llevó más lejos de lo que nadie esperaba.`,
    inversion:     `Quiso siempre más, y eso ${m ? 'lo' : 'la'} llevó más lejos de lo que nadie esperaba.`,
    deporte:       `Encontró en el movimiento una forma de entender el mundo que las palabras no alcanzaban.`,
    fisico:        `Encontró en el movimiento una forma de entender el mundo que las palabras no alcanzaban.`,
    aventura:      `Eligió el camino más difícil cada vez que tuvo opción, y pocas veces lo lamentó.`,
    expedicion:    `Eligió el camino más difícil cada vez que tuvo opción, y pocas veces lo lamentó.`,
    riesgo:        `Eligió el camino más difícil cada vez que tuvo opción, y pocas veces lo lamentó.`,
    seguridad:     `Fue el ancla de todos los que ${m ? 'lo' : 'la'} rodearon, la clase de persona que hace que los demás se sientan seguros.`,
    institucion:   `Fue el ancla de todos los que ${m ? 'lo' : 'la'} rodearon, la clase de persona que hace que los demás se sientan seguros.`,
    estabilidad:   `Fue el ancla de todos los que ${m ? 'lo' : 'la'} rodearon, la clase de persona que hace que los demás se sientan seguros.`,
  };
  const rawIdentity = identityMap[vocacion] ?? identityMap[talento] ??
    `Vivió con la intensidad de quien sabe que el tiempo no es infinito.`;
  sentences.push(name + ' ' + rawIdentity.charAt(0).toLowerCase() + rawIdentity.slice(1));

  // 2 — Amor / Relaciones
  const familia  = flags.familia as string;
  const amorSerio = flags.amor_serio as string;
  if (familia === 'construir') {
    sentences.push(`Eligió el amor familiar como su obra más importante, y lo construyó con paciencia, día a día.`);
  } else if (familia === 'equilibrio') {
    sentences.push(`Intentó dar a cada cosa lo que merecía — al trabajo, al amor, a los suyos — y casi siempre lo consiguió.`);
  } else if (amorSerio === 'entrega') {
    sentences.push(`Cuando amó, lo hizo sin reservas, con esa generosidad que solo tienen los que no temen perder.`);
  } else if (amorSerio === 'miedo') {
    sentences.push(`El amor le costó más de lo que hubiera querido, pero nunca dejó de buscarlo.`);
  } else {
    sentences.push(`Supo querer a las personas que importaban, aunque no siempre encontró las palabras para decirlo.`);
  }

  // 3 — Adversidad / Resiliencia
  const crisis  = flags.crisis as string;
  const perdida = flags.perdida as string;
  if (crisis === 'cambiar') {
    sentences.push(`Cuando la vida se rompió, eligió reconstruir en vez de reparar, y lo que vino después fue más honesto que lo anterior.`);
  } else if (crisis === 'ayuda') {
    sentences.push(`Tuvo la valentía de pedir ayuda cuando la necesitó, que es una de las formas más difíciles de ser valiente.`);
  } else if (perdida === 'hablar') {
    sentences.push(`Aprendió que el dolor compartido pesa la mitad, y que hay gente que merece saber lo que llevas dentro.`);
  } else {
    sentences.push(`No se dobló fácilmente, y cuando lo hizo, encontró la forma de volver a ponerse de pie.`);
  }

  // 4 — Final
  const balance  = flags.balance as string;
  const ultimoDia = flags.ultimo_dia as string;
  const legado   = flags.legado as string;
  const perdon   = flags.perdon as string;
  if (balance === 'aceptacion' && (ultimoDia === 'paz' || ultimoDia === 'calma')) {
    sentences.push(`Murió en paz con lo que fue, que es el mayor lujo que existe y el que menos se puede comprar.`);
  } else if (ultimoDia === 'personas') {
    sentences.push(`Cerró los ojos ${m ? 'rodeado' : 'rodeada'} de las personas que quería, sabiendo que había dejado algo en cada una de ellas.`);
  } else if (perdon === 'propio') {
    sentences.push(`Al final se perdonó a ${m ? 'sí mismo' : 'sí misma'}, y en ese perdón encontró la calma que había buscado durante décadas.`);
  } else if (legado === 'obra') {
    sentences.push(`Dejó algo hecho con sus manos y su mente que existirá cuando todo lo demás haya desaparecido.`);
  } else if (ultimoDia === 'solo') {
    sentences.push(`Eligió despedirse en silencio, fiel a ${m ? 'sí mismo' : 'sí misma'} hasta el último momento.`);
  } else {
    sentences.push(`Vivió hasta el final, que es lo único que se le puede pedir a cualquiera.`);
  }

  return sentences;
}

// ─── Tres decisiones definitivas ──────────────────────────────────────────────

const FLAG_TO_EVENT: Record<string, { title: string; stage: string }> = {
  regalo_infancia:    { title: 'El regalo',          stage: 'Infancia' },
  conflicto_infancia: { title: 'El conflicto',        stage: 'Infancia' },
  talento_infancia:   { title: 'El talento',          stage: 'Infancia' },
  primer_amor:        { title: 'El primer amor',      stage: 'Adolescencia' },
  hogar_adolescencia: { title: 'La decisión',         stage: 'Adolescencia' },
  tentacion:          { title: 'La tentación',        stage: 'Adolescencia' },
  vocacion:           { title: 'El futuro',           stage: 'Adolescencia' },
  encrucijada:        { title: 'La encrucijada',      stage: 'Juventud' },
  amor_serio:         { title: 'El amor serio',       stage: 'Juventud' },
  oportunidad:        { title: 'La oportunidad',      stage: 'Juventud' },
  perdida:            { title: 'La pérdida',          stage: 'Juventud' },
  familia:            { title: 'La familia',          stage: 'Adultez' },
  crisis:             { title: 'La crisis',           stage: 'Adultez' },
  legado:             { title: 'El legado',           stage: 'Adultez' },
  reconciliacion:     { title: 'La reconciliación',   stage: 'Adultez' },
  balance:            { title: 'El balance',          stage: 'Madurez' },
  sabiduria:          { title: 'La sabiduría',        stage: 'Madurez' },
  tiempo_final:       { title: 'El tiempo',           stage: 'Madurez' },
  recuerdos:          { title: 'Los recuerdos',       stage: 'Vejez' },
  perdon:             { title: 'El perdón',           stage: 'Vejez' },
  ultimo_dia:         { title: 'El último día',       stage: 'Vejez' },
};

function getDefiningDecisions(flags: NarrativeFlags) {
  const earlyKeys = ['talento_infancia', 'primer_amor', 'conflicto_infancia', 'tentacion'];
  const midKeys   = ['encrucijada', 'familia', 'amor_serio', 'oportunidad', 'crisis'];
  const lateKeys  = ['legado', 'balance', 'ultimo_dia', 'perdon', 'sabiduria'];
  const pick = (keys: string[]) => keys.find(k => flags[k] !== undefined);
  return [pick(earlyKeys), pick(midKeys), pick(lateKeys)]
    .filter(Boolean)
    .map(k => FLAG_TO_EVENT[k!])
    .filter(Boolean);
}

// ─── Frase final ───────────────────────────────────────────────────────────────

function getFraseFinal(total: number): string {
  if (total >= 85) return 'Pocas vidas merecen ser contadas dos veces. La tuya es una de ellas.';
  if (total >= 70) return 'Viviste con suficiente honestidad como para llamarlo tuyo. Y eso, al final, es todo lo que se puede pedir.';
  if (total >= 55) return 'Hubo momentos de luz y momentos de sombra. Como en cualquier vida que vale la pena.';
  if (total >= 40) return 'No fue fácil, y no siempre fue bonito. Pero llegaste al final con todo lo que eras.';
  return 'Cargaste con más de lo que te tocaba. Y aun así, llegaste hasta el final. Eso cuenta más de lo que crees.';
}

// ─── Diamond helper ────────────────────────────────────────────────────────────

function Diamond({ color }: { color: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill={color} style={{ flexShrink: 0 }}>
      <polygon points="5,0 10,5 5,10 0,5" />
    </svg>
  );
}

// ─── Score bar ─────────────────────────────────────────────────────────────────

function ScoreBar({
  label, weight, value, max, active, delay,
}: {
  label: string; weight: string; value: number; max: number; active: boolean; delay: number;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      <div style={{ width: '130px', flexShrink: 0, textAlign: 'right' }}>
        <span className="cinzel" style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6a5030' }}>
          {label}
        </span>
        <span className="cinzel" style={{ fontSize: '9px', letterSpacing: '0.08em', color: '#3a2a12', marginLeft: '6px' }}>
          {weight}
        </span>
      </div>
      <div style={{
        flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: '99px',
        height: '5px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.03)',
      }}>
        <div style={{
          width: active ? `${(value / max) * 100}%` : '0%',
          height: '100%',
          background: `linear-gradient(90deg, ${GARNET}80, ${GOLD})`,
          borderRadius: '99px',
          boxShadow: `0 0 8px ${GOLD}50`,
          transition: `width 1.4s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        }} />
      </div>
      <span className="cinzel" style={{
        width: '48px', flexShrink: 0, fontSize: '12px',
        color: active ? GOLD : GOLD_DIM,
        transition: `color 0.4s ease ${delay + 1}s`,
        textAlign: 'right',
      }}>
        {value} <span style={{ color: '#3a2a12', fontSize: '10px' }}>/ {max}</span>
      </span>
    </div>
  );
}

// ─── Dynasty modal ─────────────────────────────────────────────────────────────

function DynastyModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(5,3,2,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          padding: '48px 56px',
          borderRadius: '12px',
          border: '1px solid rgba(201,168,76,0.2)',
          background: 'rgba(0,0,0,0.6)',
          textAlign: 'center',
          maxWidth: '440px',
        }}
      >
        <div className="ornament-divider" style={{ marginBottom: '24px' }}>
          <Diamond color={`${GOLD}60`} />
        </div>
        <h2 className="cinzel" style={{
          margin: '0 0 12px',
          fontSize: '20px', fontWeight: 900,
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: GOLD_LIGHT,
        }}>
          Modo Dinastía
        </h2>
        <p className="crimson" style={{
          margin: '0 0 28px',
          fontSize: '15px', lineHeight: 1.7,
          color: '#8a7055', fontStyle: 'italic',
        }}>
          Tu legado persiste. Tu descendiente heredará tus decisiones, tus genes y las huellas de tu historia.
        </p>
        <p className="cinzel" style={{
          margin: '0 0 32px',
          fontSize: '10px', letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(201,168,76,0.3)',
        }}>
          Próximamente
        </p>
        <button
          onClick={onClose}
          style={{
            padding: '10px 32px',
            borderRadius: '6px',
            border: '1px solid rgba(201,168,76,0.25)',
            background: 'transparent',
            color: 'rgba(201,168,76,0.5)',
            fontFamily: "'Cinzel', serif",
            fontSize: '10px', letterSpacing: '0.2em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

// ─── Main screen ───────────────────────────────────────────────────────────────

export default function DeathScreen({
  character,
  onRestart,
}: {
  character: Character;
  onRestart: () => void;
}) {
  useTrack('/music/dark-decision.mp3');
  const [revealed,   setRevealed]   = useState(false);
  const [barsActive, setBarsActive] = useState(false);
  const [showDynasty, setShowDynasty] = useState(false);
  const [showCredits, setShowCredits] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (revealed) {
      const t = setTimeout(() => setBarsActive(true), 1800);
      return () => clearTimeout(t);
    }
  }, [revealed]);

  const scores    = useMemo(() => calcScores(character.flags, character.stats), []);
  const epitafio  = useMemo(() => generateEpitafio(character.flags, character.gender, character.name), []);
  const decisions = useMemo(() => getDefiningDecisions(character.flags), []);
  const fraseFinal = getFraseFinal(scores.total);
  const deathYear  = character.birthYear + 81;

  return (
    <>
    <div
      className="leather-bg"
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '56px 0 80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Entry overlay — fades out */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: '#060402',
        opacity: revealed ? 0 : 1,
        transition: 'opacity 2.2s ease',
        pointerEvents: 'none',
      }} />

      {/* Vignette */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at 50% 40%, transparent 35%, rgba(3,2,1,0.88) 100%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {showDynasty && <DynastyModal onClose={() => setShowDynasty(false)} />}

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '780px',
        padding: '0 40px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        opacity: revealed ? 1 : 0,
        transition: 'opacity 1.5s ease 0.4s',
      }}>

        {/* Logo */}
        <img
          src="/fateborn_title.png"
          alt="FATEBORN"
          style={{
            width: '100%', maxWidth: '300px', height: 'auto',
            marginBottom: '8px', mixBlendMode: 'screen', display: 'block',
            opacity: 0.45,
          }}
        />

        {/* Ornament */}
        <div className="ornament-divider" style={{ marginBottom: '32px', maxWidth: '400px' }}>
          <Diamond color={`${GOLD_DIM}60`} />
        </div>

        {/* ── Name & years ──────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h1 className="cinzel" style={{
            margin: 0,
            fontSize: '38px',
            fontWeight: 900,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: GOLD_LIGHT,
            textShadow: `0 0 40px ${GOLD}30`,
          }}>
            {character.name}
          </h1>
        </div>
        <p className="cinzel" style={{
          margin: '0 0 40px',
          fontSize: '13px',
          letterSpacing: '0.3em',
          color: 'rgba(201,168,76,0.3)',
        }}>
          {character.birthYear} · {deathYear}
        </p>

        {/* ── Epitafio ──────────────────────────────────────────────────── */}
        <div style={{
          maxWidth: '640px',
          textAlign: 'center',
          marginBottom: '44px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}>
          {epitafio.map((sentence, i) => (
            <p key={i} className="crimson" style={{
              margin: 0,
              fontSize: '17px',
              lineHeight: 1.8,
              color: i === 0 ? '#a08060' : '#7a6045',
              fontStyle: 'italic',
              letterSpacing: '0.01em',
            }}>
              {sentence}
            </p>
          ))}
        </div>

        {/* ── Ornament ─────────────────────────────────────────────────── */}
        <div className="ornament-divider" style={{ marginBottom: '36px', maxWidth: '500px' }}>
          <Diamond color={`${GARNET}50`} />
        </div>

        {/* ── Tres decisiones ───────────────────────────────────────────── */}
        <p className="cinzel" style={{
          margin: '0 0 20px',
          fontSize: '9px',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'rgba(201,168,76,0.3)',
        }}>
          Las tres decisiones que te definieron
        </p>
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '44px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          width: '100%',
        }}>
          {decisions.map((d, i) => (
            <div key={i} style={{
              padding: '14px 22px',
              borderRadius: '8px',
              border: '1px solid rgba(201,168,76,0.12)',
              background: 'rgba(0,0,0,0.3)',
              textAlign: 'center',
              flex: '1 1 160px',
              maxWidth: '220px',
            }}>
              <p className="cinzel" style={{
                margin: '0 0 6px',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: 'rgba(201,168,76,0.6)',
                textTransform: 'uppercase',
              }}>
                {d.title}
              </p>
              <p className="cinzel" style={{
                margin: 0,
                fontSize: '9px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(201,168,76,0.25)',
              }}>
                {d.stage}
              </p>
            </div>
          ))}
        </div>

        {/* ── Ornament ─────────────────────────────────────────────────── */}
        <div className="ornament-divider" style={{ marginBottom: '36px', maxWidth: '500px' }}>
          <Diamond color={`${GOLD_DIM}40`} />
        </div>

        {/* ── Puntuación de Legado ──────────────────────────────────────── */}
        <p className="cinzel" style={{
          margin: '0 0 24px',
          fontSize: '9px',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'rgba(201,168,76,0.3)',
        }}>
          Puntuación de legado
        </p>

        <div style={{
          width: '100%',
          maxWidth: '540px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          marginBottom: '32px',
          padding: '24px 28px',
          borderRadius: '10px',
          border: '1px solid rgba(201,168,76,0.08)',
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(8px)',
        }}>
          <ScoreBar label="Logros"       weight="40%"  value={scores.logros}       max={40} active={barsActive} delay={0} />
          <ScoreBar label="Felicidad"    weight="30%"  value={scores.felicidad}    max={30} active={barsActive} delay={0.15} />
          <ScoreBar label="Impacto"      weight="20%"  value={scores.impacto}      max={20} active={barsActive} delay={0.30} />
          <ScoreBar label="Autenticidad" weight="10%"  value={scores.autenticidad} max={10} active={barsActive} delay={0.45} />

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(201,168,76,0.08)', margin: '4px 0' }} />

          {/* Total */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '6px' }}>
            <span className="cinzel" style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.3)' }}>
              Total
            </span>
            <span className="cinzel" style={{
              fontSize: '36px',
              fontWeight: 900,
              color: barsActive ? GOLD_LIGHT : GOLD_DIM,
              letterSpacing: '0.05em',
              transition: 'color 0.6s ease 1.8s',
              lineHeight: 1,
            }}>
              {scores.total}
            </span>
            <span className="cinzel" style={{ fontSize: '14px', color: 'rgba(201,168,76,0.25)' }}>/&nbsp;100</span>
          </div>
        </div>

        {/* ── Frase final ───────────────────────────────────────────────── */}
        <p className="crimson" style={{
          maxWidth: '560px',
          textAlign: 'center',
          margin: '0 0 48px',
          fontSize: '16px',
          lineHeight: 1.8,
          color: 'rgba(201,168,76,0.45)',
          fontStyle: 'italic',
          letterSpacing: '0.02em',
        }}>
          {fraseFinal}
        </p>

        {/* ── Ornament ─────────────────────────────────────────────────── */}
        <div className="ornament-divider" style={{ marginBottom: '40px', maxWidth: '400px' }}>
          <Diamond color={`${GARNET}40`} />
        </div>

        {/* ── Buttons ───────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Nueva vida */}
          <button
            onClick={onRestart}
            style={{
              padding: '16px 40px',
              borderRadius: '7px',
              border: '1px solid rgba(201,168,76,0.5)',
              background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(139,100,30,0.22))',
              color: GOLD_LIGHT,
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: "'Cinzel', serif",
              boxShadow: '0 0 20px rgba(201,168,76,0.15), inset 0 1px 0 rgba(201,168,76,0.12)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.boxShadow = '0 0 32px rgba(201,168,76,0.3), inset 0 1px 0 rgba(201,168,76,0.2)';
              b.style.borderColor = 'rgba(201,168,76,0.7)';
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.boxShadow = '0 0 20px rgba(201,168,76,0.15), inset 0 1px 0 rgba(201,168,76,0.12)';
              b.style.borderColor = 'rgba(201,168,76,0.5)';
            }}
          >
            Nueva Vida
          </button>

          {/* Créditos */}
          <button
            onClick={() => setShowCredits(true)}
            style={{
              padding: '16px 28px',
              borderRadius: '7px',
              border: '1px solid rgba(201,168,76,0.2)',
              background: 'transparent',
              color: 'rgba(201,168,76,0.35)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: "'Cinzel', serif",
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.color = 'rgba(201,168,76,0.65)';
              b.style.borderColor = 'rgba(201,168,76,0.4)';
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.color = 'rgba(201,168,76,0.35)';
              b.style.borderColor = 'rgba(201,168,76,0.2)';
            }}
          >
            Créditos
          </button>

          {/* Continuar con tu descendiente */}
          <button
            onClick={() => setShowDynasty(true)}
            style={{
              padding: '16px 40px',
              borderRadius: '7px',
              border: '1px solid rgba(139,26,42,0.5)',
              background: 'linear-gradient(135deg, rgba(139,26,42,0.12), rgba(90,15,25,0.18))',
              color: 'rgba(200,130,140,0.7)',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: "'Cinzel', serif",
              boxShadow: '0 0 20px rgba(139,26,42,0.12), inset 0 1px 0 rgba(139,26,42,0.1)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.boxShadow = '0 0 28px rgba(139,26,42,0.25), inset 0 1px 0 rgba(139,26,42,0.15)';
              b.style.borderColor = 'rgba(139,26,42,0.7)';
              b.style.color = 'rgba(220,150,160,0.85)';
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.boxShadow = '0 0 20px rgba(139,26,42,0.12), inset 0 1px 0 rgba(139,26,42,0.1)';
              b.style.borderColor = 'rgba(139,26,42,0.5)';
              b.style.color = 'rgba(200,130,140,0.7)';
            }}
          >
            Continuar con tu Descendiente
          </button>
        </div>

        {/* Bottom ornament */}
        <div className="ornament-divider" style={{ marginTop: '56px', maxWidth: '280px' }}>
          <Diamond color={`${GOLD}18`} />
        </div>

      </div>
    </div>

    {/* ── Modal de créditos ── */}
    {showCredits && (
      <div
        onClick={() => setShowCredits(false)}
        style={{
          position:        'fixed',
          inset:           0,
          backgroundColor: 'rgba(0,0,0,0.88)',
          zIndex:          20000,
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          padding:         '2rem',
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background:   '#100e0b',
            border:       '1px solid rgba(201,168,76,0.25)',
            borderRadius: '10px',
            padding:      'clamp(2rem, 5vw, 3.5rem)',
            maxWidth:     '540px',
            width:        '100%',
            textAlign:    'center',
          }}
        >
          <div style={{
            fontFamily:    '"Cinzel", serif',
            fontSize:      '11px',
            letterSpacing: '0.3em',
            color:         'rgba(201,168,76,0.45)',
            marginBottom:  '2rem',
            textTransform: 'uppercase',
          }}>
            Créditos
          </div>

          <div style={{
            fontFamily:   '"Cinzel", serif',
            fontSize:     'clamp(1.1rem, 3vw, 1.5rem)',
            color:        GOLD,
            marginBottom: '0.4rem',
            letterSpacing: '0.05em',
          }}>
            Serat
          </div>
          <div style={{
            fontFamily:    'sans-serif',
            fontSize:      '13px',
            color:         'rgba(201,168,76,0.55)',
            marginBottom:  '0.25rem',
            letterSpacing: '0.02em',
          }}>
            Piano Textures
          </div>
          <div style={{
            fontFamily:    'sans-serif',
            fontSize:      '11px',
            color:         'rgba(201,168,76,0.35)',
            marginBottom:  '2rem',
            letterSpacing: '0.02em',
          }}>
            Licencia Creative Commons Attribution (CC BY)
          </div>

          <div style={{
            borderTop:    '1px solid rgba(201,168,76,0.1)',
            paddingTop:   '1.5rem',
            fontFamily:   '"Cinzel", serif',
            fontSize:     '10px',
            letterSpacing: '0.1em',
            color:         'rgba(201,168,76,0.25)',
            lineHeight:    1.8,
          }}>
            FATEBORN · Juego narrativo<br />
            Diseño y desarrollo: fatebornthegame
          </div>

          <button
            onClick={() => setShowCredits(false)}
            style={{
              marginTop:     '2rem',
              padding:       '10px 32px',
              borderRadius:  '6px',
              border:        '1px solid rgba(201,168,76,0.25)',
              background:    'transparent',
              color:         'rgba(201,168,76,0.45)',
              fontSize:      '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor:        'pointer',
              fontFamily:    "'Cinzel', serif",
              transition:    'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.color = 'rgba(201,168,76,0.75)';
              b.style.borderColor = 'rgba(201,168,76,0.45)';
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.color = 'rgba(201,168,76,0.45)';
              b.style.borderColor = 'rgba(201,168,76,0.25)';
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    )}
    </>
  );
}
