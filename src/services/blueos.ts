/** What a BlueOS service answered when it did not answer with the thing that was asked for. */
export class BlueOsError extends Error {
  constructor(
    message: string,
    readonly url: string,
    /** The HTTP status, or 0 when the service could not be reached at all. */
    readonly status: number
  ) {
    super(message)
    this.name = 'BlueOsError'
  }
}

export interface BlueOsServiceOptions {
  /** The API version the service is versioned under. Pass null for the few that are not. */
  version?: string | null
  /** How long a call may take before it is given up on, in milliseconds. */
  timeout?: number
}

export interface BlueOsService {
  /** The absolute path a call would be made to, for a request this wrapper does not cover. */
  url: (path: string) => string
  get: <T>(path: string, init?: RequestInit) => Promise<T>
  post: <T>(path: string, body?: unknown, init?: RequestInit) => Promise<T>
  delete: <T>(path: string, init?: RequestInit) => Promise<T>
}

// An extension is served from the same origin as BlueOS itself, so the services sit at the root of
// it and a relative path reaches them. A page being developed off the vehicle is the exception,
// and it says where the vehicle is.
let host = ''

/**
 * Points the services at a BlueOS that is not the origin serving this page, which is what a page
 * running on a development server needs.
 * @param {string} url The vehicle's address, such as 'http://blueos.local'. Empty means the origin.
 */
export const setBlueOsHost = (url: string): void => {
  host = url.replace(/\/$/, '')
}

/** Whether this page is being served by BlueOS as an extension, rather than run on its own. */
export const isBlueOsExtension = (): boolean =>
  typeof window !== 'undefined' && window.location.pathname.startsWith('/extensionv2/')

/**
 * A wrapper around one of BlueOS's services, reachable by name.
 * @param {string} name The service as nginx exposes it, such as 'beacon', 'bag' or 'kraken'.
 * @param {BlueOsServiceOptions} options The API version to address and how long to wait.
 * @returns {BlueOsService} Its verbs, each parsing JSON and raising BlueOsError on anything else.
 */
export const blueOsService = (name: string, options: BlueOsServiceOptions = {}): BlueOsService => {
  const version = options.version === undefined ? 'v1.0' : options.version
  const timeout = options.timeout ?? 5000

  const url = (path: string): string => {
    const segments = [name, version, path.replace(/^\//, '')].filter((part): part is string => Boolean(part))
    return `${host}/${segments.join('/')}`
  }

  const request = async <T>(path: string, init: RequestInit): Promise<T> => {
    const target = url(path)

    let response: Response
    try {
      response = await fetch(target, { signal: AbortSignal.timeout(timeout), ...init })
    } catch (error) {
      // A refused connection, a DNS failure and a timeout all mean the same thing to a page: the
      // vehicle is not answering, which is worth saying differently from a service that refused.
      throw new BlueOsError(`Could not reach ${name}: ${(error as Error).message}`, target, 0)
    }

    if (!response.ok) {
      throw new BlueOsError(await response.text() || response.statusText, target, response.status)
    }

    // A service that answers with nothing is answering successfully, and undefined is what that is.
    const text = await response.text()
    return (text === '' ? undefined : JSON.parse(text)) as T
  }

  return {
    url,
    get: <T>(path: string, init?: RequestInit) => request<T>(path, { method: 'GET', ...init }),
    post: <T>(path: string, body?: unknown, init?: RequestInit) =>
      request<T>(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body),
        ...init,
      }),
    delete: <T>(path: string, init?: RequestInit) => request<T>(path, { method: 'DELETE', ...init }),
  }
}
