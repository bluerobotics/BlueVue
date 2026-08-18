<script setup lang="ts">
import { computed } from 'vue'

import BlueIcon from './BlueIcon.vue'
import BlueTooltip from './BlueTooltip.vue'

/**
 * A BlueInput with room for several lines: the same well cut into the panel, for a note, a
 * description, or a block of parameters pasted in.
 */
const props = defineProps<{
  modelValue: string | null
  /** Label above the field, since a multi-line field beside its label leaves the label floating. */
  label?: string
  /** Name and id, tying the label to the field. */
  name?: string
  placeholder?: string
  /** Lines of room it starts with (default 4). */
  rows?: number
  /** Grows with its content instead of scrolling, up to maxRows. */
  autoGrow?: boolean
  /** How far autoGrow goes before the field starts scrolling (default 12). */
  maxRows?: number
  disabled?: boolean
  /** Validation messages, which also outline the field. */
  errorMessages?: string[]
  /** A hint behind an info icon beside the label. */
  infoTooltip?: string
  width?: string
  theme?: 'light' | 'dark'
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const hasError = computed(() => (props.errorMessages?.length ?? 0) > 0)

// A grown field is as tall as its content, which is the line count it would need, capped so a
// pasted log does not push the rest of the panel off the page.
const rows = computed(() => {
  if (!props.autoGrow) return props.rows ?? 4
  const lines = (props.modelValue ?? '').split('\n').length
  return Math.min(Math.max(lines, props.rows ?? 4), props.maxRows ?? 12)
})
</script>

<template>
  <div
    class="flex w-full min-w-0 flex-col"
    :style="{ width }"
  >
    <div
      v-if="label"
      class="mb-1 flex items-center gap-2"
    >
      <label
        :for="name"
        class="min-w-0 truncate text-[13px]"
        :class="[theme === 'dark' ? 'text-white' : 'text-black', disabled ? 'opacity-30' : '']"
      >{{ label }}</label>
      <BlueTooltip
        v-if="infoTooltip"
        :text="infoTooltip"
        :theme="theme"
        class="items-center"
      >
        <BlueIcon
          name="mdi-information-outline"
          :size="16"
          :label="infoTooltip"
          class="cursor-help"
          :class="disabled ? 'opacity-30' : 'opacity-60'"
        />
      </BlueTooltip>
    </div>

    <textarea
      :id="name"
      :name="name"
      :rows="rows"
      :value="modelValue ?? ''"
      :placeholder="placeholder"
      :disabled="disabled"
      class="bluevue-inset-1 w-full resize-y rounded-[6px] px-3 py-2 text-sm outline-none transition-colors focus:outline focus:outline-2 focus:outline-offset-0 focus:outline-[var(--bluevue-accent)]"
      :class="[
        theme === 'dark' ? 'bg-[#ffffff11] text-white placeholder:text-[#ffffff55]' : 'bg-[#00000008] text-black placeholder:text-[#00000055]',
        disabled ? 'pointer-events-none opacity-30' : '',
        hasError ? 'outline outline-2 outline-[var(--bluevue-error)]' : '',
      ]"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />

    <span
      v-for="message in errorMessages ?? []"
      :key="message"
      class="mt-1 text-[11px] text-[var(--bluevue-error)]"
    >
      {{ message }}
    </span>
  </div>
</template>
