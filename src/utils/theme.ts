import { computed, type ComputedRef, shallowRef } from 'vue'

/** Light or dark, the two surfaces every component knows how to draw on. */
export type BlueMode = 'light' | 'dark'

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

/**
 * Repaints the kit in an extension's own colours, or in the colours BlueOS reports for the vehicle.
 * Only the tokens given are touched, so the rest keep the values the stylesheet ships with.
 * @param {BlueTheme} theme The tokens to change.
 * @param {HTMLElement} target Where to set the colours (default the document root, so they reach
 * everything). `mode` is always app-wide, since a component reads it rather than inheriting it.
 */
export function applyBlueTheme(theme: BlueTheme, target: HTMLElement = document.documentElement): void {
  for (const [key, variable] of Object.entries(VARIABLE) as [keyof BlueColors, string][]) {
    const value = theme[key]
    if (value) target.style.setProperty(variable, value)
  }
  if (!theme.mode) return
  appMode.value = theme.mode
  document.documentElement.dataset.bluevueMode = theme.mode
}

/**
 * The surface a component draws on: its own `theme` prop first, then the app's, then its own default.
 * A dark app sets `mode` once through `applyBlueTheme` instead of passing `theme` at every call site.
 * @param {Function} theme Reads the component's own prop.
 * @param {BlueMode} fallback What the component draws on with nothing set anywhere (default 'light').
 * @returns {ComputedRef} The surface to draw on.
 */
export function useBlueMode<T extends string>(theme: () => T | undefined, fallback: BlueMode = 'light'): ComputedRef<T | BlueMode> {
  return computed(() => theme() ?? appMode.value ?? fallback)
}
