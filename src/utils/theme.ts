/** Every token the components read, in the names they are written with. */
export interface BlueTheme {
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

const VARIABLE: Record<keyof BlueTheme, string> = {
  primary: '--bluevue-primary',
  accent: '--bluevue-accent',
  error: '--bluevue-error',
  surface: '--bluevue-surface',
  panelBg: '--bluevue-panel-bg',
  hairline: '--bluevue-hairline',
}

/**
 * Repaints the kit in an extension's own colours, or in the colours BlueOS reports for the vehicle.
 * Only the tokens given are touched, so the rest keep the values the stylesheet ships with.
 * @param {BlueTheme} theme The tokens to change.
 * @param {HTMLElement} target Where to set them (default the document root, so they reach everything).
 */
export function applyBlueTheme(theme: BlueTheme, target: HTMLElement = document.documentElement): void {
  for (const [key, variable] of Object.entries(VARIABLE) as [keyof BlueTheme, string][]) {
    const value = theme[key]
    if (value) target.style.setProperty(variable, value)
  }
}
