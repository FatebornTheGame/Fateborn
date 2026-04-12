// ─── Visual / Brand ──────────────────────────────────────────────────────────
export const COLOR_GOLD   = '#C9A84C'
export const COLOR_GARNET = '#8B1A2A'
export const COLOR_FELT   = '#0d0b08'

// ─── Audio ───────────────────────────────────────────────────────────────────
export const MUSIC_OPENING         = '/music/opening.mp3'
export const MUSIC_DARK_DECISION   = '/music/dark-decision.mp3'
export const MUSIC_TIMELAPSE       = '/music/timelapse.mp3'
export const MUSIC_YOUNG_FILMMAKER = '/music/young-filmmaker.mp3'
export const MUSIC_TRAILS          = '/music/trails.mp3'
export const MUSIC_WINTER_QUARTERS = '/music/winter-quarters.mp3'
export const MUSIC_CAST_VEJEZ      = '/music/cast-vejez.mp3'

// ─── Game rules ──────────────────────────────────────────────────────────────
export const STAT_MIN = 0
export const STAT_MAX = 10
export const STAT_DEFAULT = 5
export const ANCESTOR_SLOTS = 4
export const QUARTERS_PER_YEAR = 4
export const WEEKS_PER_QUARTER = 13

// ─── Age thresholds ──────────────────────────────────────────────────────────
export const AGE_CHILDHOOD_START    = 0
export const AGE_ADOLESCENCE_START  = 13
export const AGE_YOUTH_START        = 19
export const AGE_ADULTHOOD_START    = 31
export const AGE_MATURITY_START     = 51
export const AGE_OLD_AGE_START      = 71

// ─── Inheritance ─────────────────────────────────────────────────────────────
export const MUTATION_RANGE = 0.10   // ±10% random mutation

// ─── Sexual orientation probabilities ────────────────────────────────────────
export const ORIENTATION_HETEROSEXUAL_CHANCE = 0.85
export const ORIENTATION_HOMOSEXUAL_CHANCE   = 0.07
// bisexual = remaining 8%

// ─── Lifestyle ───────────────────────────────────────────────────────────────
export const LIFESTYLE_LABELS: Record<string, string> = {
  ambitious:  'Ambicioso',
  balanced:   'Equilibrado',
  social:     'Social',
  athletic:   'Atlético',
  hedonist:   'Hedonista',
  family:     'Familiar',
  spiritual:  'Contemplativo',
}

// ─── Difficulty multipliers ──────────────────────────────────────────────────
export const DIFFICULTY_CONSEQUENCE_MULTIPLIER: Record<string, number> = {
  historia: 0.5,
  fateborn: 1.0,
  ironman:  1.5,
  legado:   2.0,
}
