const zh = {
  start: {
    line1: '你从他们的血脉中诞生。', line2: '你从你的决定中锻造自己。',
    cta: '新的生命', difficulty: '难度',
    musicCredit: '音乐：Serat — Piano Textures（CC BY）',
    difficulties: {
      historia: { label: '故事',     desc: '无永久死亡。自由探索叙事。' },
      fateborn: { label: 'Fateborn', desc: '完整体验。每个决定都有真实分量。' },
      ironman:  { label: '铁人',     desc: '一条命。无存档。无第二次机会。' },
      legado:   { label: '遗产',     desc: '王朝模式。你的血脉在死亡后延续。' },
    },
    language: '语言',
  },
  ancestors: {
    title: '✦ 血脉 ✦', subtitle: '最多选择四位将铸就你遗产的祖先',
    slotEmpty: '空', chooseAncestor: '选择一位祖先',
    slots: '祖先', country: '起源', selectCountry: '起源国…', proceed: '铸造遗产',
  },
  birth: {
    title: '✦ 遗产 ✦', subtitle: '你血液中承载的一切', back: '← 血脉',
    statsLabel: '继承属性', genesTitle: '✦ 潜伏基因', genesSubtitle: '它们将随时间显现',
    nameLabel: '姓名', namePlaceholder: '你的角色名称',
    genderLabel: '性别', male: '男', female: '女', cta: '开始生命',
  },
  game: {
    tabs: { initiative: '行动', feed: '故事' },
    stats: { fis: '体', emo: '情', est: '智' },
    status: { years: '岁' },
    stages: { infancia: '童年', adolescencia: '青春期', juventud: '青年', adultez: '成年期', adulto: '成年', madurez: '成熟', vejez: '老年', ancianidad: '晚年' },
    lifestyle: {
      title: '行动', decide: '做出决定', choose: '选择生活方式',
      vivir: '生活', living: '生活中...', advance: '推进季度', change: '更改', confirm: '确认风格', quarters: '季.',
      alloc: { trabajo: '工作', estudios: '学习', familia: '家庭', social: '社交', salud: '健康', ocio: '休闲' },
    },
    feed: { title: '故事', decision: '决定', anos: '岁' },
    statsPanel: { title: '属性', groups: { cognitivo: '认知', social: '社交', vital: '生命' } },
    timeline: { stages: { infancia: '童年', juventud: '青年', adulto: '成年', madurez: '成熟', ancianidad: '晚年' } },
  },
  death: {
    header: '✦ 墓志铭 ✦', finalProfile: '最终档案',
    stats: { legado: '遗产', anos: '岁', memorias: '记忆', amigos: '朋友', viven: '在世', hitos: '里程碑' },
    cta: '新的生命', dynasty: '王朝模式 — 即将推出',
  },
  mute: { mute: '静音', unmute: '开启音乐' },
  statLabels: {
    logica: '逻辑', creatividad: '创造力', disciplina: '纪律',
    carisma: '魅力', emocional: '情感', ambicion: '雄心',
    fisico: '体能', riesgo: '风险', estabilidad: '稳定',
  },
  statAbbr: {
    logica: '逻', creatividad: '创', disciplina: '纪',
    carisma: '魅', emocional: '情', ambicion: '志',
    fisico: '体', riesgo: '险', estabilidad: '稳',
  },
} as const

export default zh
