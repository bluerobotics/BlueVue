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
      >
        {{ label }}
      </label>
    </div>
    <div v-else />
    <slot name="insetElement" />

    <BlueTooltip
      v-if="infoTooltip"
      :text="infoTooltip"
      :theme="theme"
      class="items-center shrink-0 mr-2 ml-auto"
    >
      <BlueIcon
        name="mdi-information-outline"
        :size="16"
        :label="infoTooltip"
        class="opacity-60 cursor-help"
        :class="theme === 'dark' ? 'text-white' : 'text-black'"
      />
    </BlueTooltip>

    <div class="flex flex-col items-end min-w-0 shrink-[1000]">
      <button
        ref="anchorRef"
        v-bind="activatorProps"
        type="button"
        :disabled="disabled"
        class="relative inline-flex items-center justify-between pl-4 rounded-[6px] bluevue-elevation-1 min-w-[90px] max-w-full"
        :class="[
          disabled ? 'opacity-30' : 'cursor-pointer',
          hasError ? 'border-2 border-solid border-[var(--bluevue-error)]' : ''
        ]"
        :style="{ height: height || '30px', width: width || 'auto', backgroundColor: closedBackground }"
      >
        <span
          class="text-sm font-medium truncate min-w-0 mr-1 -mb-[1px]"
          :class="selectedTextClass"
        >
          {{ !multiSelect ? selectedItem.name : selectedValues.length > 0 ? selectedValues.join(', ') : 'Select...' }}
        </span>
        <span
          class="mdi mdi-menu-down text-[24px] leading-none shrink-0 transition-transform"
          :class="[iconClass, isOpen ? 'rotate-180' : '']"
        />
      </button>
      <div
        v-if="hasError"
        class="text-[14px] text-[var(--bluevue-error)]"
      >
        {{ (errorMessages?.[0]) || '' }}
      </div>
    </div>

    <div
      :id="popoverId"
      ref="popoverRef"
      popover
      class="bluevue-popover"
      :style="floatingStyles"
      @toggle="onToggle"
    >
      <ul
        class="bluevue-elevation-5 max-h-[60vh] overflow-y-auto rounded-[4px] border border-[#FFFFFF22]"
        :class="[
          theme === 'dark' ? 'bg-[var(--bluevue-surface)]' : 'bg-white',
          isPositioned ? 'opacity-100' : 'opacity-0',
        ]"
      >
        <li
          v-for="(opt, idx) in items"
          :key="opt.name"
        >
          <button
            type="button"
            :disabled="disabled || opt.disabled"
            class="flex w-full items-center justify-between gap-2 whitespace-nowrap px-4 py-2 text-left text-sm"
            :class="[
              itemTextClass(opt),
              disabled || opt.disabled
                ? 'cursor-not-allowed'
                : theme === 'dark' ? 'cursor-pointer hover:bg-[#ffffff11]' : 'cursor-pointer hover:bg-gray-100',
            ]"
            @click="selectOption(idx)"
          >
            <span
              class="mdi mdi-check text-[16px] leading-none"
              :class="selectedValues.includes(opt.value || opt.name) ? '' : 'invisible'"
            />
            {{ opt.name }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { useBluePopover } from '../composables/useBluePopover'
import BlueIcon from './BlueIcon.vue'
import BlueTooltip from './BlueTooltip.vue'

/**
 * Option in the select
 */
interface OptionItem {
  /**
   * Name of the option to display
   */
  name: string
  /**
   * Value of the option, if not provided, name will be used
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any
  /**
   * Whether the option is disabled
   */
  disabled?: boolean
  /**
   * Callback when the option is selected
   */
  onSelected?: () => void
}

const props = defineProps<{
  /** Options to select from */
  items: OptionItem[]
  /** Disable entire select */
  disabled?: boolean
  /** light or dark theme */
  theme?: 'light' | 'dark'
  /** Label on the left */
  label?: string
  /** Optional info tooltip shown via an info icon next to the control. */
  infoTooltip?: string
  /** Control height */
  height?: string
  /** Control width */
  width?: string
  /** Multiple values selection */
  multiSelect?: boolean
  /** Model value for v-model */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modelValue?: any
  /** Error messages, used to give feedback from validators */
  errorMessages?: string[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | (string | number)[]): void
}>()

const selectedValues = ref<(string | number)[]>([])
const selectedItem = ref<OptionItem>({ name: 'Select...' })

const {
  anchorRef,
  popoverRef,
  popoverId,
  activatorProps,
  isOpen,
  isPositioned,
  floatingStyles,
  hide,
  onToggle,
} = useBluePopover({ matchAnchorWidth: true })

const hasError = computed(() =>
  props.errorMessages && props.errorMessages.length > 0
)

// Applied inline because the activator is a <button>, and a host reset that is unlayered, as
// Vuetify's is, sets button { background-color: transparent } and beats any Tailwind utility
// for it: utilities sit in a cascade layer, and unlayered rules win over layered ones outright.
const closedBackground = computed(() => (props.theme === 'dark' ? '#FFFFFF05' : '#00000011'))

const selectOption = (index: number) => {
  if (props.multiSelect) {
    const value = props.items[index].value || props.items[index].name
    const idx = selectedValues.value.indexOf(value)
    if (idx > -1) {
      selectedValues.value.splice(idx, 1)
    } else {
      selectedValues.value.push(value)
    }
    emit('update:modelValue', selectedValues.value)
  } else {
    const value = props.items[index].value || props.items[index].name
    selectedItem.value = props.items[index]
    emit('update:modelValue', value)
    // Picking one of several closes the list; ticking one of many leaves it up for the next tick.
    hide()
  }
}

const iconClass = computed(() => (props.theme === 'dark' ? 'text-white' : 'text-black'))
const selectedTextClass = computed(() => (props.theme === 'dark' ? 'text-white' : 'text-black'))

/**
 * Returns the class for the item text based on the option and props
 * @param opt
 */
function itemTextClass(opt: OptionItem) {
  if (opt.disabled || props.disabled) return 'text-gray-500'
  return props.theme === 'dark' ? 'text-white' : 'text-black'
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (!props.multiSelect) {
      const found = props.items.find(item =>
        item.value !== undefined ? item.value === newVal : item.name === newVal
      )
      selectedItem.value = found ?? { name: 'Select...' }
    } else if (Array.isArray(newVal)) {
      selectedValues.value = newVal
    }
  },
  { immediate: true }
)
</script>
