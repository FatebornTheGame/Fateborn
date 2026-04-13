import type { Archetype } from '../types/archetype.types'

export const ARCHETYPES: Archetype[] = [
  {
    id:          'atleta',
    name:        'Atleta',
    description: 'Nacido para el movimiento y la competición. El cuerpo como templo y herramienta.',
    lore:        'El dolor es información. La victoria, consecuencia.',
    stats: { logica: 4, creatividad: 4, disciplina: 8, carisma: 6, emocional: 5, ambicion: 7, fisico: 9, riesgo: 6, estabilidad: 6 },
  },
  {
    id:          'academico',
    name:        'Académico',
    description: 'La vida del intelecto. El conocimiento como fin y como medio.',
    lore:        'Entender el mundo antes de intentar cambiarlo.',
    stats: { logica: 9, creatividad: 6, disciplina: 8, carisma: 4, emocional: 5, ambicion: 6, fisico: 3, riesgo: 3, estabilidad: 7 },
  },
  {
    id:          'artista',
    name:        'Artista',
    description: 'La creación como necesidad vital. El arte como única forma honesta de hablar.',
    lore:        'No hace el arte porque puede. Lo hace porque no puede no hacerlo.',
    stats: { logica: 5, creatividad: 9, disciplina: 4, carisma: 6, emocional: 8, ambicion: 5, fisico: 4, riesgo: 6, estabilidad: 4 },
  },
  {
    id:          'lider',
    name:        'Líder',
    description: 'Las personas lo siguen antes de que él sepa a dónde va.',
    lore:        'El poder no se toma. Se ejerce hasta que los demás lo reconocen.',
    stats: { logica: 6, creatividad: 5, disciplina: 7, carisma: 9, emocional: 6, ambicion: 8, fisico: 5, riesgo: 6, estabilidad: 6 },
  },
  {
    id:          'emprendedor',
    name:        'Emprendedor',
    description: 'Ve oportunidades donde otros ven problemas. Fracasa más que nadie. Aprende más que nadie.',
    lore:        'El primer negocio quebró. El segundo también. El tercero cambió todo.',
    stats: { logica: 6, creatividad: 7, disciplina: 5, carisma: 7, emocional: 5, ambicion: 9, fisico: 5, riesgo: 8, estabilidad: 4 },
  },
  {
    id:          'cuidador',
    name:        'Cuidador',
    description: 'El pilar silencioso de la familia. Presente siempre que importa.',
    lore:        'La mayor fortaleza es aquella que sostiene a los demás.',
    stats: { logica: 5, creatividad: 5, disciplina: 6, carisma: 6, emocional: 9, ambicion: 3, fisico: 5, riesgo: 3, estabilidad: 9 },
  },
  {
    id:          'explorador',
    name:        'Explorador',
    description: 'El mundo es demasiado grande para quedarse en un solo lugar.',
    lore:        'Los mapas mienten. La realidad hay que ir a verla.',
    stats: { logica: 6, creatividad: 7, disciplina: 4, carisma: 5, emocional: 5, ambicion: 6, fisico: 8, riesgo: 9, estabilidad: 3 },
  },
  {
    id:          'filosofo',
    name:        'Filósofo',
    description: 'Las preguntas que no tienen respuesta son las únicas que merecen hacerse.',
    lore:        'Vivió despacio. Pensó mucho. Actuó poco. Pero cuando actuó, importó.',
    stats: { logica: 8, creatividad: 7, disciplina: 7, carisma: 4, emocional: 6, ambicion: 4, fisico: 3, riesgo: 4, estabilidad: 7 },
  },
]
