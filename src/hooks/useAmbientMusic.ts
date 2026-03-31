import { useRef, useState, useCallback } from 'react';

const FADE_STEPS      = 50;
const FADE_MS         = 2000;
const FADE_MS_SLOW    = 5000;   // fade más lento para la pantalla de muerte

export function useAmbientMusic() {
  const audioRef  = useRef<HTMLAudioElement | null>(null);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const mutedRef  = useRef(false);
  const [muted, setMuted] = useState(false);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const fadeIn = (audio: HTMLAudioElement, fadeMs = FADE_MS) => {
    if (mutedRef.current) return;
    let step = 0;
    const stepMs = fadeMs / FADE_STEPS;
    timerRef.current = setInterval(() => {
      step++;
      audio.volume = Math.min(1, step / FADE_STEPS);
      if (step >= FADE_STEPS) clearTimer();
    }, stepMs);
  };

  const fadeOutAndStop = (audio: HTMLAudioElement, then?: () => void) => {
    clearTimer();
    const startVol = audio.volume;
    let step = 0;
    const stepMs = FADE_MS / FADE_STEPS;
    timerRef.current = setInterval(() => {
      step++;
      audio.volume = Math.max(0, startVol * (1 - step / FADE_STEPS));
      if (step >= FADE_STEPS) {
        clearTimer();
        audio.pause();
        then?.();
      }
    }, stepMs);
  };

  // fadeMs controls the fade-in duration of the NEW track
  const play = useCallback((src: string | null, fadeMs = FADE_MS) => {
    const prev = audioRef.current;

    // Same track already playing → do nothing
    if (src && prev && !prev.paused) {
      const currentFile = prev.src.split('/').pop();
      const newFile     = src.split('/').pop();
      if (currentFile === newFile) return;
    }

    const startNew = (newSrc: string) => {
      const audio = new Audio(newSrc);
      audio.loop = true;
      audio.volume = 0;
      audioRef.current = audio;
      audio.play().catch(() => {});
      fadeIn(audio, fadeMs);
    };

    if (prev && !prev.paused) {
      fadeOutAndStop(prev, () => { if (src) startNew(src); });
    } else {
      clearTimer();
      if (src) startNew(src);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    if (audioRef.current) {
      audioRef.current.volume = next ? 0 : 1;
    }
  }, []);

  return { play, muted, toggleMute };
}

export { FADE_MS_SLOW };
