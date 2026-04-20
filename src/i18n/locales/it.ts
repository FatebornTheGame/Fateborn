const it = {
  start: {
    line1: 'DAL LORO SANGUE SEI NATO.', line2: 'DALLE TUE DECISIONI TI FORGI.',
    cta: 'NUOVA VITA', difficulty: 'DIFFICOLTÀ',
    musicCredit: 'Musica: Serat — Piano Textures (CC BY)',
    difficulties: {
      historia: { label: 'Storia',    desc: 'Nessuna morte permanente. Esplora la narrazione liberamente.' },
      fateborn: { label: 'Fateborn',  desc: 'Esperienza completa. Ogni decisione ha un peso reale.' },
      ironman:  { label: 'Ironman',   desc: 'Una sola vita. Nessun salvataggio. Nessuna seconda possibilità.' },
      legado:   { label: 'Eredità',   desc: 'Modalità Dinastia. Il tuo lignaggio persiste oltre la morte.' },
    },
    language: 'Lingua',
  },
  ancestors: {
    title: '✦ LIGNAGGIO ✦', subtitle: 'Scegli fino a quattro antenati che forgeranno la tua eredità',
    slotEmpty: 'Vuoto', chooseAncestor: 'Scegli un antenato',
    slots: 'ANTENATI', country: 'ORIGINE', selectCountry: 'Paese d\'origine…', proceed: 'FORGIARE L\'EREDITÀ',
  },
  birth: {
    title: '✦ EREDITÀ ✦', subtitle: 'Ciò che porti nel sangue', back: '← lignaggio',
    statsLabel: 'Stat Ereditate', genesTitle: '✦ GENI LATENTI', genesSubtitle: 'Si riveleranno con il tempo',
    nameLabel: 'Nome', namePlaceholder: 'Il nome del tuo personaggio',
    genderLabel: 'Genere', male: 'UOMO', female: 'DONNA', cta: 'INIZIA LA VITA',
  },
  game: {
    tabs: { initiative: 'INIZIATIVA', feed: 'STORIA' },
    stats: { fis: 'FIS', emo: 'EMO', est: 'MEN' },
    status: { years: 'ANNI' },
    stages: { infancia: 'Infanzia', adolescencia: 'Adolescenza', juventud: 'Giovinezza', adultez: 'Adulto', adulto: 'Adulto', madurez: 'Maturità', vejez: 'Vecchiaia', ancianidad: 'Vecchiaia' },
    lifestyle: {
      title: 'Iniziativa', decide: 'Prendi una decisione', choose: 'Scegli uno stile di vita',
      vivir: 'Vivere', living: 'Vivendo...', advance: 'Avanza Trimestre', change: 'Cambia', confirm: 'Conferma Stile', quarters: 'trim.',
      alloc: { trabajo: 'Lavoro', estudios: 'Studi', familia: 'Famiglia', social: 'Sociale', salud: 'Salute', ocio: 'Svago' },
    },
    feed: { title: 'Storia', decision: 'Decisione', anos: 'anni' },
    statsPanel: { title: 'Statistiche', groups: { cognitivo: 'Cognitivo', social: 'Sociale', vital: 'Vitale' } },
    timeline: { stages: { infancia: 'Infanzia', juventud: 'Giovinezza', adulto: 'Adulto', madurez: 'Maturità', ancianidad: 'Vecchiaia' } },
    onboarding: {
      step1: { title: 'SCEGLI COME VUOI VIVERE', sub: 'Definisci dove investi il tuo tempo ogni trimestre', cta: 'CAPITO' },
      step2: { title: 'PREMI VIVERE', sub: 'Il tempo avanzerà da solo finché non accade qualcosa di importante', cta: 'INIZIA' },
    },
  },
  death: {
    header: '✦ EPITAFFIO ✦', finalProfile: 'Profilo finale',
    stats: { legado: 'Eredità', anos: 'Anni', memorias: 'Ricordi', amigos: 'Amici', viven: 'Vivi', hitos: 'Traguardi' },
    cta: 'NUOVA VITA', dynasty: 'Modalità Dinastia — prossimamente',
  },
  mute: { mute: 'Silenzia musica', unmute: 'Attiva musica' },
  statLabels: {
    logica: 'Logica', creatividad: 'Creatività', disciplina: 'Disciplina',
    carisma: 'Carisma', emocional: 'Emotivo', ambicion: 'Ambizione',
    fisico: 'Fisico', riesgo: 'Rischio', estabilidad: 'Stabilità',
  },
  statAbbr: {
    logica: 'LOG', creatividad: 'CRE', disciplina: 'DIS',
    carisma: 'CAR', emocional: 'EMO', ambicion: 'AMB',
    fisico: 'FIS', riesgo: 'RIS', estabilidad: 'STA',
  },
} as const

export default it
