<script setup lang="ts">
import BlueIcon from './BlueIcon.vue'
import BlueTooltip from './BlueTooltip.vue'

/** One of the choices in the group. */
export interface BlueRadioItem {
  label: string
  value: string | number
  disabled?: boolean
  /** Why the choice is what it sounds like, or why it is out of reach. */
  hint?: string
}

/**
 * One choice out of a few, each spelled out. Where a BlueButtonGroup packs the options into a
 * track, this gives every one of them a line of its own, which is what a choice needing an
 * explanation apiece wants.
 */
defineProps<{
  modelValue: string | number | null
  items: BlueRadioItem[]
  /** Name of the group, which is what makes the choices exclusive. */
  name: string
  /** Label above the choices. */
  label?: string
  /** Lays the choices out along a row instead of down a column. */
  inline?: boolean
  disabled?: boolean
  theme?: 'light' | 'dark'
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | number): void
}>()
</script>

<template>
  <fieldset
    class="w-full min-w-0"
    :class="disabled ? 'opacity-30' : ''"
  >
    <legend
      v-if="label"
      class="mb-2 text-[13px]"
      :class="theme === 'dark' ? 'text-white' : 'text-black'"
    >
      {{ label }}
    </legend>

    <div
      class="flex"
      :class="inline ? 'flex-wrap items-center gap-x-5 gap-y-2' : 'flex-col gap-2'"
    >
      <label
        v-for="item in items"
        :key="item.value"
        class="flex items-center gap-2"
        :class="[
          disabled || item.disabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer',
          theme === 'dark' ? 'text-white' : 'text-black',
        ]"
      >
        <input
          type="radio"
          class="peer absolute h-0 w-0 opacity-0"
          :name="name"
          :value="item.value"
          :checked="modelValue === item.value"
          :disabled="disabled || item.disabled"
          @change="emit('update:modelValue', item.value)"
        >
        <!-- The dot is drawn rather than left to the platform, which paints a radio in its own
             light colours whatever the surface around it is. -->
        <span
          class="flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full border transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--bluevue-accent)]"
          :class="modelValue === item.value
            ? 'border-[var(--bluevue-primary)]'
            : theme === 'dark' ? 'border-[#ffffff44]' : 'border-[#00000044]'"
        >
          <span
            v-if="modelValue === item.value"
            class="h-[8px] w-[8px] rounded-full bg-[var(--bluevue-primary)]"
          />
        </span>

        <span class="min-w-0 truncate text-[13px]">{{ item.label }}</span>

        <BlueTooltip
          v-if="item.hint"
          :text="item.hint"
          :theme="theme"
          class="items-center"
        >
          <BlueIcon
            name="mdi-information-outline"
            :size="14"
            :label="item.hint"
            class="opacity-60"
          />
        </BlueTooltip>
      </label>
    </div>
  </fieldset>
</template>
