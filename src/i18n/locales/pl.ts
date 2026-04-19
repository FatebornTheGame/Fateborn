const pl = {
  start: {
    line1: 'Z ICH KRWI SIĘ RODZISZ.', line2: 'Z TWOICH DECYZJI ZOSTANIESZ WYKUTY.',
    cta: 'NOWE ŻYCIE', difficulty: 'TRUDNOŚĆ',
    musicCredit: 'Muzyka: Serat — Piano Textures (CC BY)',
    difficulties: {
      historia: { label: 'Fabuła',      desc: 'Bez permadeath. Eksploruj narrację bez ograniczeń.' },
      fateborn: { label: 'Fateborn',    desc: 'Pełne doświadczenie. Każda decyzja ma prawdziwy ciężar.' },
      ironman:  { label: 'Ironman',     desc: 'Jedno życie. Bez zapisu. Bez drugiej szansy.' },
      legado:   { label: 'Dziedzictwo', desc: 'Tryb Dynastii. Twój ród trwa poza śmiercią.' },
    },
    language: 'Język',
  },
  ancestors: {
    title: '✦ RÓD ✦', subtitle: 'Wybierz do czterech przodków, którzy ukształtują twoje dziedzictwo',
    slotEmpty: 'Puste', chooseAncestor: 'Wybierz przodka',
    slots: 'PRZODKOWIE', country: 'POCHODZENIE', selectCountry: 'Kraj pochodzenia…', proceed: 'WYKUĆ DZIEDZICTWO',
  },
  birth: {
    title: '✦ DZIEDZICTWO ✦', subtitle: 'To, co nosisz we krwi', back: '← ród',
    statsLabel: 'Odziedziczone statystyki', genesTitle: '✦ UTAJONE GENY', genesSubtitle: 'Ujawnią się z czasem',
    nameLabel: 'Imię', namePlaceholder: 'Imię twojej postaci',
    genderLabel: 'Płeć', male: 'MĘŻCZYZNA', female: 'KOBIETA', cta: 'ROZPOCZNIJ ŻYCIE',
  },
  game: {
    tabs: { initiative: 'INICJATYWA', feed: 'HISTORIA' },
    stats: { fis: 'FIZ', emo: 'EMO', est: 'UMY' },
    status: { years: 'LAT' },
    stages: { infancia: 'Dzieciństwo', adolescencia: 'Adolescencja', juventud: 'Młodość', adultez: 'Dorosłość', adulto: 'Dorosły', madurez: 'Dojrzałość', vejez: 'Starość', ancianidad: 'Starość' },
    lifestyle: {
      title: 'Inicjatywa', decide: 'Podejmij decyzję', choose: 'Wybierz styl życia',
      advance: 'Przejdź Kwartał', quarters: 'kw.',
      alloc: { trabajo: 'Praca', estudios: 'Nauka', familia: 'Rodzina', social: 'Życie społeczne', salud: 'Zdrowie', ocio: 'Czas wolny' },
    },
    feed: { title: 'Historia', decision: 'Decyzja', anos: 'lat' },
    statsPanel: { title: 'Statystyki', groups: { cognitivo: 'Poznawcze', social: 'Społeczne', vital: 'Witalne' } },
    timeline: { stages: { infancia: 'Dzieciństwo', juventud: 'Młodość', adulto: 'Dorosły', madurez: 'Dojrzałość', ancianidad: 'Starość' } },
  },
  death: {
    header: '✦ EPITAFIUM ✦', finalProfile: 'Profil końcowy',
    stats: { legado: 'Dziedzictwo', anos: 'Lata', memorias: 'Wspomnienia', amigos: 'Przyjaciele', viven: 'Żyją', hitos: 'Kamienie milowe' },
    cta: 'NOWE ŻYCIE', dynasty: 'Tryb Dynastii — wkrótce',
  },
  mute: { mute: 'Wycisz muzykę', unmute: 'Włącz muzykę' },
  statLabels: {
    logica: 'Logika', creatividad: 'Kreatywność', disciplina: 'Dyscyplina',
    carisma: 'Charyzma', emocional: 'Emocjonalność', ambicion: 'Ambicja',
    fisico: 'Fizyczność', riesgo: 'Ryzyko', estabilidad: 'Stabilność',
  },
  statAbbr: {
    logica: 'LOG', creatividad: 'KRE', disciplina: 'DYS',
    carisma: 'CHA', emocional: 'EMO', ambicion: 'AMB',
    fisico: 'FIZ', riesgo: 'RYZ', estabilidad: 'STA',
  },
} as const

export default pl
