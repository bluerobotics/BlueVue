<script setup lang="ts">
import { computed } from 'vue'

import BlueIcon from './BlueIcon.vue'

/**
 * A small standing label: a state, a tag, a count. It says what something is rather than doing
 * anything, so anything that acts on a press belongs in a BlueButton instead.
 */
const props = defineProps<{
  /** The text. A default slot takes its place when given. */
  label?: string
  /** 'tonal' (default) is a fill of the colour at low alpha, 'filled' the colour itself. */
  variant?: 'tonal' | 'filled' | 'outlined'
  /** Any CSS colour, or one of the standard meanings. */
  color?: 'success' | 'error' | 'warning' | 'info' | 'neutral' | string
  /** An mdi name before the text. */
  icon?: string
  /** Offers a cross that emits close. */
  closable?: boolean
  size?: 'small' | 'regular'
}>()

defineEmits<{
  (event: 'close'): void
}>()

const MEANING: Record<string, string> = {
  success: '#66BB6A',
  error: '#EF5350',
  warning: '#FFB74D',
  info: '#42A5F5',
  neutral: '#90A4AE',
}

const tone = computed(() => MEANING[props.color ?? 'neutral'] ?? props.color ?? MEANING.neutral)

const filled = computed(() => props.variant === 'filled')

// A tonal chip is the tone at a tenth of itself, which reads as a tint of the surface rather than
// as something sitting on top of it. Colour-mix rather than an alpha suffix, since the tone may
// arrive as any CSS colour, including a variable.
const look = computed(() => ({
  color: filled.value ? '#ffffff' : tone.value,
  backgroundColor: filled.value ? tone.value : props.variant === 'outlined' ? 'transparent' : `color-mix(in srgb, ${tone.value} 18%, transparent)`,
  borderColor: props.variant === 'outlined' ? tone.value : 'transparent',
}))
</script>

<template>
  <span
    class="inline-flex max-w-full shrink-0 items-center gap-1 whitespace-nowrap rounded-full border"
    :class="size === 'small' ? 'h-[18px] px-2 text-[11px]' : 'h-[22px] px-[10px] text-[12px]'"
    :style="look"
  >
    <BlueIcon
      v-if="icon"
      :name="icon"
      :size="size === 'small' ? 12 : 14"
    />
    <span class="min-w-0 truncate">
      <slot>{{ label }}</slot>
    </span>
    <button
      v-if="closable"
      type="button"
      class="-mr-1 cursor-pointer opacity-70 transition-opacity hover:opacity-100"
      :aria-label="`Remove ${label}`"
      @click="$emit('close')"
    >
      <BlueIcon
        name="mdi-close"
        :size="size === 'small' ? 12 : 14"
      />
    </button>
  </span>
</template>
