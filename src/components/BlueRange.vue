<template>
  <div
    ref="rootRef"
    class="group relative h-6 w-full cursor-pointer touch-none select-none"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="dragging = null"
    @pointercancel="dragging = null"
  >
    <div
      class="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full"
      :class="mode === 'dark' ? 'bg-[#ffffff14]' : 'bg-[#00000014]'"
    >
      <div
        class="absolute inset-y-0 rounded-full"
        :style="{
          left: `${percent(modelValue[0])}%`,
          right: `${100 - percent(modelValue[modelValue.length - 1])}%`,
          backgroundColor: color || 'var(--bluevue-primary)',
        }"
      />
    </div>

    <!-- The handles between the two ends stay bars, so the knobs only ever mark where the range stops. -->
    <div
      v-for="(value, index) in modelValue"
      :key="index"
      :ref="(el) => { handleEls[index] = el as HTMLElement | null }"
      role="slider"
      tabindex="0"
      :aria-label="handleLabels?.[index]"
      :aria-valuemin="bounds(index)[0]"
      :aria-valuemax="bounds(index)[1]"
      :aria-valuenow="value"
      :aria-valuetext="formatValue(value)"
      class="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center outline-none"
      :class="isEdge(index) ? 'size-4' : 'h-6 w-3'"
      :style="{ left: `${percent(value)}%` }"
      @pointerenter="hovered = index"
      @pointerleave="hovered = null"
      @focus="focused = ($event.target as HTMLElement).matches(':focus-visible') ? index : null"
      @blur="focused = null"
      @keydown="onKeydown($event, index)"
    >
      <div
        v-if="isEdge(index)"
        class="size-3.5 rounded-full bluevue-elevation-3 transition-opacity duration-150"
        :class="active === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
        :style="{ backgroundColor: `color-mix(in srgb, ${color || 'var(--bluevue-primary)'} 70%, black)` }"
      />
      <div
        v-else
        class="h-4 rounded-full transition-[width,box-shadow] duration-150"
        :class="[
          mode === 'dark' ? 'bg-white' : 'bg-black',
          active === index ? 'w-1 shadow-[var(--bluevue-elevation-3)]' : 'w-0.5',
        ]"
      />
    </div>

    <div
      ref="tooltipRef"
      popover="manual"
      class="bluevue-popover pointer-events-none"
      :style="tooltipStyle"
    >
      <div
        role="tooltip"
        class="whitespace-nowrap rounded-[4px] px-2 py-1 text-xs leading-snug bluevue-elevation-5"
        :class="mode === 'dark' ? 'bg-[#333333f2] text-white' : 'bg-white text-black'"
      >
        {{ active === null ? '' : formatValue(modelValue[active]) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type CSSProperties, ref, watch } from 'vue'
import { useBlueMode } from '../utils/theme'

/**
 * Two or three values on one track: the ends of a range, and optionally a point inside it such as
 * a servo's trim. The ends grow knobs on hover, and each handle shows its value while it is
 * hovered, focused or dragged.
 */
const props = defineProps<{
  /** The values, in ascending order: the two ends, with an optional third between them. */
  modelValue: number[]
  min: number
  max: number
  /** Increment (default 1). */
  step?: number
  /** What a screen reader calls each handle, in the order of `modelValue`. */
  handleLabels?: string[]
  /** How a value reads in its tooltip. */
  format?: (value: number) => string
  /** The fill and knobs, in place of the primary token. */
  color?: string
  /** 'light' or 'dark' theme (default the app's, or 'light'). */
  theme?: 'light' | 'dark'
}>()

const mode = useBlueMode(() => props.theme)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number[]): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const tooltipRef = ref<HTMLElement | null>(null)
const handleEls: (HTMLElement | null)[] = []

const hovered = ref<number | null>(null)
const focused = ref<number | null>(null)
const dragging = ref<number | null>(null)
const active = computed(() => dragging.value ?? hovered.value ?? focused.value)

const stepSize = computed(() => props.step ?? 1)
const isEdge = (index: number): boolean => index === 0 || index === props.modelValue.length - 1
const formatValue = (value: number): string => (props.format ? props.format(value) : String(value))

const percent = (value: number): number => {
  const span = props.max - props.min
  if (!(span > 0)) return 0
  return (Math.min(Math.max(value, props.min), props.max) - props.min) / span * 100
}

// A handle never passes its neighbours, so the values stay in the order they are given in.
const bounds = (index: number): [number, number] => [
  index > 0 ? props.modelValue[index - 1] : props.min,
  index < props.modelValue.length - 1 ? props.modelValue[index + 1] : props.max,
]

const setValue = (index: number, raw: number): void => {
  const [low, high] = bounds(index)
  const snapped = props.min + Math.round((raw - props.min) / stepSize.value) * stepSize.value
  const next = Math.min(Math.max(snapped, low), high)
  if (next === props.modelValue[index]) return
  emit('update:modelValue', props.modelValue.map((value, i) => (i === index ? next : value)))
}

const valueAt = (clientX: number): number => {
  const rect = rootRef.value?.getBoundingClientRect()
  if (!rect?.width) return props.min
  const fraction = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1)
  return props.min + fraction * (props.max - props.min)
}

// Handles sitting on one value are told apart by which side of them the press lands, so two that
// meet can still be pulled apart in either direction.
const nearestHandle = (raw: number): number => {
  let best = 0
  props.modelValue.forEach((value, index) => {
    const distance = Math.abs(raw - value)
    const bestDistance = Math.abs(raw - props.modelValue[best])
    if (distance < bestDistance || (distance === bestDistance && raw > value)) best = index
  })
  return best
}

const onPointerDown = (event: PointerEvent): void => {
  if (event.button !== 0) return
  const raw = valueAt(event.clientX)
  dragging.value = nearestHandle(raw)
  rootRef.value?.setPointerCapture(event.pointerId)
  handleEls[dragging.value]?.focus()
  setValue(dragging.value, raw)
}

const onPointerMove = (event: PointerEvent): void => {
  if (dragging.value !== null) setValue(dragging.value, valueAt(event.clientX))
}

const onKeydown = (event: KeyboardEvent, index: number): void => {
  const value = props.modelValue[index]
  const [low, high] = bounds(index)
  const targets: Record<string, number> = {
    ArrowLeft: value - stepSize.value,
    ArrowDown: value - stepSize.value,
    ArrowRight: value + stepSize.value,
    ArrowUp: value + stepSize.value,
    PageDown: value - stepSize.value * 10,
    PageUp: value + stepSize.value * 10,
    Home: low,
    End: high,
  }
  if (!(event.key in targets)) return
  event.preventDefault()
  focused.value = index
  setValue(index, targets[event.key])
}

// In the top layer, so a dialog body that scrolls its own overflow cannot clip it.
const tooltipStyle = ref<CSSProperties>({})

watch(
  [active, () => props.modelValue],
  () => {
    const tooltip = tooltipRef.value
    const handle = active.value === null ? null : handleEls[active.value]
    if (!tooltip) return
    if (!handle) {
      if (tooltip.matches(':popover-open')) tooltip.hidePopover()
      return
    }
    const rect = handle.getBoundingClientRect()
    tooltipStyle.value = {
      left: `${rect.left + rect.width / 2}px`,
      top: `${rect.top - 6}px`,
      transform: 'translate(-50%, -100%)',
    }
    if (!tooltip.matches(':popover-open')) tooltip.showPopover()
  },
  { flush: 'post' }
)
</script>
