import RouteService from './RouteService'

describe('RouteService', () => {
  test('getPath', () => {
    expect(RouteService.getPath()).toBe('')
  })

  test('navigate', () => {
    RouteService.navigate('aaa/bbb')
    expect(RouteService.getPath()).toBe('aaa/bbb')
  })

  describe('match', () => {
    test('default', () => {
      RouteService.navigate('aaa/bbb')
      expect(RouteService.match('aaa/bbb')).toBeTruthy()
      expect(RouteService.match('aaa/bbb/ccc')).toBeFalsy()
    })

    test('with params', () => {
      RouteService.navigate('aaa/bbb')
      expect(RouteService.match(':a/:b')).toEqual({
        a: 'aaa',
        b: 'bbb',
      })
      expect(RouteService.match('ccc/:a/:b')).toBeFalsy()
    })
  })
})
