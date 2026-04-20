const ru = {
  start: {
    line1: 'ИЗ ИХ КРОВИ ТЫ РОЖДАЕШЬСЯ.', line2: 'ИЗ СВОИХ РЕШЕНИЙ ТЫ КУЁШЬСЯ.',
    cta: 'НОВАЯ ЖИЗНЬ', difficulty: 'СЛОЖНОСТЬ',
    musicCredit: 'Музыка: Serat — Piano Textures (CC BY)',
    difficulties: {
      historia: { label: 'История',   desc: 'Без перманентной смерти. Исследуй нарратив свободно.' },
      fateborn: { label: 'Fateborn',  desc: 'Полный опыт. Каждое решение имеет реальный вес.' },
      ironman:  { label: 'Ironman',   desc: 'Одна жизнь. Без сохранений. Без второго шанса.' },
      legado:   { label: 'Наследие',  desc: 'Режим Династии. Твой род живёт дольше смерти.' },
    },
    language: 'Язык',
  },
  ancestors: {
    title: '✦ РОД ✦', subtitle: 'Выбери до четырёх предков, которые сформируют твоё наследие',
    slotEmpty: 'Пусто', chooseAncestor: 'Выбери предка',
    slots: 'ПРЕДКИ', country: 'ПРОИСХОЖДЕНИЕ', selectCountry: 'Страна происхождения…', proceed: 'КОВАТЬ НАСЛЕДИЕ',
  },
  birth: {
    title: '✦ НАСЛЕДИЕ ✦', subtitle: 'То, что ты несёшь в крови', back: '← род',
    statsLabel: 'Унаследованные показатели', genesTitle: '✦ СКРЫТЫЕ ГЕНЫ', genesSubtitle: 'Они откроются со временем',
    nameLabel: 'Имя', namePlaceholder: 'Имя твоего персонажа',
    genderLabel: 'Пол', male: 'МУЖСКОЙ', female: 'ЖЕНСКИЙ', cta: 'НАЧАТЬ ЖИЗНЬ',
  },
  game: {
    tabs: { initiative: 'ИНИЦИАТИВА', feed: 'ИСТОРИЯ' },
    stats: { fis: 'ФИЗ', emo: 'ЭМО', est: 'УМ' },
    status: { years: 'ЛЕТ' },
    stages: { infancia: 'Детство', adolescencia: 'Отрочество', juventud: 'Юность', adultez: 'Взрослость', adulto: 'Взрослый', madurez: 'Зрелость', vejez: 'Старость', ancianidad: 'Старость' },
    lifestyle: {
      title: 'Инициатива', decide: 'Прими решение', choose: 'Выбери образ жизни',
      vivir: 'Жить', living: 'Живёт...', advance: 'Следующий Квартал', change: 'Изменить', confirm: 'Подтвердить Стиль', quarters: 'кв.',
      confirmFirst: 'ВЫБРАТЬ И НАЧАТЬ', firstTitle: 'ВЫБЕРИ ОБРАЗ ЖИЗНИ', firstSub: 'Определи, куда будешь вкладывать время каждый квартал',
      alloc: { trabajo: 'Работа', estudios: 'Учёба', familia: 'Семья', social: 'Общение', salud: 'Здоровье', ocio: 'Досуг' },
    },
    feed: { title: 'История', decision: 'Решение', anos: 'лет' },
    statsPanel: { title: 'Статистика', groups: { cognitivo: 'Когнитивное', social: 'Социальное', vital: 'Витальное' } },
    timeline: { stages: { infancia: 'Детство', juventud: 'Юность', adulto: 'Взрослый', madurez: 'Зрелость', ancianidad: 'Старость' } },
    onboarding: {
      step1: { title: 'ВЫБЕРИ КАК ХОЧЕШЬ ЖИТЬ', sub: 'Определи, куда вкладываешь своё время каждый квартал', cta: 'ПОНЯЛ' },
      step2: { title: 'НАЖМИ ЖИТЬ', sub: 'Время движется само, пока не случится что-то важное', cta: 'НАЧАТЬ' },
    },
  },
  death: {
    header: '✦ ЭПИТАФИЯ ✦', finalProfile: 'Итоговый профиль',
    stats: { legado: 'Наследие', anos: 'Лет', memorias: 'Воспоминания', amigos: 'Друзья', viven: 'Живут', hitos: 'Вехи' },
    cta: 'НОВАЯ ЖИЗНЬ', dynasty: 'Режим Династии — скоро',
  },
  mute: { mute: 'Выключить музыку', unmute: 'Включить музыку' },
  statLabels: {
    logica: 'Логика', creatividad: 'Творчество', disciplina: 'Дисциплина',
    carisma: 'Харизма', emocional: 'Эмоции', ambicion: 'Амбиции',
    fisico: 'Физика', riesgo: 'Риск', estabilidad: 'Устойчивость',
  },
  statAbbr: {
    logica: 'ЛОГ', creatividad: 'ТВО', disciplina: 'ДИС',
    carisma: 'ХАР', emocional: 'ЭМО', ambicion: 'АМБ',
    fisico: 'ФИЗ', riesgo: 'РИС', estabilidad: 'УСТ',
  },
} as const

export default ru
