<script setup lang="ts">
import { computed } from 'vue'

/**
 * A turning ring, for a wait with no measure to it. A wait that does have one belongs in a
 * BlueProgressBar, and one that blocks the whole page in a BlueLoadingDialog.
 */
const props = defineProps<{
  /** Diameter, in pixels when given as a number (default 20). */
  size?: number | string
  /** The colour of the arc that turns (default the accent token). */
  color?: string
  /** Ring thickness in pixels (default 2). */
  width?: number
  /** What is being waited for, read out by assistive technology. */
  label?: string
}>()

const box = computed(() => {
  const size = props.size ?? 20
  return typeof size === 'number' ? `${size}px` : size
})
</script>

<template>
  <span
    class="bluevue-spinner"
    role="status"
    :aria-label="label"
    :style="{
      width: box,
      height: box,
      borderWidth: `${width ?? 2}px`,
      borderTopColor: color,
    }"
  />
</template>
