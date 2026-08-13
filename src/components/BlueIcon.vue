<script setup lang="ts">
import { computed } from 'vue'

/**
 * A Material Design Icon in a square box, so a row of them lines up whichever glyphs it carries
 * and however wide each one happens to advance.
 */
const props = defineProps<{
  /** Icon name, with or without the `mdi-` prefix. */
  name: string
  /** Side of the box, in pixels when given as a number (default 20). */
  size?: number | string
  color?: string
  /** Turns, for something under way. */
  spin?: boolean
  /** Read out in place of the icon. Without one the icon is hidden from assistive technology. */
  label?: string
}>()

const iconClass = computed(() => (props.name.startsWith('mdi-') ? props.name : `mdi-${props.name}`))

const box = computed(() => {
  const size = props.size ?? 20
  return typeof size === 'number' ? `${size}px` : size
})
</script>

<template>
  <span
    class="mdi bluevue-icon"
    :class="[iconClass, spin ? 'bluevue-icon--spin' : '']"
    :style="{ width: box, height: box, fontSize: box, color }"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
  />
</template>
