let currentAudio: HTMLAudioElement | null = null
let currentSrc:   string | null           = null

export function getCurrentSrc(): string | null { return currentSrc }

/**
 * Plays a music track with a fade-in effect, stopping any previous track.
 */
export function playMusic(src: string, fadeInMs = 2000, volume = 0.4): void {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }

  const audio    = new Audio(src)
  audio.loop     = true
  audio.volume   = 0
  currentAudio   = audio
  currentSrc     = src

  audio.play().catch(() => {
    // Autoplay blocked — user interaction needed
  })

  const steps     = 20
  const stepMs    = fadeInMs / steps
  const stepVol   = volume  / steps
  let   stepCount = 0

  const interval = setInterval(() => {
    stepCount++
    audio.volume = Math.min(volume, stepVol * stepCount)
    if (stepCount >= steps) clearInterval(interval)
  }, stepMs)
}

export function stopMusic(fadeOutMs = 1000): void {
  if (!currentAudio) return

  const audio     = currentAudio
  const startVol  = audio.volume
  const steps     = 20
  const stepMs    = fadeOutMs / steps
  const stepVol   = startVol / steps
  let   stepCount = 0

  const interval = setInterval(() => {
    stepCount++
    audio.volume = Math.max(0, startVol - stepVol * stepCount)
    if (stepCount >= steps) {
      clearInterval(interval)
      audio.pause()
      if (currentAudio === audio) currentAudio = null
    }
  }, stepMs)
}
