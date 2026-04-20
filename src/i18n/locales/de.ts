const de = {
  start: {
    line1: 'AUS IHREM BLUT WIRST DU GEBOREN.', line2: 'AUS DEINEN ENTSCHEIDUNGEN WIRST DU GESCHMIEDET.',
    cta: 'NEUES LEBEN', difficulty: 'SCHWIERIGKEIT',
    musicCredit: 'Musik: Serat — Piano Textures (CC BY)',
    difficulties: {
      historia: { label: 'Geschichte', desc: 'Kein Permadeath. Erforsche die Handlung frei.' },
      fateborn: { label: 'Fateborn',   desc: 'Volles Erlebnis. Jede Entscheidung hat echtes Gewicht.' },
      ironman:  { label: 'Ironman',    desc: 'Ein Leben. Kein Speichern. Keine zweite Chance.' },
      legado:   { label: 'Erbe',       desc: 'Dynastiemodus. Dein Stammbaum überdauert den Tod.' },
    },
    language: 'Sprache',
  },
  ancestors: {
    title: '✦ ABSTAMMUNG ✦', subtitle: 'Wähle bis zu vier Vorfahren, die dein Erbe prägen',
    slotEmpty: 'Leer', chooseAncestor: 'Wähle einen Vorfahren',
    slots: 'VORFAHREN', country: 'HERKUNFT', selectCountry: 'Herkunftsland…', proceed: 'ERBE SCHMIEDEN',
  },
  birth: {
    title: '✦ ERBE ✦', subtitle: 'Was du im Blut trägst', back: '← Abstammung',
    statsLabel: 'Vererbte Stats', genesTitle: '✦ LATENTE GENE', genesSubtitle: 'Sie enthüllen sich mit der Zeit',
    nameLabel: 'Name', namePlaceholder: 'Der Name deiner Figur',
    genderLabel: 'Geschlecht', male: 'MÄNNLICH', female: 'WEIBLICH', cta: 'LEBEN BEGINNEN',
  },
  game: {
    tabs: { initiative: 'INITIATIVE', feed: 'GESCHICHTE' },
    stats: { fis: 'PHY', emo: 'EMO', est: 'GEI' },
    status: { years: 'JAHRE' },
    stages: { infancia: 'Kindheit', adolescencia: 'Jugend', juventud: 'Junge Erwachsene', adultez: 'Erwachsenenalter', adulto: 'Erwachsen', madurez: 'Reife', vejez: 'Alter', ancianidad: 'Alter' },
    lifestyle: {
      title: 'Initiative', decide: 'Triff eine Entscheidung', choose: 'Wähle einen Lebensstil',
      vivir: 'Leben', living: 'Lebend...', advance: 'Quartal Vorankommen', change: 'Ändern', confirm: 'Stil Bestätigen', quarters: 'Qu.',
      alloc: { trabajo: 'Arbeit', estudios: 'Studium', familia: 'Familie', social: 'Soziales', salud: 'Gesundheit', ocio: 'Freizeit' },
    },
    feed: { title: 'Geschichte', decision: 'Entscheidung', anos: 'Jahre' },
    statsPanel: { title: 'Attribute', groups: { cognitivo: 'Kognitiv', social: 'Sozial', vital: 'Vital' } },
    timeline: { stages: { infancia: 'Kindheit', juventud: 'Jugend', adulto: 'Erwachsen', madurez: 'Reife', ancianidad: 'Alter' } },
  },
  death: {
    header: '✦ GRABINSCHRIFT ✦', finalProfile: 'Abschlussprofil',
    stats: { legado: 'Erbe', anos: 'Jahre', memorias: 'Erinnerungen', amigos: 'Freunde', viven: 'Am Leben', hitos: 'Meilensteine' },
    cta: 'NEUES LEBEN', dynasty: 'Dynastiemodus — demnächst',
  },
  mute: { mute: 'Musik stumm', unmute: 'Musik aktiv' },
  statLabels: {
    logica: 'Logik', creatividad: 'Kreativität', disciplina: 'Disziplin',
    carisma: 'Charisma', emocional: 'Emotional', ambicion: 'Ambition',
    fisico: 'Körper', riesgo: 'Risiko', estabilidad: 'Stabilität',
  },
  statAbbr: {
    logica: 'LOG', creatividad: 'KRE', disciplina: 'DIS',
    carisma: 'CHA', emocional: 'EMO', ambicion: 'AMB',
    fisico: 'KÖR', riesgo: 'RIS', estabilidad: 'STA',
  },
} as const

export default de
