const fr = {
  start: {
    line1: 'DE LEUR SANG TU NAIS.', line2: 'DE TES DÉCISIONS TU TE FORGES.',
    cta: 'NOUVELLE VIE', difficulty: 'DIFFICULTÉ',
    musicCredit: 'Musique : Serat — Piano Textures (CC BY)',
    difficulties: {
      historia: { label: 'Histoire',  desc: 'Sans mort permanente. Explorez librement la narration.' },
      fateborn: { label: 'Fateborn',  desc: 'Expérience complète. Chaque décision a un vrai poids.' },
      ironman:  { label: 'Ironman',   desc: 'Une seule vie. Pas de sauvegarde. Pas de seconde chance.' },
      legado:   { label: 'Héritage',  desc: 'Mode Dynastie. Votre lignée perdure au-delà de la mort.' },
    },
    language: 'Langue',
  },
  ancestors: {
    title: '✦ LIGNÉE ✦', subtitle: 'Choisissez jusqu\'à quatre ancêtres qui forgeront votre héritage',
    slotEmpty: 'Vide', chooseAncestor: 'Choisissez un ancêtre',
    slots: 'ANCÊTRES', country: 'ORIGINE', selectCountry: 'Pays d\'origine…', proceed: 'FORGER L\'HÉRITAGE',
  },
  birth: {
    title: '✦ HÉRITAGE ✦', subtitle: 'Ce que vous portez dans le sang', back: '← lignée',
    statsLabel: 'Stats héritées', genesTitle: '✦ GÈNES LATENTS', genesSubtitle: 'Ils se révéleront avec le temps',
    nameLabel: 'Nom', namePlaceholder: 'Le nom de votre personnage',
    genderLabel: 'Genre', male: 'HOMME', female: 'FEMME', cta: 'COMMENCER LA VIE',
  },
  game: {
    tabs: { initiative: 'INITIATIVE', feed: 'HISTOIRE' },
    stats: { fis: 'PHY', emo: 'ÉMO', est: 'MEN' },
    status: { years: 'ANS' },
    stages: { infancia: 'Enfance', adolescencia: 'Adolescence', juventud: 'Jeunesse', adultez: 'Âge adulte', adulto: 'Adulte', madurez: 'Maturité', vejez: 'Vieillesse', ancianidad: 'Vieillesse' },
    lifestyle: {
      title: 'Initiative', decide: 'Prenez une décision', choose: 'Choisissez un style de vie',
      vivir: 'Vivre', living: 'En vie...', advance: 'Avancer le Trimestre', change: 'Changer', confirm: 'Confirmer le Style', quarters: 'trim.',
      alloc: { trabajo: 'Travail', estudios: 'Études', familia: 'Famille', social: 'Social', salud: 'Santé', ocio: 'Loisirs' },
    },
    feed: { title: 'Histoire', decision: 'Décision', anos: 'ans' },
    statsPanel: { title: 'Attributs', groups: { cognitivo: 'Cognitif', social: 'Social', vital: 'Vital' } },
    timeline: { stages: { infancia: 'Enfance', juventud: 'Jeunesse', adulto: 'Adulte', madurez: 'Maturité', ancianidad: 'Vieillesse' } },
    onboarding: {
      step1: { title: 'CHOISIS COMMENT TU VEUX VIVRE', sub: 'Définis où tu investis ton temps chaque trimestre', cta: 'COMPRIS' },
      step2: { title: 'APPUIE SUR VIVRE', sub: "Le temps avancera seul jusqu'à ce que quelque chose d'important arrive", cta: 'COMMENCER' },
    },
  },
  death: {
    header: '✦ ÉPITAPHE ✦', finalProfile: 'Profil final',
    stats: { legado: 'Héritage', anos: 'Années', memorias: 'Souvenirs', amigos: 'Amis', viven: 'Vivants', hitos: 'Jalons' },
    cta: 'NOUVELLE VIE', dynasty: 'Mode Dynastie — bientôt disponible',
  },
  mute: { mute: 'Couper la musique', unmute: 'Activer la musique' },
  statLabels: {
    logica: 'Logique', creatividad: 'Créativité', disciplina: 'Discipline',
    carisma: 'Charisme', emocional: 'Émotionnel', ambicion: 'Ambition',
    fisico: 'Physique', riesgo: 'Risque', estabilidad: 'Stabilité',
  },
  statAbbr: {
    logica: 'LOG', creatividad: 'CRÉ', disciplina: 'DIS',
    carisma: 'CHA', emocional: 'ÉMO', ambicion: 'AMB',
    fisico: 'PHY', riesgo: 'RIS', estabilidad: 'STA',
  },
} as const

export default fr
