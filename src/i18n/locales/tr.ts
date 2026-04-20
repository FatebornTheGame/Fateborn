const tr = {
  start: {
    line1: 'ONLARIN KANINDAN DOĞUYORSUN.', line2: 'KENDİ KARARLARINLA ŞEKİLLENİYORSUN.',
    cta: 'YENİ HAYAT', difficulty: 'ZORLUK',
    musicCredit: 'Müzik: Serat — Piano Textures (CC BY)',
    difficulties: {
      historia: { label: 'Hikâye',    desc: 'Kalıcı ölüm yok. Anlatıyı özgürce keşfet.' },
      fateborn: { label: 'Fateborn',  desc: 'Tam deneyim. Her karar gerçek ağırlık taşır.' },
      ironman:  { label: 'Ironman',   desc: 'Tek hayat. Kayıt yok. İkinci şans yok.' },
      legado:   { label: 'Miras',     desc: 'Hanedan Modu. Soyun ölümün ötesinde yaşar.' },
    },
    language: 'Dil',
  },
  ancestors: {
    title: '✦ SOYAĞACI ✦', subtitle: 'Mirasını şekillendirecek dört ataya kadar seç',
    slotEmpty: 'Boş', chooseAncestor: 'Bir ata seç',
    slots: 'ATALAR', country: 'KÖKEN', selectCountry: 'Köken ülkesi…', proceed: 'MİRASI ŞEKİLLENDİR',
  },
  birth: {
    title: '✦ MİRAS ✦', subtitle: 'Kanında taşıdıkların', back: '← soyağacı',
    statsLabel: 'Devralınan Özellikler', genesTitle: '✦ GİZLİ GENLER', genesSubtitle: 'Zamanla ortaya çıkacaklar',
    nameLabel: 'Ad', namePlaceholder: 'Karakterinin adı',
    genderLabel: 'Cinsiyet', male: 'ERKEK', female: 'KADIN', cta: 'HAYATA BAŞLA',
  },
  game: {
    tabs: { initiative: 'GİRİŞİM', feed: 'HİKÂYE' },
    stats: { fis: 'FİZ', emo: 'EMO', est: 'ZİH' },
    status: { years: 'YAŞ' },
    stages: { infancia: 'Çocukluk', adolescencia: 'Ergenlik', juventud: 'Gençlik', adultez: 'Yetişkinlik', adulto: 'Yetişkin', madurez: 'Olgunluk', vejez: 'Yaşlılık', ancianidad: 'Yaşlılık' },
    lifestyle: {
      title: 'Girişim', decide: 'Bir karar ver', choose: 'Bir yaşam tarzı seç',
      vivir: 'Yaşa', living: 'Yaşıyor...', advance: 'Çeyreği İlerlet', change: 'Değiştir', confirm: 'Stili Onayla', quarters: 'çyr.',
      confirmFirst: 'SEÇ VE BAŞLA', firstTitle: 'YAŞAM TARZINI SEÇ', firstSub: 'Her çeyrekte zamanını nereye yatıracağını belirle',
      alloc: { trabajo: 'İş', estudios: 'Eğitim', familia: 'Aile', social: 'Sosyal', salud: 'Sağlık', ocio: 'Boş Zaman' },
    },
    feed: { title: 'Hikâye', decision: 'Karar', anos: 'yaş' },
    statsPanel: { title: 'İstatistikler', groups: { cognitivo: 'Bilişsel', social: 'Sosyal', vital: 'Yaşamsal' } },
    timeline: { stages: { infancia: 'Çocukluk', juventud: 'Gençlik', adulto: 'Yetişkin', madurez: 'Olgunluk', ancianidad: 'Yaşlılık' } },
    onboarding: {
      step1: { title: 'NASIL YAŞAMAK İSTEDİĞİNİ SEÇ', sub: 'Her çeyrekte zamanını nereye yatırdığını belirle', cta: 'ANLADIM' },
      step2: { title: 'YAŞA BUTONUNA BAS', sub: 'Önemli bir şey olana kadar zaman kendi kendine ilerleyecek', cta: 'BAŞLA' },
    },
  },
  death: {
    header: '✦ MEZAR TAŞI ✦', finalProfile: 'Son profil',
    stats: { legado: 'Miras', anos: 'Yıl', memorias: 'Anılar', amigos: 'Arkadaşlar', viven: 'Yaşıyor', hitos: 'Kilometre Taşları' },
    cta: 'YENİ HAYAT', dynasty: 'Hanedan Modu — yakında',
  },
  mute: { mute: 'Müziği kapat', unmute: 'Müziği aç' },
  statLabels: {
    logica: 'Mantık', creatividad: 'Yaratıcılık', disciplina: 'Disiplin',
    carisma: 'Karizma', emocional: 'Duygusallık', ambicion: 'Hırs',
    fisico: 'Fiziksel', riesgo: 'Risk', estabilidad: 'Denge',
  },
  statAbbr: {
    logica: 'MAN', creatividad: 'YAR', disciplina: 'DIS',
    carisma: 'KAR', emocional: 'EMO', ambicion: 'HIR',
    fisico: 'FİZ', riesgo: 'RİS', estabilidad: 'DEN',
  },
} as const

export default tr
