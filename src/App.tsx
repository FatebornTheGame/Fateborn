import { useState } from 'react';
import './App.css';
import GrandparentSelection from './components/GrandparentSelection';
function App() {
  const [confirmed, setConfirmed] = useState<string[] | null>(null);

  if (confirmed) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#04030a',
          color: '#9ca3af',
          fontFamily: "'Cinzel', serif",
          gap: '16px',
        }}
      >
        <h2 style={{ color: '#c4b5fd', fontSize: '20px', letterSpacing: '0.2em' }}>
          LINAJE CONFIRMADO
        </h2>
        <p style={{ fontSize: '13px', letterSpacing: '0.1em', color: '#4b5563' }}>
          (próxima pantalla en construcción)
        </p>
        <button
          onClick={() => setConfirmed(null)}
          style={{
            marginTop: '16px',
            padding: '8px 24px',
            border: '1px solid rgba(167,139,250,0.3)',
            background: 'rgba(109,40,217,0.1)',
            color: '#a78bfa',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: "'Cinzel', serif",
            fontSize: '11px',
            letterSpacing: '0.15em',
          }}
        >
          ← Volver
        </button>
      </div>
    );
  }

  return <GrandparentSelection onConfirm={setConfirmed} />;
}

export default App;
