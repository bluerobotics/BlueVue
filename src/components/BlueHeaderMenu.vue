<template>
  <BlueMenu
    :model-value="isOpen"
    :items="items"
    @update:model-value="(value: boolean) => (isOpen = value)"
  >
    <template #activator="{ props: activatorProps }">
      <button
        v-bind="activatorProps"
        type="button"
        :disabled="disabled"
        :title="tooltip"
        :aria-label="tooltip"
        class="flex shrink-0 items-center justify-center rounded-[6px] transition-colors"
        :class="[
          disabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer',
          isDark ? 'text-[#ffffffcc] hover:text-white' : 'text-[#000000cc] hover:text-black',
        ]"
        :style="{ width: `${size}px`, height: `${size}px` }"
      >
        <span
          class="mdi leading-none"
          :class="isOpen ? 'mdi-menu-open' : 'mdi-menu-close'"
          :style="{ fontSize: `${size}px` }"
        />
      </button>
    </template>
  </BlueMenu>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import BlueMenu, { type BlueMenuItem } from './BlueMenu.vue'

/**
 * The actions a header offers, behind the glyph that turns as they open. Sized for a header rather
 * than for a row, which is why it is not an icon BlueButton.
 */
const props = defineProps<{
  items: BlueMenuItem[]
  /** Edge of the square the glyph fills, in pixels (default 24). */
  iconSize?: number
  /** Hover text, and the name assistive technology reads. */
  tooltip?: string
  disabled?: boolean
  theme?: 'light' | 'dark'
}>()

const isOpen = ref(false)
const isDark = computed(() => props.theme !== 'light')
const size = computed(() => props.iconSize ?? 24)
</script>
