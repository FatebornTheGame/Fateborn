import type { Archetype } from '../types/archetype.types'

interface Props {
  ancestors: [Archetype | null, Archetype | null, Archetype | null, Archetype | null]
  country:   string
}

function buildNarrative(
  ancestors: [Archetype | null, Archetype | null, Archetype | null, Archetype | null],
  country:   string
): string {
  const [gp, gm, mg, mm] = ancestors
  if (!gp && !gm && !mg && !mm) return ''

  const paternalLine = gp && gm
    ? `Tu padre nació de la unión de ${gp.name.toLowerCase()} y ${gm.name.toLowerCase()}.`
    : gp
      ? `Tu padre lleva la herencia del ${gp.name.toLowerCase()}.`
      : gm
        ? `Tu padre lleva la herencia de la ${gm.name.toLowerCase()}.`
        : ''

  const maternalLine = mg && mm
    ? `Tu madre nació de la unión de ${mg.name.toLowerCase()} y ${mm.name.toLowerCase()}.`
    : mg
      ? `Tu madre lleva la herencia del ${mg.name.toLowerCase()}.`
      : mm
        ? `Tu madre lleva la herencia de la ${mm.name.toLowerCase()}.`
        : ''

  const lines = [paternalLine, maternalLine].filter(Boolean)
  if (lines.length === 0) return ''

  return `${lines.join(' ')} En ${country}, esta es la historia que precede la tuya.`
}

export function AncestralNarrative({ ancestors, country }: Props) {
  const narrative = buildNarrative(ancestors, country)
  if (!narrative) return null

  return (
    <p style={{
      fontFamily: 'Georgia, serif',
      fontStyle:  'italic',
      fontSize:   '0.95rem',
      color:      '#b09060',
      lineHeight: 1.9,
      margin:     0,
    }}>
      {narrative}
    </p>
  )
}
