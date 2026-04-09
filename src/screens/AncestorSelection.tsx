import { useGameStore } from '../store/gameStore';

export default function AncestorSelection() {
  const setScreen = useGameStore(s => s.setScreen);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d0b08',
      color: '#d4c5a0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2rem',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <h2 style={{ fontFamily: 'Cinzel, serif', color: '#c9a84c', margin: 0 }}>
        Selección de Ancestros
      </h2>
      <p style={{ color: '#888', fontSize: '0.9rem', letterSpacing: '0.2em' }}>
        AncestorSelection — placeholder
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => setScreen('start')}
          style={{
            background: 'transparent',
            color: '#888',
            border: '1px solid #444',
            padding: '0.75rem 1.5rem',
            cursor: 'pointer',
          }}
        >
          ← Atrás
        </button>
        <button
          onClick={() => setScreen('birth')}
          style={{
            background: '#c9a84c',
            color: '#0d0b08',
            border: 'none',
            padding: '0.75rem 2rem',
            fontFamily: 'Cinzel, serif',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Continuar →
        </button>
      </div>
    </div>
  );
}
