<script setup lang="ts">
import { computed } from 'vue'

/**
 * How far along something is. Give it a value for work whose size is known, and set
 * `indeterminate` for work that is under way but cannot say how much of it is left.
 */
const props = defineProps<{
  /** Percentage complete, clamped to 0-100. */
  modelValue?: number
  /** Sweeps instead of filling, for progress that cannot be measured. */
  indeterminate?: boolean
  /** Bar thickness in pixels (default 4). */
  height?: number
  /** The fill (default the primary token). */
  color?: string
  theme?: 'light' | 'dark'
  /** What is progressing, read out by assistive technology. */
  label?: string
}>()

// A value outside the range is a caller's arithmetic, not a bar that should paint past its track.
const percent = computed(() => Math.min(100, Math.max(0, props.modelValue ?? 0)))
</script>

<template>
  <div
    class="bluevue-progress w-full overflow-hidden rounded-full"
    :class="theme === 'light' ? 'bg-[#00000022]' : 'bg-[#ffffff1a]'"
    :style="{ height: `${height ?? 4}px` }"
    role="progressbar"
    :aria-label="label"
    :aria-valuenow="indeterminate ? undefined : percent"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div
      class="h-full rounded-full"
      :class="indeterminate ? 'bluevue-progress__sweep' : 'transition-[width] duration-200 ease-out'"
      :style="{
        width: indeterminate ? undefined : `${percent}%`,
        backgroundColor: color || 'var(--bluevue-primary)',
      }"
    />
  </div>
</template>
