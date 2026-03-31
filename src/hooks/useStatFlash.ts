import { useState, useRef, useCallback } from 'react';
import type { CharacterStats } from '../types';

/**
 * Devuelve el estado de flash actual (qué stats cambiaron y en qué dirección)
 * y una función para disparar el flash al confirmar una decisión.
 */
export function useStatFlash() {
  // key → 'pos' | 'neg'
  const [flashMap, setFlashMap] = useState<Record<string, 'pos' | 'neg'>>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerFlash = useCallback((deltas: Partial<CharacterStats>) => {
    const map: Record<string, 'pos' | 'neg'> = {};
    for (const [k, v] of Object.entries(deltas) as [string, number][]) {
      if (v !== 0) map[k] = v > 0 ? 'pos' : 'neg';
    }
    setFlashMap(map);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setFlashMap({}), 1100);
  }, []);

  return { flashMap, triggerFlash };
}
