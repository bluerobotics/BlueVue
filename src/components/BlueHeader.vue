<template>
  <header
    class="flex w-full items-center justify-between rounded-t-[8px]"
    :class="isDark ? 'text-white' : 'text-black'"
    :style="{ minHeight: height || '56px', backgroundColor: background || defaultBackground }"
  >
    <!-- The rule runs under the whole cluster rather than under the selector alone, so the subject
         of the panel reads as one field however many controls make it up. -->
    <div
      class="flex min-w-0 items-center gap-3 self-stretch border-b border-solid pl-4"
      :class="[leadingWidth ? '' : 'flex-1', isDark ? 'border-[#ffffff88]' : 'border-[#00000066]']"
      :style="leadingWidth ? { width: leadingWidth, maxWidth: '100%' } : undefined"
    >
      <slot name="leading" />
    </div>
    <div class="flex shrink-0 items-center gap-2 pr-4">
      <slot />
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * The bar a panel opens with: what the panel is about on the left, and the controls that act on it
 * on the right. It only lays the two out, so the subject can be a BlueHeaderSelector, a title, or
 * anything else the panel names itself by.
 */
const props = defineProps<{
  /** How tall the bar may not go under (default '56px'). */
  height?: string
  /** Caps the leading cluster, so a long name cannot push the controls off the bar. */
  leadingWidth?: string
  /** Overrides the bar's own fill. */
  background?: string
  theme?: 'light' | 'dark'
}>()

const isDark = computed(() => props.theme !== 'light')
const defaultBackground = computed(() => (isDark.value ? '#15151577' : '#00000008'))
</script>
