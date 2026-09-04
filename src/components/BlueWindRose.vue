<script setup lang="ts">
import { computed, ref } from 'vue'

import { useBluePopover } from '../composables/useBluePopover'
import BlueIcon from './BlueIcon.vue'
import BlueInput from './BlueInput.vue'

const SIZE = 176
const CENTER = SIZE / 2
const TICKS = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330] as const
const CARDINALS: { label: string; deg: number }[] = [
  { label: 'N', deg: 0 },
  { label: 'E', deg: 90 },
  { label: 'S', deg: 180 },
  { label: 'W', deg: 270 },
]

/**
 * A heading around a circle: typed in the field, or pointed on the rose that opens from the
 * compass beside it. The value wraps at the ends, so 360° and 0° are the same direction.
 */
const props = defineProps<{
  modelValue: number | null
  /** Marks the heading with a plain bar, for a value that is an angle rather than a wind. */
  angle?: boolean
  label?: string
  name?: string
  /** Start of the circle (default 0). */
  min?: number
  /** End of the circle, wrapping back to min (default 360). */
  max?: number
  step?: number
  suffix?: string
  placeholder?: string
  disabled?: boolean
  theme?: 'light' | 'dark'
  height?: string
  width?: string
  infoTooltip?: string
  errorMessages?: string[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const {
  anchorRef,
  popoverRef,
  popoverId,
  activatorProps,
  isPositioned,
  floatingStyles,
  onToggle,
} = useBluePopover({ placement: 'bottom-end' })

const roseRef = ref<SVGSVGElement | null>(null)
const dragging = ref(false)

const min = computed(() => props.min ?? 0)
const max = computed(() => props.max ?? 360)
const step = computed(() => (props.step && props.step > 0 ? props.step : 1))

const period = computed(() => {
  const span = max.value - min.value
  return span > 0 ? span : 360
})

const current = computed(() => (typeof props.modelValue === 'number' ? props.modelValue : min.value))

const roseDeg = computed(() => ((wrap(current.value) - min.value) / period.value) * 360)

const isDark = computed(() => props.theme !== 'light')

function wrap(value: number): number {
  return min.value + ((((value - min.value) % period.value) + period.value) % period.value)
}

function snap(value: number): number {
  return min.value + Math.round((value - min.value) / step.value) * step.value
}

function commit(value: number): void {
  emit('update:modelValue', wrap(snap(value)))
}

function onTyped(value: string | number | null): void {
  if (typeof value !== 'number' || !Number.isFinite(value)) return
  if (value < min.value || value >= max.value) {
    emit('update:modelValue', wrap(value))
    return
  }
  emit('update:modelValue', value)
}

function valueFromEvent(event: PointerEvent): number {
  const svg = roseRef.value
  if (!svg) return current.value
  const rect = svg.getBoundingClientRect()
  const deg =
    (Math.atan2(event.clientX - (rect.left + rect.width / 2), rect.top + rect.height / 2 - event.clientY) *
      180) /
    Math.PI
  const heading = deg < 0 ? deg + 360 : deg
  return min.value + (heading / 360) * period.value
}

function onPointerDown(event: PointerEvent): void {
  if (props.disabled) return
  dragging.value = true
  roseRef.value?.setPointerCapture(event.pointerId)
  commit(valueFromEvent(event))
}

function onPointerMove(event: PointerEvent): void {
  if (!dragging.value) return
  commit(valueFromEvent(event))
}

function onPointerUp(event: PointerEvent): void {
  if (!dragging.value) return
  dragging.value = false
  roseRef.value?.releasePointerCapture(event.pointerId)
}

function tickPoint(deg: number, radius: number): { x: number; y: number } {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: CENTER + Math.cos(rad) * radius, y: CENTER + Math.sin(rad) * radius }
}

// A wind is named for where it comes from, so the arrow flies inward: the tail sits on the rim at
// the heading and the head reaches the centre. An angle comes from nowhere, so it loses the head
// and the bar simply marks the direction it points in.
const indicatorPath = computed(() => {
  const rim = 18
  const shaft = 2.2
  if (props.angle) {
    return `M ${CENTER - shaft} ${rim} L ${CENTER + shaft} ${rim} L ${CENTER + shaft} ${CENTER} L ${CENTER - shaft} ${CENTER} Z`
  }
  const barb = 7
  const neck = CENTER - 18
  return `M ${CENTER} ${CENTER} L ${CENTER + barb} ${neck} L ${CENTER + shaft} ${neck} L ${CENTER + shaft} ${rim} L ${CENTER - shaft} ${rim} L ${CENTER - shaft} ${neck} L ${CENTER - barb} ${neck} Z`
})
</script>

<template>
  <div class="w-full">
    <BlueInput
      :model-value="modelValue"
      type="number"
      :label="label"
      :name="name"
      :suffix="suffix ?? '°'"
      :placeholder="placeholder"
      :disabled="disabled"
      :theme="theme"
      :height="height"
      :width="width"
      :info-tooltip="infoTooltip"
      :error-messages="errorMessages"
      :step="step"
      @update:model-value="onTyped"
    >
      <template #prepend>
        <button
          ref="anchorRef"
          v-bind="activatorProps"
          type="button"
          :disabled="disabled"
          class="flex items-center justify-center rounded-[4px] p-[2px]"
          :class="disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-[#ffffff14]'"
          :aria-label="label ? `Choose ${label}` : 'Choose heading'"
          :title="label ? `Choose ${label}` : 'Choose heading'"
        >
          <BlueIcon
            name="mdi-compass-rose"
            :size="16"
            :class="isDark ? 'text-white' : 'text-black'"
          />
        </button>
      </template>
    </BlueInput>

    <div
      :id="popoverId"
      ref="popoverRef"
      popover
      class="bluevue-popover bluevue-popover--dimmed"
      :style="floatingStyles"
      @toggle="onToggle"
    >
      <!-- No padding of its own: the rose is drawn 6px inside its own box, which is the margin the
           round card keeps outside the compass ring. -->
      <div
        class="bluevue-elevation-5 rounded-full"
        :class="[
          isDark ? 'bg-[var(--bluevue-surface)] text-white' : 'bg-white text-black',
          isPositioned ? 'opacity-100' : 'opacity-0',
        ]"
      >
        <svg
          ref="roseRef"
          :width="SIZE"
          :height="SIZE"
          :viewBox="`0 0 ${SIZE} ${SIZE}`"
          class="block touch-none select-none"
          :class="disabled ? 'cursor-not-allowed' : 'cursor-pointer'"
          @pointerdown.prevent="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
        >
          <circle
            :cx="CENTER"
            :cy="CENTER"
            :r="CENTER - 6"
            fill="transparent"
            :stroke="isDark ? '#ffffff22' : '#00000022'"
            stroke-width="1"
          />
          <circle
            :cx="CENTER"
            :cy="CENTER"
            :r="CENTER - 22"
            :fill="isDark ? '#ffffff0d' : '#0000000d'"
          />
          <line
            v-for="deg in TICKS"
            :key="deg"
            :x1="tickPoint(deg, deg % 90 === 0 ? 70 : 74).x"
            :y1="tickPoint(deg, deg % 90 === 0 ? 70 : 74).y"
            :x2="tickPoint(deg, 80).x"
            :y2="tickPoint(deg, 80).y"
            :stroke="isDark ? '#ffffff44' : '#00000044'"
            :stroke-width="deg % 90 === 0 ? 2 : 1"
          />
          <text
            v-for="cardinal in CARDINALS"
            :key="cardinal.label"
            :x="tickPoint(cardinal.deg, 58).x"
            :y="tickPoint(cardinal.deg, 58).y"
            text-anchor="middle"
            dominant-baseline="middle"
            class="text-[11px] font-medium"
            :fill="isDark ? '#ffffff88' : '#00000088'"
          >
            {{ cardinal.label }}
          </text>
          <defs>
            <filter
              :id="`${popoverId}-arrow-shadow`"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feDropShadow
                dx="0"
                dy="1"
                stdDeviation="1.2"
                flood-color="#000000"
                flood-opacity="0.45"
              />
            </filter>
          </defs>
          <g
            :transform="`rotate(${roseDeg} ${CENTER} ${CENTER})`"
            :filter="`url(#${popoverId}-arrow-shadow)`"
          >
            <path
              :d="indicatorPath"
              fill="#F5C400"
            />
            <circle
              :cx="CENTER"
              :cy="CENTER"
              r="3.5"
              fill="#F5C400"
            />
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>
