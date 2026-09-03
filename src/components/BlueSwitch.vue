<template>
  <div class="flex w-full justify-between items-center">
    <!-- No cap: the control beside it yields a thousand times more readily, so the label keeps its
         full text until the track is down to its own minimum, and only then does it ellipsize. -->
    <div
      v-if="label"
      class="min-w-0"
    >
      <label
        :id="labelId"
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
      <!-- The knob carries the state's own name and slides over a track that only says what the
           other position would be, so the switch reads as one word rather than two competing ones. -->
      <div
        name="switch-track"
        role="switch"
        :aria-labelledby="label ? labelId : undefined"
        :aria-label="label ? undefined : name"
        :aria-checked="modelValue"
        :aria-disabled="disabled === true"
        :tabindex="disabled ? -1 : 0"
        class="relative inline-grid shrink-0 grid-cols-[1fr_1fr] rounded-[8px] bluevue-elevation-1 cursor-pointer overflow-hidden"
        :class="[theme === 'dark' ? 'bg-[#464646AA]' : 'bg-[#00000011]', disabled ? 'opacity-30 cursor-not-allowed' : '']"
        :style="{ height: height || '30px' }"
        @click="toggleSwitch"
        @keydown="onSwitchKeydown"
      >
        <!-- The knob has to clear its own word by 5px at either end of its travel, and an absolute
             child cannot tell the track how wide that is. These two carry the knob's own type,
             unseen, so the equal columns measure the longer word and the track is born to fit. -->
        <span
          aria-hidden="true"
          class="invisible whitespace-nowrap px-[7px] text-[14px]"
        >{{ labelOff || 'Off' }}</span>
        <span
          aria-hidden="true"
          class="invisible whitespace-nowrap px-[7px] text-[14px]"
        >{{ labelOn || 'On' }}</span>
        <span
          class="absolute left-[8px] top-1/2 -translate-y-1/2 text-[11px] pointer-events-none"
          :class="trackLabelClass"
        >{{ labelOff || '' }}</span>
        <span
          class="absolute right-[8px] top-1/2 -translate-y-1/2 text-[11px] pointer-events-none"
          :class="trackLabelClass"
        >{{ labelOn || '' }}</span>
        <div
          class="absolute top-[4px] bottom-[4px] left-[4px] flex items-center justify-center whitespace-nowrap rounded-[8px] px-[5px] text-[14px] text-white bluevue-elevation-1 transition-all duration-300 pointer-events-none"
          :style="{
            width: 'calc(50% - 4px)',
            transform: modelValue ? 'translateX(100%)' : 'none',
            backgroundColor: modelValue ? color || 'var(--bluevue-primary)' : '#777777',
          }"
        >
          {{ modelValue ? labelOn || 'On' : labelOff || 'Off' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { nextElementId } from '../utils/id'
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
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const modelValue = ref(props.modelValue || false)
const labelId = nextElementId('switch-label')

const trackLabelClass = computed(() =>
  props.theme === 'dark' ? 'text-[#ffffff44]' : 'text-[#00000066]'
)

const toggleSwitch = (): void => {
  if (props.disabled) return
  modelValue.value = !modelValue.value
  emit('update:modelValue', modelValue.value)
}

// The track is a div, so the keys a native checkbox would answer to have to be handled here.
const onSwitchKeydown = (event: KeyboardEvent): void => {
  if (props.disabled) return
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  toggleSwitch()
}

watch(
  () => props.modelValue,
  (v) => (modelValue.value = v ?? false),
  { immediate: true }
)
</script>
