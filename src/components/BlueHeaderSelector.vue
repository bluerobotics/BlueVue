<template>
  <div
    ref="anchorRef"
    class="min-w-0 flex-1"
  >
    <button
      v-bind="activatorProps"
      type="button"
      :disabled="disabled"
      class="group relative flex h-[56px] w-full min-w-0 flex-col justify-center bg-transparent pr-8 pl-4 text-left transition-colors"
      :class="[
        disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
        isDark ? 'hover:bg-[#ffffff08]' : 'hover:bg-[#00000008]',
      ]"
    >
      <span
        v-if="label"
        class="block truncate text-[12px] leading-none"
        :class="isDark ? 'text-[#ffffffb3]' : 'text-[#00000099]'"
      >{{ label }}</span>
      <span
        class="mt-[6px] flex min-w-0 items-center gap-1 text-[16px] leading-none"
        :class="isDark ? 'text-white' : 'text-black'"
      >
        <span
          v-if="selectedItem?.icon"
          class="mdi shrink-0 text-[16px] leading-none opacity-70"
          :class="selectedItem.icon"
        />
        <span class="truncate">{{ selectedItem?.name ?? placeholder }}</span>
      </span>
      <span
        class="mdi mdi-menu-down absolute right-2 top-1/2 -translate-y-1/2 text-[24px] leading-none transition-transform"
        :class="[isDark ? 'text-[#ffffffb3]' : 'text-[#00000099]', isOpen ? 'rotate-180' : '']"
      />
    </button>

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
          isDark ? 'bg-[var(--bluevue-surface)]' : 'bg-white',
          isPositioned ? 'opacity-100' : 'opacity-0',
        ]"
      >
        <li
          v-for="item in items"
          :key="String(item.value ?? item.name)"
        >
          <button
            type="button"
            :disabled="item.disabled"
            class="flex w-full items-start gap-2 px-4 py-2 text-left"
            :class="[
              isDark ? 'text-white' : 'text-black',
              item.disabled
                ? 'cursor-not-allowed opacity-30'
                : isDark ? 'cursor-pointer hover:bg-[#ffffff11]' : 'cursor-pointer hover:bg-gray-100',
            ]"
            @click="selectItem(item)"
          >
            <span
              v-if="item.icon"
              class="mdi mt-[2px] shrink-0 text-[16px] leading-none opacity-70"
              :class="item.icon"
            />
            <span class="min-w-0">
              <span class="block truncate text-[14px] leading-snug">{{ item.name }}</span>
              <span
                v-if="item.subtitle"
                class="block truncate text-[11px]"
                :class="isDark ? 'text-[#ffffff66]' : 'text-[#00000066]'"
              >{{ item.subtitle }}</span>
            </span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useBluePopover } from '../composables/useBluePopover'

/**
 * One choice in the header selector.
 */
export interface BlueHeaderSelectorItem {
  /** What the row reads. */
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any
  /** An mdi class marking the row, such as one still being looked for. */
  icon?: string
  /** A second line under the name, for what the row is rather than what it is called. */
  subtitle?: string
  disabled?: boolean
}

/**
 * The subject a header is about, named above the value the way a filled form field is, so the
 * heading and the choice occupy one control instead of a label and a dropdown side by side.
 */
const props = defineProps<{
  items: BlueHeaderSelectorItem[]
  /** The name above the value. */
  label?: string
  /** Stands in for the value until something is chosen. */
  placeholder?: string
  disabled?: boolean
  theme?: 'light' | 'dark'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modelValue?: any
}>()

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'update:modelValue', value: any): void
}>()

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

const isDark = computed(() => props.theme !== 'light')

const selectedItem = computed(() =>
  props.items.find((item) => (item.value ?? item.name) === props.modelValue)
)

const selectItem = (item: BlueHeaderSelectorItem): void => {
  if (item.disabled) return
  hide()
  emit('update:modelValue', item.value ?? item.name)
}
</script>
