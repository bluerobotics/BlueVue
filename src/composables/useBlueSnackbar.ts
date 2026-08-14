import { readonly, type Ref, ref } from 'vue'

export type BlueNoticeSeverity = 'success' | 'error' | 'warning' | 'info'

export interface BlueNotice {
  id: number
  text: string
  severity: BlueNoticeSeverity
  /** How many of the same message arrived in a row, so a repeat counts rather than stacks. */
  repeats: number
}

interface BlueNoticeOptions {
  /** Default 'info'. */
  severity?: BlueNoticeSeverity
  /** How long it stays, in ms. 0 keeps it until it is dismissed, which errors do by default. */
  timeout?: number
}

interface BlueSnackbarApi {
  notices: Readonly<Ref<readonly BlueNotice[]>>
  /** Says something happened. Returns the notice's id, for dismissing it early. */
  notify: (text: string, options?: BlueNoticeOptions) => number
  /** Says a request failed, in whatever terms the failure came back in. */
  notifyError: (error: unknown, fallback?: string) => number
  dismiss: (id: number) => void
}

const DEFAULT_TIMEOUT = 5000

// Enough to read a burst without the stack becoming the page. Anything older than the last few is
// gone from the screen before it could be read anyway.
const MAX_ON_SCREEN = 4

// One queue for the whole application: the notices outlive whichever component raised them, and
// the bar rendering them is mounted once, at the root.
const notices = ref<BlueNotice[]>([])
const timers = new Map<number, number>()
let lastId = 0

const clearTimer = (id: number): void => {
  const timer = timers.get(id)
  if (timer === undefined) return
  clearTimeout(timer)
  timers.delete(id)
}

const dismiss = (id: number): void => {
  clearTimer(id)
  notices.value = notices.value.filter((notice) => notice.id !== id)
}

const notify = (text: string, options: BlueNoticeOptions = {}): number => {
  const severity = options.severity ?? 'info'
  // A failure is worth acting on, so it waits to be dismissed rather than passing while the reader
  // is looking elsewhere.
  const timeout = options.timeout ?? (severity === 'error' ? 0 : DEFAULT_TIMEOUT)

  // A retry loop saying the same thing every second should read as one message that keeps
  // happening, not as a column of identical ones.
  const last = notices.value[notices.value.length - 1]
  if (last && last.text === text && last.severity === severity) {
    last.repeats += 1
    clearTimer(last.id)
    if (timeout > 0) timers.set(last.id, window.setTimeout(() => dismiss(last.id), timeout))
    return last.id
  }

  const notice: BlueNotice = { id: ++lastId, text, severity, repeats: 1 }
  notices.value = [...notices.value, notice].slice(-MAX_ON_SCREEN)
  if (timeout > 0) timers.set(notice.id, window.setTimeout(() => dismiss(notice.id), timeout))
  return notice.id
}

// An axios rejection carries the server's own words, which say more than the status line does.
const notifyError = (error: unknown, fallback = 'Request failed'): number => {
  const detail = (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail
  const message = (error as Error)?.message
  return notify(detail || message || fallback, { severity: 'error' })
}

/**
 * The application's notices. Raise them from anywhere; BlueSnackbar, which BlueApp mounts for you,
 * is what puts them on screen.
 * @returns {BlueSnackbarApi} The queue, and the ways to add to and remove from it.
 */
export function useBlueSnackbar(): BlueSnackbarApi {
  return { notices: readonly(notices), notify, notifyError, dismiss }
}
