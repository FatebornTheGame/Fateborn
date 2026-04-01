import { useState, useCallback, useEffect, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Particle {
  id:    number;
  x:     number;
  y:     number;
  dx:    number;   // random horizontal drift (CSS --px)
  type:  'pos' | 'neg';
  delay: number;
}

let nextId = 0;

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Returns [particles, emit].
 * Call emit(x, y, type) to spawn 8 particles at a viewport position.
 */
export function useParticles(): [Particle[], (x: number, y: number, type: 'pos' | 'neg') => void] {
  const [particles, setParticles] = useState<Particle[]>([]);
  const timerRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const emit = useCallback((x: number, y: number, type: 'pos' | 'neg') => {
    const batch: Particle[] = Array.from({ length: 8 }, (_, i) => ({
      id:    nextId++,
      x:     x + (Math.random() - 0.5) * 24,
      y:     y + (Math.random() - 0.5) * 12,
      dx:    (Math.random() - 0.5) * 30,
      type,
      delay: i * 60,
    }));

    setParticles(prev => [...prev, ...batch]);

    // Remove after animation (900ms + max delay 420ms + buffer)
    batch.forEach(p => {
      const t = setTimeout(() => {
        setParticles(prev => prev.filter(q => q.id !== p.id));
        timerRef.current.delete(p.id);
      }, 1400 + p.delay);
      timerRef.current.set(p.id, t);
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    const map = timerRef.current;
    return () => { map.forEach(t => clearTimeout(t)); };
  }, []);

  return [particles, emit];
}

// ─── Renderer ─────────────────────────────────────────────────────────────────

const POS_COLOR = '#c9a84c';
const NEG_COLOR = '#8b1a2a';

export function ParticleLayer({ particles }: { particles: Particle[] }) {
  if (particles.length === 0) return null;

  return (
    <>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position:   'fixed',
            left:       p.x,
            top:        p.y,
            width:      '5px',
            height:     '5px',
            borderRadius: '50%',
            background: p.type === 'pos' ? POS_COLOR : NEG_COLOR,
            boxShadow:  `0 0 6px ${p.type === 'pos' ? POS_COLOR : NEG_COLOR}`,
            pointerEvents: 'none',
            zIndex:     9998,
            animation:  `${p.type === 'pos' ? 'particle-rise' : 'particle-fall'} 0.9s ease-out ${p.delay}ms forwards`,
            ['--px' as string]: `${p.dx}px`,
          }}
        />
      ))}
    </>
  );
}
