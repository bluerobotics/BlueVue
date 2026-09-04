<script setup lang="ts">
import { computed } from 'vue'

import BlueIcon from './BlueIcon.vue'
import BlueTooltip from './BlueTooltip.vue'

/**
 * A plain yes or no, laid out as the other controls are: what it is on the left, the box on the
 * right. A native checkbox drives it, so it is reached and toggled from the keyboard as one.
 */
const props = defineProps<{
  modelValue: boolean | null
  /** Label on the left of the row. */
  label?: string
  /** Name and id, tying the label to the box. */
  name: string
  /** Neither on nor off, for a box standing for several things that disagree. */
  indeterminate?: boolean
  disabled?: boolean
  /** The fill when it is on (default the primary token). */
  color?: string
  /** A hint behind an info icon beside the box. */
  infoTooltip?: string
  theme?: 'light' | 'dark'
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

const checked = computed(() => props.modelValue === true)

const toggle = (): void => {
  if (props.disabled) return
  // An indeterminate box is answering for several things at once, and the answer it takes is yes.
  emit('update:modelValue', props.indeterminate ? true : !checked.value)
}
</script>

<template>
  <div class="flex w-full items-center justify-between">
    <label
      v-if="label"
      :for="name"
      class="min-w-0 max-w-[45%] shrink-0 truncate text-start mr-6"
      :title="label"
      :class="[theme === 'dark' ? 'text-white' : 'text-black', disabled ? 'opacity-30' : 'cursor-pointer']"
    >{{ label }}</label>
    <div v-else />

    <div class="ml-auto flex shrink-0 items-center">
      <BlueTooltip
        v-if="infoTooltip"
        :text="infoTooltip"
        :theme="theme"
        class="items-center mr-2"
      >
        <BlueIcon
          name="mdi-information-outline"
          :size="16"
          :label="infoTooltip"
          class="cursor-help"
          :class="[disabled ? 'opacity-30' : 'opacity-60', theme === 'dark' ? 'text-white' : 'text-black']"
        />
      </BlueTooltip>

      <!-- The native box is the control; the square beside it is what is actually seen, and the
           two are one element to the pointer and to the keyboard because the label wraps both. -->
      <label
        class="relative inline-flex items-center"
        :class="disabled ? 'opacity-30' : 'cursor-pointer'"
      >
        <input
          :id="name"
          type="checkbox"
          class="peer absolute h-0 w-0 opacity-0"
          :name="name"
          :checked="checked"
          :disabled="disabled"
          :aria-checked="indeterminate ? 'mixed' : checked"
          @change="toggle"
        >
        <span
          class="bluevue-elevation-1 flex h-[18px] w-[18px] items-center justify-center rounded-[4px] border transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--bluevue-accent)]"
          :class="[
            checked || indeterminate ? 'border-transparent' : theme === 'dark' ? 'border-[#ffffff44] bg-[#00000022]' : 'border-[#00000044] bg-white',
          ]"
          :style="{ backgroundColor: checked || indeterminate ? color || 'var(--bluevue-primary)' : undefined }"
        >
          <BlueIcon
            v-if="checked || indeterminate"
            :name="indeterminate ? 'mdi-minus' : 'mdi-check'"
            :size="14"
            color="#ffffff"
          />
        </span>
      </label>
    </div>
  </div>
</template>
