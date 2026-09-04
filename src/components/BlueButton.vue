<script setup lang="ts">
import { computed } from 'vue'

import BlueIcon from './BlueIcon.vue'
import BlueSpinner from './BlueSpinner.vue'

/**
 * The standard action. A button with no colour of its own is a secondary action and reads as a
 * barely-there fill; the filled one is what the panel is actually asking to be done, and a panel
 * asks for one thing at a time.
 */
const props = defineProps<{
  /**
   * 'tonal' (default) for a secondary action, 'filled' for the one the panel is asking for,
   * 'text' for a quiet one, 'icon' for a glyph on its own.
   */
  variant?: 'tonal' | 'filled' | 'text' | 'icon'
  /** The fill of a filled button, and the glyph colour of the others (default the primary token). */
  color?: string
  /** Height and inset (default 'regular', which is the height of a button group beside it). */
  density?: 'compact' | 'regular' | 'comfortable'
  /** An mdi name before the label, or the whole of an icon button. */
  icon?: string
  /** An mdi name after the label. */
  appendIcon?: string
  /** Swaps the icon for a spinner and takes the button out of reach until it is done. */
  loading?: boolean
  disabled?: boolean
  /** Takes the whole width it is given, for a button ending a narrow panel. */
  block?: boolean
  /**
   * Shadow depth, 1 (a hair off the surface) to 5. Chips default to 1; text and icon buttons have
   * no chip to lift, so they default to none. A disabled button is never raised.
   */
  elevation?: 1 | 2 | 3 | 4 | 5
  /** Hover text, and the name assistive technology reads on an icon button. */
  tooltip?: string
  theme?: 'light' | 'dark'
  type?: 'button' | 'submit' | 'reset'
}>()

defineEmits<{
  (event: 'click', value: MouseEvent): void
}>()

const HEIGHT = { compact: 24, regular: 30, comfortable: 36 } as const
const PADDING = { compact: 'px-2', regular: 'px-3', comfortable: 'px-4' } as const

const variant = computed(() => props.variant ?? 'tonal')
const density = computed(() => props.density ?? 'regular')
const isDark = computed(() => props.theme !== 'light')
const height = computed(() => HEIGHT[density.value])
const glyphSize = computed(() => (density.value === 'compact' ? 14 : 16))

// A filled or tonal button reads as a chip, so out of reach it becomes a flat grey one. A text or
// icon button has no chip to grey, and fading it is the whole of the statement.
const look = computed(() => {
  if (props.disabled) {
    return variant.value === 'text' || variant.value === 'icon'
      ? 'opacity-30 cursor-not-allowed'
      : 'opacity-30 cursor-not-allowed bg-[#9e9e9e80] text-[#afafaf]'
  }
  switch (variant.value) {
    case 'filled':
      return 'cursor-pointer text-white hover:brightness-125'
    case 'text':
      return isDark.value
        ? 'cursor-pointer text-[#ffffffcc] hover:bg-[#ffffff11] hover:text-white'
        : 'cursor-pointer text-[#000000cc] hover:bg-[#00000011] hover:text-black'
    case 'icon':
      return isDark.value
        ? 'cursor-pointer text-[#ffffffaa] hover:text-white'
        : 'cursor-pointer text-[#00000099] hover:text-black'
    default:
      return isDark.value
        ? 'cursor-pointer bg-[#ffffff11] text-white hover:bg-[#ffffff22]'
        : 'cursor-pointer bg-[#00000011] text-black hover:bg-[#00000022]'
  }
})

const fill = computed(() => (variant.value === 'filled' && !props.disabled ? props.color || 'var(--bluevue-primary)' : undefined))

const ELEVATION = {
  1: 'bluevue-elevation-1',
  2: 'bluevue-elevation-2',
  3: 'bluevue-elevation-3',
  4: 'bluevue-elevation-4',
  5: 'bluevue-elevation-5',
} as const

const elevationClass = computed(() => {
  if (props.disabled) return ''
  const hasChip = variant.value === 'filled' || variant.value === 'tonal'
  const level = props.elevation ?? (hasChip ? 1 : 0)
  return level ? ELEVATION[level] : ''
})

// The glyph of a text or icon button follows the colour it was given; a filled one draws its
// contents in white over the fill, and a tonal one in the theme's own text colour.
const glyphColor = computed(() =>
  props.color && (variant.value === 'text' || variant.value === 'icon') ? props.color : undefined
)
</script>

<template>
  <button
    :type="type || 'button'"
    :disabled="disabled"
    :title="tooltip"
    :aria-label="variant === 'icon' ? tooltip : undefined"
    :aria-busy="loading || undefined"
    class="inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap transition-colors duration-200"
    :class="[
      look,
      variant === 'icon' ? 'rounded-[6px]' : 'rounded-[4px]',
      variant === 'icon' ? '' : PADDING[density],
      block ? 'w-full' : '',
      elevationClass,
      // A button waiting on its own result stays where it is and reads as busy rather than
      // inviting a second press.
      loading ? 'pointer-events-none' : '',
    ]"
    :style="{
      height: `${height}px`,
      width: variant === 'icon' ? `${height}px` : undefined,
      backgroundColor: fill,
    }"
    @click="$emit('click', $event)"
  >
    <BlueSpinner
      v-if="loading"
      :size="glyphSize"
      :color="variant === 'filled' ? '#ffffff' : undefined"
    />
    <BlueIcon
      v-else-if="icon"
      :name="icon"
      :size="glyphSize"
      :color="glyphColor"
    />
    <span
      v-if="variant !== 'icon'"
      class="min-w-0 truncate font-medium uppercase tracking-wide"
      :class="density === 'compact' ? 'text-[12px]' : 'text-[13px]'"
    >
      <slot />
    </span>
    <BlueIcon
      v-if="appendIcon && variant !== 'icon'"
      :name="appendIcon"
      :size="glyphSize"
      :color="glyphColor"
    />
  </button>
</template>
