/**
 * Saves an object as a JSON file the browser downloads. What an extension's "export configuration"
 * button does.
 * @param {unknown} data Anything JSON can hold.
 * @param {string} filename Suggested name. '.json' is appended when it is missing.
 */
export function downloadJson(data: unknown, filename: string): void {
  const name = filename.endsWith('.json') ? filename : `${filename}.json`
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
  // The object URL holds the blob alive until it is released, and the click has already been
  // handed the data by the time this runs.
  URL.revokeObjectURL(url)
}

/**
 * Asks for a JSON file and parses it. Resolves to null when the picker is closed without a choice.
 * @param {string} accept File types to offer (default '.json,application/json').
 * @returns {Promise<T | null>} The parsed contents, or null. A malformed file rejects.
 */
export function pickJsonFile<T = unknown>(accept = '.json,application/json'): Promise<T | null> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    // A picker closed with Escape fires nothing at all in some browsers, so the promise is left to
    // settle on the next choice rather than being resolved from a cancel event that may not come.
    input.addEventListener('change', () => {
      const file = input.files?.[0]
      if (!file) {
        resolve(null)
        return
      }
      file
        .text()
        .then((text) => resolve(JSON.parse(text) as T))
        .catch(reject)
    })
    input.click()
  })
}
