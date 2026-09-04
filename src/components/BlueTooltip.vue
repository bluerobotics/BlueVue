<script setup lang="ts">
import type { Placement } from '@floating-ui/vue'
import { onBeforeUnmount } from 'vue'

import { useBluePopover } from '../composables/useBluePopover'

/**
 * A label for whatever it wraps, shown on hover and on keyboard focus. It opens in the top layer,
 * so a panel that clips its own overflow cannot cut it off.
 */
const props = defineProps<{
  text: string
  /** Which side it hangs off (default 'top'). */
  placement?: Placement
  /** How long the pointer has to rest before it appears, in ms (default 300). */
  openDelay?: number
  /** Wraps its content and shows nothing, for a hint that only applies sometimes. */
  disabled?: boolean
  theme?: 'light' | 'dark'
}>()

const { anchorRef, popoverRef, popoverId, isPositioned, floatingStyles, show, hide, onToggle } = useBluePopover({
  placement: props.placement ?? 'top',
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
        class="bluevue-elevation-5 max-w-[280px] whitespace-pre-wrap rounded-[4px] px-2 py-1 text-xs leading-snug transition-opacity duration-150"
        :class="[
          theme === 'light' ? 'bg-white text-black' : 'bg-[#333333f2] text-white',
          isPositioned ? 'opacity-100' : 'opacity-0',
        ]"
      >
        {{ text }}
      </div>
    </div>
  </span>
</template>
