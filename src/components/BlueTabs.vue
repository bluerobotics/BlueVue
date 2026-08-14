<script setup lang="ts">
import BlueChip from './BlueChip.vue'
import BlueIcon from './BlueIcon.vue'

/** One tab in the strip. */
export interface BlueTab {
  /** What comes back through v-model when it is chosen. */
  value: string | number
  label: string
  icon?: string
  disabled?: boolean
  /** A count beside the label, such as how many things the tab holds. */
  badge?: string | number
}

/**
 * The strip that switches between the pages of a view. It reports which tab is current and
 * nothing else: what each one shows is the consumer's, since a tab that renders its page only
 * when it is current is what keeps the ones behind it from doing work.
 */
defineProps<{
  modelValue: string | number
  tabs: BlueTab[]
  /** Fills the width it is given, each tab taking an equal share. */
  stretch?: boolean
  theme?: 'light' | 'dark'
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | number): void
}>()
</script>

<template>
  <div
    class="flex items-stretch gap-1 border-b"
    :class="theme === 'light' ? 'border-[#00000014]' : 'border-[#ffffff14]'"
    role="tablist"
  >
    <button
      v-for="tab in tabs"
      :key="tab.value"
      type="button"
      role="tab"
      :aria-selected="modelValue === tab.value"
      :disabled="tab.disabled"
      class="relative flex items-center justify-center gap-2 whitespace-nowrap px-3 pb-2 pt-[6px] text-[13px] font-medium transition-colors"
      :class="[
        stretch ? 'flex-1' : '',
        tab.disabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer',
        modelValue === tab.value
          ? theme === 'light' ? 'text-black' : 'text-white'
          : theme === 'light' ? 'text-[#00000088] hover:text-black' : 'text-[#ffffff88] hover:text-white',
      ]"
      @click="emit('update:modelValue', tab.value)"
    >
      <BlueIcon
        v-if="tab.icon"
        :name="tab.icon"
        :size="16"
      />
      <span class="min-w-0 truncate">{{ tab.label }}</span>
      <BlueChip
        v-if="tab.badge !== undefined"
        size="small"
        :label="String(tab.badge)"
      />

      <!-- The underline sits on the strip's own border rather than beside it, so the current tab
           reads as continuous with what it opens onto. -->
      <span
        v-if="modelValue === tab.value"
        class="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[var(--bluevue-accent)]"
      />
    </button>
  </div>
</template>
