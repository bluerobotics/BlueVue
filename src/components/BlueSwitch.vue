<template>
  <div class="flex w-full justify-between items-center">
    <!-- shrink-0 keeps the label at its natural width: letting flex shrink it by the fraction
         of a pixel that rounding introduces is enough for Chromium to ellipsize a label that
         fits. The cap is what makes an outsized label ellipsize instead of eating the row. -->
    <div
      v-if="label"
      class="min-w-0 max-w-[45%] shrink-0"
    >
      <label
        class="block truncate text-start mr-6"
        :title="label"
        :class="[theme === 'dark' ? 'text-white' : 'text-black', disabled ? 'opacity-30' : '']"
      >{{ label }}</label>
    </div>
    <div class="flex items-center min-w-0 shrink-[1000]">
      <BlueTooltip
        v-if="infoTooltip"
        :text="infoTooltip"
        :theme="theme"
        class="items-center shrink-0 mr-2"
      >
        <BlueIcon
          name="mdi-information-outline"
          :size="16"
          :label="infoTooltip"
          class="cursor-help"
          :class="[disabled ? 'opacity-30' : 'opacity-60', theme === 'dark' ? 'text-white' : 'text-black']"
        />
      </BlueTooltip>
      <!-- Both labels are laid out rather than drawn over: two equal columns take their width
           from the longer of the two, so the track grows to whatever it has to say and the knob
           covering either side has the same room. -->
      <div
        name="switch-track"
        class="relative grid grid-cols-2 rounded-[8px] bluevue-elevation-1 cursor-pointer overflow-hidden"
        :class="[theme === 'dark' ? 'bg-[#464646AA]' : 'bg-[#00000011]', disabled ? 'opacity-30 cursor-not-allowed' : '']"
        :style="{ minWidth: width || '75px', height: height || '30px' }"
        @click="toggleSwitch"
      >
        <div
          class="absolute top-[4px] bottom-[4px] w-[calc(50%-4px)] rounded-[8px] bluevue-elevation-1 transition-all duration-300"
          :style="{
            left: modelValue ? 'calc(50% + 2px)' : '2px',
            backgroundColor: modelValue ? color || 'var(--bluevue-primary)' : '#777777',
          }"
        />
        <!-- 9px, of which the knob's 2px inset takes the first two: what is left is the 7px the
             label keeps from the knob's edge. -->
        <span
          class="relative flex items-center justify-center px-[9px] text-[14px] whitespace-nowrap pointer-events-none transition-opacity duration-300"
          :class="labelClass(!modelValue)"
        >
          {{ labelOff || 'Off' }}
        </span>
        <span
          class="relative flex items-center justify-center px-[9px] text-[14px] whitespace-nowrap pointer-events-none transition-opacity duration-300"
          :class="labelClass(modelValue)"
        >
          {{ labelOn || 'On' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import BlueIcon from './BlueIcon.vue'
import BlueTooltip from './BlueTooltip.vue'

const props = defineProps<{
  /** Color of the switch's knob when it is on. */
  color?: string
  /** The current value of the switch. */
  modelValue: boolean | null
  /** Whether the switch is disabled. */
  disabled?: boolean
  /** Height of the switch container. */
  height?: string
  /** Label on the left side of the component. */
  label?: string
  /** Optional info tooltip shown via an info icon next to the control. */
  infoTooltip?: string
  /** Custom text for the switch when it is on. */
  labelOn?: string
  /** Custom text for the switch when it is off. */
  labelOff?: string
  /** Name of the component's container. */
  name: string
  /** Theme of the component. */
  theme?: 'light' | 'dark'
  /** Minimum width of the container. */
  width?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const modelValue = ref(props.modelValue || false)

// The label the knob sits under is white against its fill; the other one stays as a dim
// reminder of what the far position says.
const labelClass = (active: boolean): string[] =>
  active ? ['text-white'] : ['opacity-20', props.theme === 'dark' ? 'text-white' : 'text-black']

const toggleSwitch = (): void => {
  if (props.disabled) return
  modelValue.value = !modelValue.value
  emit('update:modelValue', modelValue.value)
}

watch(
  () => props.modelValue,
  (v) => (modelValue.value = v ?? false),
  { immediate: true }
)
</script>
