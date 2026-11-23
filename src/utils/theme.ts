import { computed, type ComputedRef, shallowRef } from 'vue'

import { glassToneFilterId, glassToneTable } from './glassTone'

/**
 * What the app is drawn as. Glass is a dark app on translucent, blurred surfaces, so its controls
 * draw as they do on dark.
 */
export type BlueMode = 'light' | 'dark' | 'glass'

/** How a glass app keeps its panels readable over bright scenery. */
export interface BlueGlass {
  /** Darkens bright scenery behind the glass while dark scenery stays see-through (default true). */
  adaptive?: boolean
  /** From 0 (mild) to 1 (very dark), how dark bright scenery gets behind the glass (default 0.6). */
  level?: number
  /** From 0 (only the brightest scenery) to 1 (dimmer scenery too), what gets darkened (default 0.5). */
  sensitivity?: number
  /** The tint of every glass sheet, as `#rrggbb` (default '#636363'). Adaptive glass keeps it as a light veil. */
  color?: string
  /** From 0 to 1, how much of the tint covers the scenery while adaptive glass is off (default 0.05). */
  opacity?: number
  /** Blur of the scenery behind a sheet, in px (default 22). The frosted parts inside it scale with it. */
  blur?: number
}

/** Every colour token the components read, in the names they are written with. */
export interface BlueColors {
  /** Fills a committing button, a selected segment, a slider's pill. */
  primary?: string
  /** The lighter blue used where the primary would disappear into a dark inset, such as a focus ring. */
  accent?: string
  /** Anything that went wrong, or is about to. */
  error?: string
  /** The card an extension's page is laid out on. */
  surface?: string
  /** The frosted panel dialogs and menus are drawn on. */
  panelBg?: string
  /** The line dividing one part of a panel from the next. */
  hairline?: string
}

export interface BlueTheme extends BlueColors {
  /** What every component draws on when its own `theme` prop is left out. Applies to the whole app. */
  mode?: BlueMode
  /** Adaptive glass, which only takes effect while `mode` is 'glass'. Applies to the whole app. */
  glass?: BlueGlass
}

const VARIABLE: Record<keyof BlueColors, string> = {
  primary: '--bluevue-primary',
  accent: '--bluevue-accent',
  error: '--bluevue-error',
  surface: '--bluevue-surface',
  panelBg: '--bluevue-panel-bg',
  hairline: '--bluevue-hairline',
}

const appMode = shallowRef<BlueMode>()
let glass: Required<Pick<BlueGlass, 'adaptive' | 'level' | 'sensitivity'>> = { adaptive: true, level: 0.6, sensitivity: 0.5 }

const TONE_SVG_ID = 'bluevue-glass-tone-svg'
const SVG_NS = 'http://www.w3.org/2000/svg'

/**
 * Whether this browser can draw adaptive glass. Chromium is the only engine that renders an SVG
 * filter inside `backdrop-filter`; elsewhere glass keeps its plain tint.
 * @returns {boolean} True on Chromium-based browsers.
 */
export const isAdaptiveGlassSupported = (): boolean => /Chrome\//.test(navigator.userAgent)

const createToneSvg = (): SVGSVGElement => {
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.id = TONE_SVG_ID
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('style', 'position: absolute; width: 0; height: 0; pointer-events: none')
  const filter = document.createElementNS(SVG_NS, 'filter')
  filter.setAttribute('color-interpolation-filters', 'sRGB')
  const transfer = document.createElementNS(SVG_NS, 'feComponentTransfer')
  for (const channel of ['feFuncR', 'feFuncG', 'feFuncB']) {
    const func = document.createElementNS(SVG_NS, channel)
    func.setAttribute('type', 'table')
    transfer.append(func)
  }
  filter.append(transfer)
  svg.append(filter)
  ;(document.body ?? document.documentElement).append(svg)
  return svg
}

const syncGlassTone = (): void => {
  const root = document.documentElement
  const existing = document.getElementById(TONE_SVG_ID)
  if (appMode.value !== 'glass' || !glass.adaptive || !isAdaptiveGlassSupported()) {
    existing?.remove()
    root.style.removeProperty('--bluevue-glass-tone')
    delete root.dataset.bluevueGlass
    return
  }
  const svg = existing ?? createToneSvg()
  const id = glassToneFilterId(glass.level, glass.sensitivity)
  const table = glassToneTable(glass.level, glass.sensitivity)
  svg.querySelector('filter')?.setAttribute('id', id)
  svg.querySelectorAll('feComponentTransfer > *').forEach((func) => func.setAttribute('tableValues', table))
  root.style.setProperty('--bluevue-glass-tone', `url(#${id})`)
  root.dataset.bluevueGlass = 'adaptive'
}

/**
 * Repaints the kit in an extension's own colours, or in the colours BlueOS reports for the vehicle.
 * Only the tokens given are touched, so the rest keep the values the stylesheet ships with.
 * @param {BlueTheme} theme The tokens to change.
 * @param {HTMLElement} target Where to set the colours (default the document root, so they reach
 * everything). `mode` and `glass` are always app-wide, since a component reads them rather than
 * inheriting them.
 */
export function applyBlueTheme(theme: BlueTheme, target: HTMLElement = document.documentElement): void {
  for (const [key, variable] of Object.entries(VARIABLE) as [keyof BlueColors, string][]) {
    const value = theme[key]
    if (value) target.style.setProperty(variable, value)
  }
  if (theme.glass) {
    const { color, opacity, blur, ...tone } = theme.glass
    glass = { ...glass, ...tone }
    const root = document.documentElement
    if (color) root.style.setProperty('--bluevue-glass-color', color.slice(0, 7))
    if (opacity !== undefined) root.style.setProperty('--bluevue-glass-opacity', String(opacity))
    if (blur !== undefined) root.style.setProperty('--bluevue-glass-blur', `${blur}px`)
  }
  if (theme.mode) {
    appMode.value = theme.mode
    document.documentElement.dataset.bluevueMode = theme.mode
  }
  if (theme.mode || theme.glass) syncGlassTone()
}

/**
 * The surface a component draws on: its own `theme` prop first, then the app's, then its own default.
 * A dark app sets `mode` once through `applyBlueTheme` instead of passing `theme` at every call site.
 * A glass app's controls draw as they do on dark, since the glass is what changes, not the ink.
 * @param {Function} theme Reads the component's own prop.
 * @param {'light' | 'dark'} fallback What the component draws on with nothing set anywhere (default 'light').
 * @returns {ComputedRef} The surface to draw on.
 */
export function useBlueMode<T extends string>(
  theme: () => T | undefined,
  fallback: 'light' | 'dark' = 'light',
): ComputedRef<T | 'light' | 'dark'> {
  return computed(() => theme() ?? (appMode.value === 'glass' ? 'dark' : appMode.value) ?? fallback)
}
