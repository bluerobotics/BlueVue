<script setup lang="ts">
import type { Placement, Side } from '@floating-ui/vue'
import { computed, type CSSProperties, onBeforeUnmount, ref } from 'vue'

import { useBluePopover } from '../composables/useBluePopover'
import { useBlueMode } from '../utils/theme'

/**
 * A label for whatever it wraps, shown on hover and on keyboard focus. It opens in the top layer,
 * so a panel that clips its own overflow cannot cut it off.
 */
const props = defineProps<{
  text: string
  /** Which side it hangs off (default 'top'), moving to another side when that one has no room. */
  placement?: Placement
  /** How long the pointer has to rest before it appears, in ms (default 300). */
  openDelay?: number
  /** Wraps its content and shows nothing, for a hint that only applies sometimes. */
  disabled?: boolean
  /** Only read by the plain one, since the outlined one is always dark. */
  theme?: 'light' | 'dark'
  /** A grey label with no outline or arrow, instead of the dark one ringed in the accent. */
  plain?: boolean
}>()

const mode = useBlueMode(() => props.theme)

const outlined = !props.plain
const arrowRef = ref<HTMLElement | null>(null)

const { anchorRef, popoverRef, popoverId, isPositioned, floatingStyles, placement, middlewareData, show, hide, onToggle } =
  useBluePopover({ placement: props.placement ?? 'top', arrowRef: outlined ? arrowRef : undefined, anySide: true })

const OPPOSITE: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }

// The two borders that meet at the corner facing the anchor, once the square is turned 45 degrees.
const ARROW_EDGES: Record<Side, string> = {
  top: 'border-r-2 border-b-2',
  bottom: 'border-l-2 border-t-2',
  left: 'border-t-2 border-r-2',
  right: 'border-b-2 border-l-2',
}

const side = computed(() => placement.value.split('-')[0] as Side)

// Centred on the 2px outline, so the arrow's own fill covers that stretch of it.
const arrowStyle = computed<CSSProperties>(() => {
  const { x, y } = middlewareData.value.arrow ?? {}
  return { left: x == null ? undefined : `${x}px`, top: y == null ? undefined : `${y}px`, [OPPOSITE[side.value]]: '-4px' }
})

// The rest before it appears is what keeps a pointer crossing a row of controls from trailing
// tooltips behind it.
let openTimer: number | null = null

const cancelOpen = (): void => {
  if (openTimer === null) return
  clearTimeout(openTimer)
  openTimer = null
}

const open = (): void => {
  if (props.disabled || !props.text) return
  cancelOpen()
  openTimer = window.setTimeout(() => {
    openTimer = null
    void show()
  }, props.openDelay ?? 300)
}

const close = (): void => {
  cancelOpen()
  hide()
}

onBeforeUnmount(cancelOpen)
</script>

<template>
  <span
    ref="anchorRef"
    class="inline-flex"
    :aria-describedby="text && !disabled ? popoverId : undefined"
    @mouseenter="open"
    @mouseleave="close"
    @focusin="open"
    @focusout="close"
    @keydown.escape="close"
  >
    <slot />

    <!-- Manual rather than auto: a tooltip is dismissed by the pointer leaving what it describes,
         and an auto popover would also take the next click on the page for itself. -->
    <div
      :id="popoverId"
      ref="popoverRef"
      popover="manual"
      class="bluevue-popover"
      :style="floatingStyles"
      @toggle="onToggle"
    >
      <!-- pre-wrap so a caller can break the hint into lines, and hold a column of figures on a
           tab stop, with one string and no markup. Long prose still wraps at the cap. -->
      <div
        role="tooltip"
        class="bluevue-elevation-5 max-w-[280px] whitespace-pre-wrap text-xs leading-snug transition-opacity duration-150"
        :class="[
          outlined
            ? 'rounded-md border-2 border-solid border-[var(--bluevue-accent)] bg-[#0d1117] px-2.5 py-1.5 text-white'
            : ['rounded-[4px] px-2 py-1', mode === 'light' ? 'bg-white text-black' : 'bg-[#333333f2] text-white'],
          isPositioned ? 'opacity-100' : 'opacity-0',
        ]"
      >
        {{ text }}
      </div>
      <div
        v-if="outlined"
        ref="arrowRef"
        class="absolute box-border size-2.5 rotate-45 border-0 border-solid border-[var(--bluevue-accent)] bg-[#0d1117] transition-opacity duration-150"
        :class="[ARROW_EDGES[side], isPositioned ? 'opacity-100' : 'opacity-0']"
        :style="arrowStyle"
      />
    </div>
  </span>
</template>
