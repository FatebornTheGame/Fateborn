const ptBR = {
  start: {
    line1: 'DO SEU SANGUE VOCÊ NASCE.', line2: 'DAS SUAS DECISÕES VOCÊ SE FORJA.',
    cta: 'NOVA VIDA', difficulty: 'DIFICULDADE',
    musicCredit: 'Música: Serat — Piano Textures (CC BY)',
    difficulties: {
      historia: { label: 'História',  desc: 'Sem morte permanente. Explore a narrativa livremente.' },
      fateborn: { label: 'Fateborn',  desc: 'Experiência completa. Cada decisão tem peso real.' },
      ironman:  { label: 'Ironman',   desc: 'Uma vida. Sem salvar. Sem segunda chance.' },
      legado:   { label: 'Legado',    desc: 'Modo Dinastia. Sua linhagem persiste além da morte.' },
    },
    language: 'Idioma',
  },
  ancestors: {
    title: '✦ LINHAGEM ✦', subtitle: 'Escolha até quatro ancestrais que forjarão sua herança',
    slotEmpty: 'Vazio', chooseAncestor: 'Escolha um ancestral',
    slots: 'ANCESTRAIS', country: 'ORIGEM', selectCountry: 'País de origem…', proceed: 'FORJAR HERANÇA',
  },
  birth: {
    title: '✦ HERANÇA ✦', subtitle: 'O que você carrega no sangue', back: '← linhagem',
    statsLabel: 'Stats Herdados', genesTitle: '✦ GENES LATENTES', genesSubtitle: 'Eles se revelarão com o tempo',
    nameLabel: 'Nome', namePlaceholder: 'O nome do seu personagem',
    genderLabel: 'Gênero', male: 'HOMEM', female: 'MULHER', cta: 'COMEÇAR VIDA',
  },
  game: {
    tabs: { initiative: 'INICIATIVA', feed: 'HISTÓRIA' },
    stats: { fis: 'FÍS', emo: 'EMO', est: 'MEN' },
    status: { years: 'ANOS' },
    stages: { infancia: 'Infância', adolescencia: 'Adolescência', juventud: 'Juventude', adultez: 'Adulto', adulto: 'Adulto', madurez: 'Maturidade', vejez: 'Velhice', ancianidad: 'Velhice' },
    lifestyle: {
      title: 'Iniciativa', decide: 'Tome uma decisão', choose: 'Escolha um estilo de vida',
      vivir: 'Viver', living: 'Vivendo...', advance: 'Avançar Trimestre', change: 'Mudar', confirm: 'Confirmar Estilo', quarters: 'trim.',
      alloc: { trabajo: 'Trabalho', estudios: 'Estudos', familia: 'Família', social: 'Social', salud: 'Saúde', ocio: 'Lazer' },
    },
    feed: { title: 'História', decision: 'Decisão', anos: 'anos' },
    statsPanel: { title: 'Atributos', groups: { cognitivo: 'Cognitivo', social: 'Social', vital: 'Vital' } },
    timeline: { stages: { infancia: 'Infância', juventud: 'Juventude', adulto: 'Adulto', madurez: 'Maturidade', ancianidad: 'Velhice' } },
  },
  death: {
    header: '✦ EPITÁFIO ✦', finalProfile: 'Perfil final',
    stats: { legado: 'Legado', anos: 'Anos', memorias: 'Memórias', amigos: 'Amigos', viven: 'Vivos', hitos: 'Marcos' },
    cta: 'NOVA VIDA', dynasty: 'Modo Dinastia — em breve',
  },
  mute: { mute: 'Silenciar música', unmute: 'Ativar música' },
  statLabels: {
    logica: 'Lógica', creatividad: 'Criatividade', disciplina: 'Disciplina',
    carisma: 'Carisma', emocional: 'Emocional', ambicion: 'Ambição',
    fisico: 'Físico', riesgo: 'Risco', estabilidad: 'Estabilidade',
  },
  statAbbr: {
    logica: 'LÓG', creatividad: 'CRI', disciplina: 'DIS',
    carisma: 'CAR', emocional: 'EMO', ambicion: 'AMB',
    fisico: 'FÍS', riesgo: 'RIS', estabilidad: 'EST',
  },
} as const

export default ptBR
