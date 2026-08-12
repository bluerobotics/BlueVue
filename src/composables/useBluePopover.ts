import { autoUpdate, flip, offset, type Placement, shift, size, useFloating, type VirtualElement } from '@floating-ui/vue'
import { computed, type CSSProperties, nextTick, ref, type Ref } from 'vue'

interface BluePopoverOptions {
  /** Where the menu hangs off its anchor (default 'bottom-end'). */
  placement?: Placement
  /** Give the menu at least its anchor's width, for a select whose list should line up with it. */
  matchAnchorWidth?: boolean
}

interface BluePopover {
  /** Goes on the element the menu hangs off, when it opens from a control rather than a pointer. */
  anchorRef: Ref<HTMLElement | null>
  /** Goes on the element carrying the `popover` attribute. */
  popoverRef: Ref<HTMLElement | null>
  /** The popover's id, for the `popovertarget` the activator is bound to. */
  popoverId: string
  /** Bind onto an activator `<button>` to let the browser own the open and close. */
  activatorProps: { popovertarget: string }
  isOpen: Ref<boolean>
  /** False until the menu has been placed, so it can be held invisible for that first frame. */
  isPositioned: Readonly<Ref<boolean>>
  floatingStyles: Readonly<Ref<CSSProperties>>
  /** Opens the menu, at a viewport position when one is given instead of an anchor element. */
  show: (pointerTarget?: [number, number]) => Promise<void>
  hide: () => void
  /** Bind to the popover's `toggle` event, so a dismissal by the browser is reflected back. */
  onToggle: (event: Event) => void
}

let popoverCount = 0

// The browser dismisses an auto popover on the pointerup whose pointerdown landed before the
// popover existed, which is every menu summoned mid-gesture: a right-click, a long press. Knowing
// a button is still held is what lets such a menu wait for the release instead of being closed by
// it. Tracked once for all popovers, and only from the first one that is created, so importing
// the composable touches no document.
let pointerIsDown = false
let pointerTracked = false

const trackPointerState = (): void => {
  if (pointerTracked || typeof document === 'undefined') return
  pointerTracked = true
  const release = (): void => { pointerIsDown = false }
  document.addEventListener('pointerdown', () => { pointerIsDown = true }, true)
  document.addEventListener('pointerup', release, true)
  document.addEventListener('pointercancel', release, true)
}

const afterPointerRelease = (): Promise<void> =>
  new Promise((resolve) => {
    const done = (): void => {
      document.removeEventListener('pointerup', done)
      document.removeEventListener('pointercancel', done)
      // Resolved a task later, so the browser has already had its turn at dismissing on this
      // release and the menu opens into the quiet after it.
      setTimeout(resolve)
    }
    document.addEventListener('pointerup', done)
    document.addEventListener('pointercancel', done)
  })

/**
 * A menu that opens in the top layer, so it is never clipped by the panel it belongs to and
 * needs no z-index of its own. The native popover dismisses it on outside click and on Escape;
 * floating-ui keeps it beside its anchor and inside the viewport.
 * @param {BluePopoverOptions} options Placement, and whether to match the anchor's width.
 * @returns {BluePopover} Refs to bind, open state, and imperative open and close.
 */
export function useBluePopover(options: BluePopoverOptions = {}): BluePopover {
  trackPointerState()

  const anchorRef = ref<HTMLElement | null>(null)
  const popoverRef = ref<HTMLElement | null>(null)
  const isOpen = ref(false)
  const popoverId = `bluevue-popover-${++popoverCount}`

  // Set only when the menu is opened at a pointer position, as a right-click or long-press does.
  const pointerTarget = ref<[number, number] | null>(null)

  const virtualAnchor = computed<VirtualElement | null>(() => {
    if (!pointerTarget.value) return null
    const [x, y] = pointerTarget.value
    return { getBoundingClientRect: () => new DOMRect(x, y, 0, 0) }
  })

  // Null while closed, so scroll and resize are only observed for a menu that is on screen.
  const reference = computed(() => (isOpen.value ? virtualAnchor.value ?? anchorRef.value : null))

  const { floatingStyles, isPositioned } = useFloating(reference, popoverRef, {
    // Stated so isPositioned drops back to false on close, and a second open is held invisible
    // until it has been placed rather than showing for a frame at wherever it last was.
    open: isOpen,
    placement: options.placement ?? 'bottom-end',
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(4),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      ...(options.matchAnchorWidth
        ? [size({
          apply: ({ rects, elements }) => {
            elements.floating.style.minWidth = `${rects.reference.width}px`
          },
        })]
        : []),
    ],
  })

  // Bumped by every open and close, so an open that waited out a pointer release can tell it is
  // still the one wanted and does not arrive after something already asked for the opposite.
  let request = 0

  const show = async (target?: [number, number]): Promise<void> => {
    const ticket = ++request
    pointerTarget.value = target ?? null
    await nextTick()
    if (pointerIsDown) await afterPointerRelease()
    if (ticket !== request) return
    const el = popoverRef.value
    if (!el || el.matches(':popover-open')) return
    // Opening it is what sets isOpen, through the toggle event the browser fires.
    el.showPopover()
  }

  const hide = (): void => {
    request += 1
    const el = popoverRef.value
    if (el?.matches(':popover-open')) el.hidePopover()
    else isOpen.value = false
  }

  const onToggle = (event: Event): void => {
    isOpen.value = (event as ToggleEvent).newState === 'open'
    // A menu placed at a pointer keeps its target only while it is up, so the next open off an
    // activator is not still anchored to the last right-click.
    if (!isOpen.value) pointerTarget.value = null
  }

  return {
    anchorRef,
    popoverRef,
    popoverId,
    activatorProps: { popovertarget: popoverId },
    isOpen,
    isPositioned,
    floatingStyles,
    show,
    hide,
    onToggle,
  }
}
