<template>
  <div
    ref="rowRef"
    class="flex w-full justify-between items-center"
  >
    <!-- shrink-0 keeps the label at its natural width: letting flex shrink it by the fraction
         of a pixel that rounding introduces is enough for Chromium to ellipsize a label that
         fits. The cap is what makes an outsized label ellipsize instead of eating the row. -->
    <div
      v-if="label"
      class="min-w-0 max-w-[45%] shrink-0"
    >
      <label
        ref="labelRef"
        class="block truncate text-start mr-6"
        :title="label"
        :class="[theme === 'dark' ? 'text-white' : 'text-black', disabled ? 'opacity-30' : '']"
      >{{ label }}</label>
    </div>
    <div v-else />
    <slot name="insetElement" />
    <!-- Shrinks far more eagerly than the label, so a tight row ellipsizes the button names
         before it starts eating into the label. -->
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
      <div
        ref="trackRef"
        class="relative flex min-w-0 justify-end overflow-hidden rounded-[6px] bluevue-elevation-1 z-[666]"
        :class="[theme === 'dark' ? 'bg-[#464646AA]' : 'bg-[#00000011]', disabled ? 'opacity-30 pointer-events-none' : '']"
        :style="{ height: height || (density === 'compact' ? '24px' : '30px') }"
      >
        <div
          id="border-releif"
          class="absolute left-[-20px] top-0 h-full w-[6px] bg-[#6699cc] z-[20] pointer-events-none"
        />
        <template
          v-for="(btn, idx) in buttonItems"
          :key="btn.name"
        >
          <button
            :disabled="disabled || btn.disabled"
            :title="btn.name"
            class="flex min-w-0 items-center justify-center text-sm font-medium transition-colors duration-200"
            :class="[
              // A group with no room left falls back to the tightest inset whatever the
              // density asks for, since the alternative is cutting into the names.
              isTight ? DENSITY_PADDING.compact.class : DENSITY_PADDING[density || 'comfortable'].class,
              // The active choice is the one worth reading at a glance, so it keeps its full
              // name and the rest give up the room a crowded group needs.
              selected[idx] ? 'shrink-0' : '',
              selected[idx] ? 'text-white' : theme === 'dark' ? 'text-[#ffffff99]' : 'text-[#00000066]',
              selected[idx] && type === 'switch' ? 'bluevue-elevation-5' : '',
              disabled || btn.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
              // Only the button's own state fades it: a disabled group is faded whole by the
              // track below, and dimming twice over would leave the names unreadable.
              btn.disabled ? 'opacity-30' : '',
            ]"
            :style="{ backgroundColor: selected[idx] ? btn.activeColor || 'var(--bluevue-primary)' : undefined }"
            @click="onButtonClick(idx)"
            @contextmenu.prevent="requestContextMenu(idx, $event)"
            @pointerdown="startLongPress(idx, $event)"
            @pointerup="cancelLongPress"
            @pointerleave="cancelLongPress"
            @pointercancel="cancelLongPress"
          >
            <BlueTooltip
              :text="btn.tooltip || ''"
              :theme="theme"
              class="min-w-0"
            >
              <!-- A span rather than a paragraph: this is one line inside a button, and a
                   paragraph brings margins of its own wherever the host page has no reset. -->
              <span
                data-bbg-label
                class="block truncate"
                :class="[density === 'compact' ? 'text-[10px]' : 'text-xs', isWide ? 'max-w-[150px]' : '']"
              >
                {{ btn.name }}
              </span>
            </BlueTooltip>
          </button>
          <div
            v-if="idx < buttonItems.length - 1"
            class="w-[1px] shrink-0 bg-[#FFFFFF22] my-2"
          />
        </template>
        <div
          v-if="buttonsMenu?.length"
          class="w-[1px] shrink-0 bg-[#FFFFFF22] my-2 mr-[3px]"
        />
        <template v-if="buttonsMenu?.length">
          <button
            ref="menuAnchorRef"
            v-bind="menuActivatorProps"
            type="button"
            title="More options"
            class="shrink-0 px-0 flex items-center justify-center h-full cursor-pointer"
            :class="theme === 'dark' ? 'text-white' : 'text-black'"
          >
            <span class="self-center mdi mdi-menu-right text-[20px] mr-[2px] opacity-80" />
          </button>
          <div
            :id="menuPopoverId"
            ref="menuPopoverRef"
            popover
            class="bluevue-popover"
            :style="menuFloatingStyles"
            @toggle="onMenuToggle"
          >
            <ul
              class="bluevue-elevation-5 max-h-[60vh] overflow-y-auto border-[1px] rounded-[4px] border-[#FFFFFF22]"
              :class="[
                theme === 'dark' ? 'text-[#FFFFFF99] bg-[var(--bluevue-surface)]' : 'text-black bg-white',
                isMenuPositioned ? 'opacity-100' : 'opacity-0',
              ]"
            >
              <li
                v-for="(item, idx) in buttonsMenu"
                :key="item.name"
              >
                <button
                  :disabled="item.menuItemDisabled"
                  type="button"
                  class="block w-full text-left whitespace-nowrap px-4 py-2 text-[14px]"
                  :class="[
                    idx < buttonsMenu.length - 1 ? 'border-b border-white' : '',
                    theme === 'dark' ? 'hover:bg-[#333333]' : 'hover:bg-gray-100',
                    item.menuItemDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer',
                  ]"
                  @click="runMenuItem(item)"
                >
                  {{ item.name }}
                </button>
              </li>
            </ul>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { useBluePopover } from '../composables/useBluePopover'
import BlueIcon from './BlueIcon.vue'
import BlueTooltip from './BlueTooltip.vue'

/**
 * One button in the group
 */
interface ButtonItem {
  /** Name of the button, displayed as text */
  name: string
  /** Optional tooltip text displayed on hover */
  tooltip?: string
  /** Whether this button is pre-selected (only for 'switch' type) */
  preSelected?: boolean
  /** Optional color for the button when active */
  activeColor?: string
  /** Whether the button is disabled */
  disabled?: boolean
  /** Callback when the button is selected */
  onSelected?: () => void
  /** Custom options to handle button item press */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: Record<string, any>
}

/**
 * One item in the menu
 */
interface MenuItem {
  /** Name of the menu item, displayed as text */
  name: string
  /** Callback when the menu item is clicked */
  action: () => void
  /** Disable the menu item */
  menuItemDisabled?: boolean
}

const props = defineProps<{
  /** List of buttons in the group */
  buttonItems: ButtonItem[]
  /** Optional menu items to display in a dropdown */
  buttonsMenu?: MenuItem[]
  /** Whether the entire button group is disabled */
  disabled?: boolean
  /** Theme of the button group */
  theme?: 'light' | 'dark'
  /** Type of button group, 'switch' for single selection or 'toggle' for multiple selections */
  type: 'switch' | 'toggle'
  /** Height of the button group container */
  height?: string
  /** Label text on the left side of the button group */
  label?: string
  /** Optional info tooltip shown via an info icon next to the control. */
  infoTooltip?: string
  /**
   * How much room each button gives its name (default 'comfortable'). 'compact' also makes the
   * group shorter and its labels smaller, for rows where the group is a secondary control.
   */
  density?: 'compact' | 'regular' | 'comfortable'
}>()

const emit = defineEmits<{
  (e: 'update:selected', value: boolean[]): void
  /**
   * A button was right-clicked or held down, with the pointer position to place a menu at.
   * Emitted instead of the selection, so holding a button never also activates it.
   */
  (e: 'context-menu', value: { item: ButtonItem; index: number; x: number; y: number }): void
}>()

const selected = ref<boolean[]>([])

const {
  anchorRef: menuAnchorRef,
  popoverRef: menuPopoverRef,
  popoverId: menuPopoverId,
  activatorProps: menuActivatorProps,
  isPositioned: isMenuPositioned,
  floatingStyles: menuFloatingStyles,
  hide: hideMenu,
  onToggle: onMenuToggle,
} = useBluePopover()

// Long enough not to fire on a normal tap, short enough to feel like a press-and-hold.
const LONG_PRESS_MS = 500
let longPressTimer: number | null = null
let longPressFired = false

// The inset each density gives a button name, paired with the total width it costs so the
// measurements below can reason about the group without reading it back from the DOM.
const DENSITY_PADDING = {
  compact: { class: 'px-[11px]', total: 22 },
  regular: { class: 'px-[15px]', total: 30 },
  comfortable: { class: 'px-[19px]', total: 38 },
} as const

// Once the buttons' natural width would exceed this, cap each label so long names
// ellipsize instead of letting the group sprawl (or clip) past the panel.
const GROUP_WIDTH_LIMIT = 850
const LABEL_MARGIN = 24 // mr-6 on the label
const rowRef = ref<HTMLElement | null>(null)
const labelRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const isWide = ref(false)
const isTight = ref(false)
let resizeObserver: ResizeObserver | null = null

const measureWidth = (): void => {
  const track = trackRef.value
  const row = rowRef.value
  if (!track || !row) return
  // Each label keeps its full text width in scrollWidth even while ellipsized, so the
  // natural width is independent of the cap we apply, avoiding a measure/toggle loop.
  const labels = track.querySelectorAll<HTMLElement>('[data-bbg-label]')
  const padding = DENSITY_PADDING[props.density || 'comfortable'].total
  let natural = 0
  labels.forEach((label) => {
    natural += label.scrollWidth + padding
  })
  natural += Math.max(0, labels.length - 1) // 1px separators between buttons
  isWide.value = natural > GROUP_WIDTH_LIMIT

  // Room the track could ever have: the row minus the label at full text width and whatever
  // else sits beside the track. Measured that way, and always against the density's own
  // padding, the answer does not depend on the padding currently applied, so it cannot
  // oscillate between the two.
  let occupied = labelRef.value ? labelRef.value.scrollWidth + LABEL_MARGIN : 0
  for (const child of Array.from(row.children)) {
    if (!child.contains(track)) continue
    occupied += child.clientWidth - track.clientWidth
  }
  isTight.value = natural > row.clientWidth - occupied
}

const initSelected = (): void => {
  const items = props.buttonItems
  if (props.type === 'switch') {
    const first = items.findIndex((b) => b.preSelected)
    const idx = first >= 0 ? first : 0
    selected.value = items.map((_, i) => i === idx)
  } else {
    selected.value = items.map((b) => !!b.preSelected)
  }
  emit('update:selected', selected.value)
}

const toggleButton = (idx: number): void => {
  if (props.disabled || props.buttonItems[idx].disabled) return
  const btn = props.buttonItems[idx]
  if (props.type === 'switch') {
    if (!selected.value[idx]) {
      selected.value = selected.value.map((_, i) => i === idx)
      btn.onSelected?.()
    }
  } else {
    selected.value[idx] = !selected.value[idx]
    if (selected.value[idx]) btn.onSelected?.()
  }
  emit('update:selected', selected.value)
}

const requestContextMenu = (idx: number, event: MouseEvent | PointerEvent): void => {
  if (props.disabled || props.buttonItems[idx].disabled) return
  emit('context-menu', { item: props.buttonItems[idx], index: idx, x: event.clientX, y: event.clientY })
}

const cancelLongPress = (): void => {
  if (longPressTimer !== null) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }
}

const startLongPress = (idx: number, event: PointerEvent): void => {
  if (props.disabled || props.buttonItems[idx].disabled) return
  cancelLongPress()
  longPressFired = false
  const { clientX, clientY } = event
  longPressTimer = window.setTimeout(() => {
    longPressTimer = null
    longPressFired = true
    emit('context-menu', { item: props.buttonItems[idx], index: idx, x: clientX, y: clientY })
  }, LONG_PRESS_MS)
}

const onButtonClick = (idx: number): void => {
  // The click that ends a long press must not also select the button it was held on.
  if (longPressFired) {
    longPressFired = false
    return
  }
  if (!props.buttonItems[idx].disabled) toggleButton(idx)
}

const runMenuItem = (item: MenuItem): void => {
  item.action()
  hideMenu()
}

onMounted(() => {
  initSelected()
  nextTick(measureWidth)
  // The first measurement runs against whatever font is available, and a fallback is wide
  // enough to call a group crowded that is not. Measure again once the real font lands.
  document.fonts?.ready.then(measureWidth)
  if (typeof ResizeObserver !== 'undefined' && trackRef.value) {
    resizeObserver = new ResizeObserver(() => measureWidth())
    resizeObserver.observe(trackRef.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  cancelLongPress()
})

watch(
  () => props.buttonItems.length,
  initSelected,
  { deep: true, immediate: true }
)

watch(
  () => props.buttonItems.map((item) => item.name).join('|'),
  () => nextTick(measureWidth)
)
</script>
