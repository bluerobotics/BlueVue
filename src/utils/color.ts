/** A colour as hue (0 to 360), saturation and value (each 0 to 1). */
export interface Hsv {
  h: number
  s: number
  v: number
}

/** A colour as red, green and blue channels (each 0 to 255). */
export type Rgb = [number, number, number]

const HEX = /^#?([0-9a-f]{6})$/i

/**
 * Reads a `#rrggbb` colour, with or without the hash.
 * @param {string} hex The colour.
 * @returns {Rgb | null} Its channels, or null when it is not a six-digit hex colour.
 */
export const hexToRgb = (hex: string): Rgb | null => {
  const digits = HEX.exec(hex.trim())?.[1]
  if (!digits) return null
  return [0, 2, 4].map((at) => parseInt(digits.slice(at, at + 2), 16)) as Rgb
}

/**
 * Writes channels as a lowercase `#rrggbb`, rounding and clamping each to 0 to 255.
 * @param {Rgb} rgb The channels.
 * @returns {string} The colour.
 */
export const rgbToHex = (rgb: Rgb): string =>
  `#${rgb.map((channel) => Math.min(255, Math.max(0, Math.round(channel))).toString(16).padStart(2, '0')).join('')}`

/**
 * Converts channels to hue, saturation and value.
 * @param {Rgb} rgb The channels.
 * @returns {Hsv} The same colour as hue, saturation and value.
 */
export const rgbToHsv = ([r, g, b]: Rgb): Hsv => {
  const [red, green, blue] = [r / 255, g / 255, b / 255]
  const max = Math.max(red, green, blue)
  const delta = max - Math.min(red, green, blue)
  let h = 0
  if (delta && max === red) h = ((green - blue) / delta) % 6
  else if (delta && max === green) h = (blue - red) / delta + 2
  else if (delta) h = (red - green) / delta + 4
  return { h: (h * 60 + 360) % 360, s: max ? delta / max : 0, v: max }
}

/**
 * Converts hue, saturation and value to channels.
 * @param {Hsv} hsv The colour.
 * @returns {Rgb} Its channels, unrounded.
 */
export const hsvToRgb = ({ h, s, v }: Hsv): Rgb => {
  const channel = (n: number): number => {
    const k = (n + h / 60) % 6
    return 255 * (v - v * s * Math.max(0, Math.min(k, 4 - k, 1)))
  }
  return [channel(5), channel(3), channel(1)]
}
