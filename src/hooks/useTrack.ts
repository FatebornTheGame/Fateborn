import { useEffect } from 'react';
import { audioManager } from '../utils/audioManager';

/**
 * Reproduce una pista al montar el componente y la detiene al desmontarlo.
 * El AudioManager garantiza que solo suene una pista a la vez.
 */
export function useTrack(src: string, fadeInMs = 800) {
  useEffect(() => {
    audioManager.playTrack(src, fadeInMs);
    return () => { audioManager.stopAll(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
