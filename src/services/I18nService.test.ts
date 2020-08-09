import I18nService from './I18nService'

describe('I18nService', () => {
  test('t', () => {
    expect(I18nService.t('time.day')).toBe('일')
  })
})
