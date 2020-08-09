import ko from '@/i18n/ko.json'

const LNG_SRCS = {
  ko,
}

type TLngs = keyof typeof LNG_SRCS

const DEFAULT_LNG: TLngs = 'ko'

const translation = LNG_SRCS[DEFAULT_LNG]
export type TLngKeys = keyof typeof translation

class I18nService {
  lng: TLngs = 'ko'

  t(key: TLngKeys) {
    return LNG_SRCS[this.lng][key]
  }
}

export default new I18nService()
