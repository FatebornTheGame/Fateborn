import { useRef, useState, useCallback } from 'react';

const FADE_STEPS = 50;
const FADE_MS    = 2000;
const STEP_MS    = FADE_MS / FADE_STEPS;

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

  const fadeIn = (audio: HTMLAudioElement) => {
    if (mutedRef.current) return; // stay silent while muted
    let step = 0;
    timerRef.current = setInterval(() => {
      step++;
      audio.volume = Math.min(1, step / FADE_STEPS);
      if (step >= FADE_STEPS) clearTimer();
    }, STEP_MS);
  };

  const fadeOutAndStop = (audio: HTMLAudioElement, then?: () => void) => {
    clearTimer();
    const startVol = audio.volume;
    let step = 0;
    timerRef.current = setInterval(() => {
      step++;
      audio.volume = Math.max(0, startVol * (1 - step / FADE_STEPS));
      if (step >= FADE_STEPS) {
        clearTimer();
        audio.pause();
        then?.();
      }
    }, STEP_MS);
  };

  const play = useCallback((src: string | null) => {
    const startNew = (newSrc: string) => {
      const audio = new Audio(newSrc);
      audio.loop = true;
      audio.volume = 0;
      audioRef.current = audio;
      audio.play().catch(() => {});
      fadeIn(audio);
    };

    const prev = audioRef.current;

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
