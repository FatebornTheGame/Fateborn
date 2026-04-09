import { useGameStore } from '../store/gameStore';

const GOLD       = '#c9a84c';
const GOLD_LIGHT = '#e8d08a';

const STAT_GROUPS = [
  { label: 'Cognitivo', keys: ['logica', 'creatividad', 'disciplina'] as const },
  { label: 'Social',    keys: ['carisma', 'emocional', 'ambicion']    as const },
  { label: 'Vital',     keys: ['fisico', 'riesgo', 'estabilidad']     as const },
];

const STAT_LABELS: Record<string, string> = {
  logica: 'Lógica', creatividad: 'Creatividad', disciplina: 'Disciplina',
  carisma: 'Carisma', emocional: 'Emocional', ambicion: 'Ambición',
  fisico: 'Físico', riesgo: 'Riesgo', estabilidad: 'Estabilidad',
};

export default function GameScreen() {
  const character = useGameStore(s => s.character);
  const setScreen = useGameStore(s => s.setScreen);

  if (!character) return null;

  return (
    <div
      className="leather-bg"
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
      }}
    >
      {/* Vignette */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 25%, rgba(5,3,2,0.88) 100%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '520px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px',
        animation: 'fade-up 0.9s cubic-bezier(0.16,1,0.3,1) forwards',
      }}>
        {/* Name */}
        <div style={{ textAlign: 'center' }}>
          <p className="cinzel" style={{
            fontSize: '11px', letterSpacing: '0.38em',
            color: `rgba(201,168,76,0.4)`, textTransform: 'uppercase',
            margin: '0 0 10px',
          }}>
            Tu personaje
          </p>
          <h1 className="cinzel" style={{
            fontSize: 'clamp(22px, 5vw, 32px)',
            letterSpacing: '0.1em',
            color: GOLD_LIGHT,
            margin: 0,
            textShadow: `0 0 32px rgba(201,168,76,0.3)`,
          }}>
            {character.name}
          </h1>
        </div>

        {/* Stats */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {STAT_GROUPS.map(group => (
            <div key={group.label}>
              <p className="cinzel" style={{
                fontSize: '9px', letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: 'rgba(201,168,76,0.35)',
                margin: '0 0 8px',
              }}>
                {group.label}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {group.keys.map(key => {
                  const val = character.stats[key];
                  return (
                    <div key={key} style={{
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(201,168,76,0.12)',
                      borderRadius: '6px',
                      padding: '10px 12px',
                      textAlign: 'center',
                    }}>
                      <div className="cinzel" style={{
                        fontSize: '18px', fontWeight: 700,
                        color: GOLD,
                      }}>
                        {val.toFixed(1)}
                      </div>
                      <div style={{
                        fontSize: '10px', letterSpacing: '0.12em',
                        color: 'rgba(201,168,76,0.45)',
                        textTransform: 'uppercase',
                        marginTop: '3px',
                      }}>
                        {STAT_LABELS[key]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => setScreen('childhood')}
          style={{
            width: '100%',
            padding: '18px',
            borderRadius: '7px',
            border: `1px solid rgba(201,168,76,0.55)`,
            background: 'linear-gradient(135deg, rgba(201,168,76,0.18), rgba(139,100,30,0.25))',
            color: GOLD_LIGHT,
            fontFamily: "'Cinzel', serif",
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: '0 0 28px rgba(201,168,76,0.2)',
            transition: 'all 0.3s ease',
          }}
          onPointerEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 40px rgba(201,168,76,0.35)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.8)';
          }}
          onPointerLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 28px rgba(201,168,76,0.2)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.55)';
          }}
        >
          Comenzar Infancia
        </button>
      </div>
    </div>
  );
}
