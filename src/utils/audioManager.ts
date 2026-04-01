/**
 * AudioManager — singleton que controla TODA la música del juego.
 * Solo puede haber una pista sonando en cualquier momento.
 *
 * Mute real: pausa el audio (no solo baja el volumen).
 * iOS ignora HTMLAudioElement.volume vía JS, por eso usamos pause/play.
 */

const STEPS    = 50;
const FADE_MS  = 800;

class AudioManager {
  private audio:       HTMLAudioElement | null = null;
  private fadingAudio: HTMLAudioElement | null = null;
  private currentSrc:  string | null           = null;
  private timer:       ReturnType<typeof setInterval> | null = null;
  private _muted = false;

  // ── helpers ────────────────────────────────────────────────────────────────

  private clearTimer() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    if (this.fadingAudio) { this.fadingAudio.pause(); this.fadingAudio = null; }
  }

  private startFadeIn(audio: HTMLAudioElement, ms = FADE_MS) {
    audio.volume = 0;
    let step = 0;
    this.timer = setInterval(() => {
      step++;
      audio.volume = Math.min(1, step / STEPS);
      if (step >= STEPS) { clearInterval(this.timer!); this.timer = null; }
    }, ms / STEPS);
  }

  // ── API pública ────────────────────────────────────────────────────────────

  playTrack(src: string, fadeInMs = FADE_MS) {
    // Misma pista ya configurada
    if (this.currentSrc === src) {
      if (this._muted)                             return; // cargada, esperando unmute
      if (this.audio && !this.audio.paused)        return; // ya sonando
    }

    this.clearTimer();

    // Libera el audio anterior
    const old = this.audio;
    if (old && !old.paused) old.pause();
    this.audio      = null;
    this.currentSrc = null;

    const audio = new Audio(src);
    audio.loop   = true;
    audio.volume = 0;
    this.audio      = audio;
    this.currentSrc = src;

    // Si está muteado: carga el elemento pero NO arranca la reproducción.
    // Cuando el usuario desmutee, play() se llamará desde toggleMute().
    if (this._muted) return;

    const p = audio.play();
    if (p !== undefined) {
      p.catch(() => {
        // Autoplay bloqueado → reintentar en la primera interacción del usuario
        const retry = () => {
          if (this.audio !== audio || this._muted) return;
          audio.volume = 0;
          audio.play().catch(() => {});
          this.startFadeIn(audio, fadeInMs);
        };
        window.addEventListener('pointerdown', retry, { once: true });
        window.addEventListener('keydown',     retry, { once: true });
        window.addEventListener('touchstart',  retry, { once: true });
      });
    }
    this.startFadeIn(audio, fadeInMs);
  }

  stopAll(fadeOutMs = FADE_MS) {
    this.clearTimer();

    const audio      = this.audio;
    this.audio       = null;
    this.currentSrc  = null;

    // Si el audio ya estaba pausado (p.ej. muteado) no hay nada que desvandecer
    if (!audio || audio.paused) return;

    this.fadingAudio = audio;
    const startVol   = audio.volume;
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

  // ── Mute ──────────────────────────────────────────────────────────────────

  get muted() { return this._muted; }

  /**
   * Alterna mute.
   * MUTE:   pausa el audio inmediatamente (funciona en iOS).
   * UNMUTE: reanuda con fade-in; si play() es bloqueado, reintenta
   *         en la siguiente interacción del usuario.
   */
  toggleMute(): boolean {
    this._muted = !this._muted;

    if (this._muted) {
      // ── MUTE ──
      this.clearTimer();
      if (this.audio && !this.audio.paused) {
        this.audio.pause();
      }
    } else {
      // ── UNMUTE ──
      if (this.audio && this.currentSrc) {
        const audio = this.audio;
        audio.volume = 0;
        const p = audio.play();
        if (p !== undefined) {
          p.catch(() => {
            const retry = () => {
              if (this.audio !== audio || this._muted) return;
              audio.volume = 0;
              audio.play().catch(() => {});
              this.startFadeIn(audio);
            };
            window.addEventListener('pointerdown', retry, { once: true });
            window.addEventListener('touchstart',  retry, { once: true });
          });
        }
        this.startFadeIn(audio);
      }
    }

    return this._muted;
  }
}

export const audioManager = new AudioManager();
