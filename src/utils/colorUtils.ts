const componentToHex = (c: number) => {
  const hex = c.toString(16).toUpperCase()
  return hex.length === 1 ? `0${hex}` : hex
}

export const rgbToHex = (r: number, g: number, b: number) => `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`

export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null
}

export const mixColor = (color1: string, color2: string, percent: number) => {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  if (!rgb1 || !rgb2) return ''
  return rgbToHex(
    Math.round(rgb1.r + (rgb2.r - rgb1.r) * percent),
    Math.round(rgb1.g + (rgb2.g - rgb1.g) * percent),
    Math.round(rgb1.b + (rgb2.b - rgb1.b) * percent),
  )
}
