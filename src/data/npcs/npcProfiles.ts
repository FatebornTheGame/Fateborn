import type { Stats, ParallelArcStep } from '../../types/game.types'

// ─── Name pools por país/cultura ─────────────────────────────────────────────

export const NAME_POOLS: Record<string, { male: string[]; female: string[] }> = {
  'España': {
    male:   ['Miguel', 'Carlos', 'Pablo', 'Javier', 'Alejandro', 'David', 'Sergio', 'Daniel', 'Adrián', 'Rubén',
             'Iván', 'Marcos', 'Hugo', 'Álvaro', 'Diego', 'Raúl', 'Víctor', 'Mario', 'Fernando', 'Jorge',
             'Ignacio', 'Gonzalo', 'Alberto', 'Antonio', 'Luis', 'Tomás', 'Rodrigo', 'Nicolás', 'Enrique', 'Pedro'],
    female: ['María', 'Laura', 'Ana', 'Carmen', 'Lucía', 'Marta', 'Sara', 'Paula', 'Elena', 'Isabel',
             'Sofía', 'Claudia', 'Nuria', 'Beatriz', 'Raquel', 'Silvia', 'Verónica', 'Cristina', 'Pilar', 'Teresa',
             'Natalia', 'Alicia', 'Irene', 'Mónica', 'Rosa', 'Inés', 'Ángela', 'Lara', 'Eva', 'Patricia'],
  },
  'Portugal': {
    male:   ['João', 'Pedro', 'Luís', 'Rui', 'Nuno', 'Paulo', 'Bruno', 'Tiago', 'António', 'Filipe'],
    female: ['Ana', 'Maria', 'Sofia', 'Inês', 'Marta', 'Catarina', 'Rita', 'Joana', 'Beatriz', 'Mariana'],
  },
  'Nigeria': {
    male:   ['Emeka', 'Chidi', 'Kelechi', 'Ifeanyi', 'Obinna', 'Chukwudi', 'Eze', 'Nnamdi', 'Chinedu', 'Uche',
             'Tunde', 'Biodun', 'Seun', 'Kayode', 'Babatunde', 'Femi', 'Ola', 'Tobi', 'Deji', 'Sola'],
    female: ['Ngozi', 'Adaeze', 'Chioma', 'Amaka', 'Nneka', 'Ifeoma', 'Chinyere', 'Ugochi', 'Kemi', 'Bisi',
             'Funmi', 'Yetunde', 'Folake', 'Shade', 'Bimpe', 'Abike', 'Toyin', 'Ife', 'Lola', 'Sade'],
  },
  'India': {
    male:   ['Arjun', 'Raj', 'Vikram', 'Sanjay', 'Rahul', 'Aditya', 'Rohan', 'Nikhil', 'Kiran', 'Suresh',
             'Priya', 'Dev', 'Varun', 'Manish', 'Sunil', 'Deepak', 'Abhishek', 'Rajan', 'Vivek', 'Gaurav'],
    female: ['Priya', 'Anjali', 'Kavya', 'Pooja', 'Divya', 'Meera', 'Nisha', 'Sanya', 'Aarti', 'Rekha',
             'Sunita', 'Geeta', 'Lata', 'Uma', 'Radha', 'Anita', 'Deepa', 'Shweta', 'Neha', 'Ritu'],
  },
  'México': {
    male:   ['José', 'Juan', 'Miguel', 'Carlos', 'Jesús', 'Luis', 'Alejandro', 'Roberto', 'Francisco', 'Eduardo',
             'Ricardo', 'Fernando', 'Arturo', 'Rafael', 'Diego', 'Gerardo', 'Guillermo', 'Ernesto', 'Marco', 'Óscar'],
    female: ['María', 'Guadalupe', 'Sofía', 'Valentina', 'Fernanda', 'Valeria', 'Daniela', 'Ana', 'Isabella', 'Camila',
             'Alejandra', 'Adriana', 'Paola', 'Esperanza', 'Claudia', 'Verónica', 'Brenda', 'Leticia', 'Sandra', 'Rosa'],
  },
  'Brasil': {
    male:   ['Lucas', 'Gabriel', 'Pedro', 'Mateus', 'Felipe', 'João', 'Gustavo', 'Rafael', 'Eduardo', 'Thiago',
             'Bruno', 'Vinícius', 'Caio', 'Diego', 'Leandro', 'Rodrigo', 'Paulo', 'Fernando', 'Marcelo', 'André'],
    female: ['Ana', 'Julia', 'Isabela', 'Beatriz', 'Mariana', 'Giovanna', 'Camila', 'Larissa', 'Fernanda', 'Letícia',
             'Bruna', 'Vanessa', 'Nathalia', 'Amanda', 'Priscila', 'Renata', 'Cláudia', 'Patrícia', 'Simone', 'Érica'],
  },
  'Francia': {
    male:   ['Thomas', 'Lucas', 'Hugo', 'Théo', 'Antoine', 'Maxime', 'Baptiste', 'Romain', 'Nicolas', 'Clément',
             'Pierre', 'Louis', 'Alexis', 'Sébastien', 'Julien', 'Quentin', 'Arthur', 'Alexandre', 'Florian', 'Adrien'],
    female: ['Emma', 'Camille', 'Lucie', 'Chloé', 'Manon', 'Sarah', 'Inès', 'Léa', 'Pauline', 'Océane',
             'Marie', 'Charlotte', 'Juliette', 'Margot', 'Zoé', 'Clara', 'Mathilde', 'Alice', 'Anaïs', 'Noémie'],
  },
  'Alemania': {
    male:   ['Lukas', 'Leon', 'Felix', 'Jonas', 'Max', 'Elias', 'Paul', 'Finn', 'Tim', 'Jan',
             'Tobias', 'Stefan', 'Markus', 'Christian', 'Klaus', 'Matthias', 'Andreas', 'Florian', 'Dominik', 'Fabian'],
    female: ['Emma', 'Hannah', 'Mia', 'Sophia', 'Anna', 'Lena', 'Laura', 'Nina', 'Lisa', 'Julia',
             'Katharina', 'Sandra', 'Sabrina', 'Claudia', 'Petra', 'Stefanie', 'Monika', 'Birgit', 'Anja', 'Melanie'],
  },
}

// ─── NPC archetype profiles ───────────────────────────────────────────────────

export interface NPCArchetype {
  description: string
  baseStats:   Partial<Stats>
  lifeArc:     string
}

export const NPC_ARCHETYPES: Record<string, NPCArchetype> = {
  'hijo_de_academico': {
    description: 'Criado en un ambiente intelectual, presionado a destacar',
    baseStats:   { logica: 7, disciplina: 7, ambicion: 6, emocional: 5 },
    lifeArc:     'estudios brillantes → presión familiar → crisis identitaria a los 30',
  },
  'hijo_de_obrero': {
    description: 'Pragmático desde pequeño, acostumbrado al esfuerzo real',
    baseStats:   { fisico: 6, disciplina: 6, carisma: 5, riesgo: 6 },
    lifeArc:     'trabajo temprano → estabilidad laboral → satisfacción tardía',
  },
  'hijo_de_artista': {
    description: 'Rodeado de creatividad, busca su propio lenguaje',
    baseStats:   { creatividad: 8, emocional: 7, disciplina: 4, estabilidad: 5 },
    lifeArc:     'talento visible → crisis de identidad → creación de algo propio',
  },
  'hijo_de_empresario': {
    description: 'Ambicioso desde pequeño, conoce el valor del dinero',
    baseStats:   { ambicion: 7, carisma: 6, riesgo: 7, logica: 6 },
    lifeArc:     'primeros negocios a los 20 → fracaso y aprendizaje → éxito real a los 35',
  },
  'hijo_de_deportista': {
    description: 'Físicamente dotado, competitivo por naturaleza',
    baseStats:   { fisico: 8, disciplina: 7, riesgo: 5, emocional: 5 },
    lifeArc:     'deporte de alto nivel → lesión o límite natural → reconversión',
  },
  'hijo_de_medico': {
    description: 'Educado con conciencia sanitaria y responsabilidad',
    baseStats:   { logica: 7, emocional: 6, disciplina: 7, ambicion: 6 },
    lifeArc:     'vocación de servicio → burnout a los 40 → reencuadre vital',
  },
}

// ─── Parallel arc para el primer amigo ───────────────────────────────────────
export const BEST_FRIEND_PARALLEL_ARC: ParallelArcStep[] = [
  {
    triggerAge: 8,
    event: 'Descubre el mismo hobby que el jugador. Tardes compartidas.',
    narrativeToPlayer: '{{name}} y tú compartís cada tarde después del colegio. Una complicidad construida en silencio.',
  },
  {
    triggerAge: 14,
    event: 'Elige su camino académico. Puede divergir del jugador.',
    narrativeToPlayer: '{{name}} ha elegido su rumbo en el instituto. Os veis menos, pero hay cosas que no se explican con palabras.',
  },
  {
    triggerAge: 16,
    event: 'Primer trabajo o primera beca.',
    narrativeToPlayer: '{{name}} empieza a trabajar los fines de semana. Su vida se acelera antes que la tuya.',
  },
  {
    triggerAge: 22,
    event: 'Primer contrato real.',
    narrativeToPlayer: '{{name}} ya tiene su primer contrato. Te lo cuenta con orgullo contenido en un mensaje de voz.',
  },
  {
    triggerAge: 30,
    event: 'Crisis personal: ruptura o reconversión laboral.',
    narrativeToPlayer: '{{name}} está pasando algo. No dice mucho, pero se nota. Algo en él ha cambiado.',
  },
  {
    triggerAge: 45,
    event: 'El resultado de sus grandes apuestas se hace visible.',
    narrativeToPlayer: 'Cuando quedáis, te das cuenta de que {{name}} ha construido una vida real. Con sus cicatrices.',
  },
  {
    triggerAge: 60,
    event: 'Reencuentro con perspectiva después de décadas.',
    narrativeToPlayer: '{{name}} y tú tomáis un café. Hay más silencio que antes. Y más verdad en ese silencio.',
  },
  {
    triggerAge: 77,
    event: 'Posible fallecimiento por vitalLoad alto o enfermedad.',
    narrativeToPlayer: '{{name}} ha muerto. No hay forma de prepararse para perder a alguien de la infancia.',
  },
]
