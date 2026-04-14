import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import es   from './locales/es'
import en   from './locales/en'
import fr   from './locales/fr'
import de   from './locales/de'
import ptBR from './locales/pt-BR'
import it   from './locales/it'
import pl   from './locales/pl'
import ru   from './locales/ru'
import tr   from './locales/tr'
import zh   from './locales/zh'

const savedLang = localStorage.getItem('fateborn_lang') ?? 'es'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es:    { translation: es   },
      en:    { translation: en   },
      fr:    { translation: fr   },
      de:    { translation: de   },
      'pt-BR': { translation: ptBR },
      it:    { translation: it   },
      pl:    { translation: pl   },
      ru:    { translation: ru   },
      tr:    { translation: tr   },
      zh:    { translation: zh   },
    },
    lng:           savedLang,
    fallbackLng:   'es',
    interpolation: { escapeValue: false },
  })

export function setLanguage(lang: string) {
  i18n.changeLanguage(lang)
  localStorage.setItem('fateborn_lang', lang)
}

export const SUPPORTED_LANGUAGES = [
  { code: 'es',    label: 'Español'    },
  { code: 'en',    label: 'English'    },
  { code: 'fr',    label: 'Français'   },
  { code: 'de',    label: 'Deutsch'    },
  { code: 'pt-BR', label: 'Português'  },
  { code: 'it',    label: 'Italiano'   },
  { code: 'pl',    label: 'Polski'     },
  { code: 'ru',    label: 'Русский'    },
  { code: 'tr',    label: 'Türkçe'     },
  { code: 'zh',    label: '中文'       },
]

export default i18n
