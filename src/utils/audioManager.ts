/**
 * AudioManager — singleton que controla TODA la música del juego.
 * Solo puede haber una pista sonando en cualquier momento.
 *
 * Uso:
 *   audioManager.playTrack('/music/foo.mp3', 800)  // fade-in en 800 ms
 *   audioManager.stopAll(800)                       // fade-out en 800 ms
 */

const STEPS = 50; // pasos para el fade

class AudioManager {
  private audio: HTMLAudioElement | null = null;
  /** Audio que está en proceso de fade-out (para poder pararlo si llega uno nuevo) */
  private fadingAudio: HTMLAudioElement | null = null;
  private currentSrc: string | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private _muted = false;

  // ── helpers internos ────────────────────────────────────────────────────

  /**
   * Cancela el timer activo Y para inmediatamente cualquier audio en fade-out.
   * Esto garantiza que nunca queden dos pistas sonando a la vez.
   */
  private clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.fadingAudio) {
      this.fadingAudio.pause();
      this.fadingAudio = null;
    }
  }

  private startFadeIn(audio: HTMLAudioElement, ms: number) {
    let step = 0;
    this.timer = setInterval(() => {
      step++;
      audio.volume = Math.min(1, step / STEPS);
      if (step >= STEPS) {
        clearInterval(this.timer!);
        this.timer = null;
      }
    }, ms / STEPS);
  }

  // ── API pública ─────────────────────────────────────────────────────────

  /**
   * Reproduce una pista. Si ya está sonando la misma, no hace nada.
   * Si hay otra pista, la para y arranca la nueva con fade-in.
   */
  playTrack(src: string, fadeInMs = 800) {
    // Misma pista ya sonando → no reiniciar
    if (this.audio && !this.audio.paused && this.currentSrc === src) return;

    // Cancela cualquier fade en curso y para el audio en fade-out
    this.clearTimer();

    // Para el audio actual (si existe)
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
    }
    this.audio = null;
    this.currentSrc = null;

    // Arranca la nueva pista
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0;
    this.audio = audio;
    this.currentSrc = src;

    const play = audio.play();
    if (play !== undefined) {
      play.catch(() => {
        // Autoplay bloqueado por el navegador → reintento en primera interacción
        const retry = () => {
          if (this.audio !== audio) return; // ya no es la pista activa
          audio.play().catch(() => {});
          if (!this._muted) this.startFadeIn(audio, fadeInMs);
        };
        window.addEventListener('pointerdown', retry, { once: true });
        window.addEventListener('keydown',     retry, { once: true });
      });
    }

    if (!this._muted) this.startFadeIn(audio, fadeInMs);
  }

  /**
   * Detiene la música con fade-out.
   * Si se llama playTrack() mientras el fade-out está en curso,
   * clearTimer() cancela el fade y para el audio inmediatamente.
   */
  stopAll(fadeOutMs = 800) {
    this.clearTimer();

    const audio = this.audio;
    if (!audio || audio.paused) return;

    // Desvincula de this.audio para que playTrack() no lo vea como activo
    this.audio = null;
    this.currentSrc = null;

    // Lo referencia en fadingAudio: si llega playTrack(), clearTimer() lo parará
    this.fadingAudio = audio;

    const startVol = audio.volume;
    let step = 0;
    this.timer = setInterval(() => {
      step++;
      audio.volume = Math.max(0, startVol * (1 - step / STEPS));
      if (step >= STEPS) {
        clearInterval(this.timer!);
        this.timer = null;
        audio.pause();
        if (this.fadingAudio === audio) this.fadingAudio = null;
      }
    }, fadeOutMs / STEPS);
  }

  // ── Mute ────────────────────────────────────────────────────────────────

  get muted() { return this._muted; }

  toggleMute(): boolean {
    this._muted = !this._muted;
    if (this.audio) this.audio.volume = this._muted ? 0 : 1;
    return this._muted;
  }
}

export const audioManager = new AudioManager();
