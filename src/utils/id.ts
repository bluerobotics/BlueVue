let counter = 0

/**
 * A document-unique id, for wiring a label to the control it names.
 *
 * Stands in for Vue's `useId`, which arrived in 3.5 and so is out of reach of the 3.4 baseline
 * this package supports.
 *
 * @param prefix - Short name of the control asking for it, so ids stay readable in the DOM.
 * @returns The generated id.
 */
export function nextElementId(prefix: string): string {
  counter += 1
  return `bluevue-${prefix}-${counter}`
}
