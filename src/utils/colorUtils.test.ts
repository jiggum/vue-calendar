import {
  rgbToHex,
  hexToRgb,
  mixColor,
} from '@/utils/colorUtils'

describe('colorUtils', () => {
  test('rgbToHex', () => {
    expect(rgbToHex(0, 100, 200)).toBe('#0064C8')
  })
  test('hexToRgb', () => {
    expect(hexToRgb('#0064C8')).toEqual({
      r: 0,
      g: 100,
      b: 200,
    })
  })
  test('mixColor', () => {
    expect(mixColor('#000000', '#FFFFFF', 0.5)).toEqual('#808080')
    expect(mixColor('#0064C8', '#FFFFFF', 0)).toEqual('#0064C8')
  })
})
