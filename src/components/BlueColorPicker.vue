<template>
  <div class="flex w-full justify-between items-center">
    <div
      v-if="label"
      class="min-w-0"
    >
      <label
        :for="activatorId"
        class="block truncate text-start mr-6"
        :title="label"
        :class="[mode === 'dark' ? 'text-white' : 'text-black', disabled ? 'opacity-30' : '']"
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
          :class="[disabled ? 'opacity-30' : 'opacity-60', mode === 'dark' ? 'text-white' : 'text-black']"
        />
      </BlueTooltip>
      <BlueButton
        v-if="resetValue"
        variant="icon"
        density="compact"
        icon="mdi-restore"
        tooltip="Reset color"
        :theme="theme"
        :disabled="disabled || hex === resetHex"
        class="mr-1"
        @click="setHsv(rgbToHsv(hexToRgb(resetHex) ?? [0, 0, 0]))"
      />
      <button
        :id="activatorId"
        ref="anchorRef"
        v-bind="activatorProps"
        type="button"
        :name="name"
        :disabled="disabled"
        :aria-label="label ? undefined : name"
        class="inline-flex h-[30px] shrink-0 items-center gap-2 rounded-[8px] pl-[5px] pr-3 bluevue-elevation-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--bluevue-accent)]"
        :class="[
          mode === 'dark' ? 'bluevue-frost-bright bg-[#464646AA] text-white' : 'bg-[#00000011] text-black',
          disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer',
        ]"
      >
        <span
          class="h-5 w-5 rounded-[5px] border border-solid border-[var(--bluevue-edge)]"
          :style="{ backgroundColor: hex }"
        />
        <span class="font-mono text-[13px] uppercase">{{ hex }}</span>
      </button>
    </div>

    <div
      :id="popoverId"
      ref="popoverRef"
      popover
      class="bluevue-popover"
      :style="floatingStyles"
      @toggle="onToggle"
    >
      <div
        class="bluevue-glass bluevue-elevation-5 flex w-[248px] flex-col gap-[5px] rounded-[5px] border border-solid border-[#FFFFFF22] p-[5px]"
        :class="[
          mode === 'dark' ? 'bg-[#000000a6] backdrop-blur-[16px] text-white' : 'bg-white text-black',
          isPositioned ? 'opacity-100' : 'opacity-0',
        ]"
      >
        <div
          role="slider"
          tabindex="0"
          aria-label="Saturation and brightness"
          :aria-valuetext="`Saturation ${Math.round(hsv.s * 100)}%, brightness ${Math.round(hsv.v * 100)}%`"
          class="relative h-[140px] w-full cursor-crosshair touch-none rounded-[5px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--bluevue-accent)]"
          :style="{ background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hsv.h} 100% 50%))` }"
          @pointerdown="drag($event, (x, y) => setHsv({ ...hsv, s: x, v: 1 - y }))"
          @keydown="onSquareKeydown"
        >
          <span
            class="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-solid border-white bluevue-elevation-1"
            :style="{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, backgroundColor: hex }"
          />
        </div>

        <div class="my-[5px] flex items-center gap-[5px]">
          <span
            class="h-[26px] w-[26px] shrink-0 rounded-[5px] border border-solid border-[var(--bluevue-edge)]"
            :style="{ backgroundColor: hex }"
          />
          <div
            role="slider"
            tabindex="0"
            aria-label="Hue"
            aria-valuemin="0"
            aria-valuemax="360"
            :aria-valuenow="Math.round(hsv.h)"
            class="relative mx-[6px] h-3 flex-1 cursor-pointer touch-none rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bluevue-accent)]"
            style="background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)"
            @pointerdown="drag($event, (x) => setHsv({ ...hsv, h: x * 360 }))"
            @keydown="onHueKeydown"
          >
            <span
              class="pointer-events-none absolute top-1/2 h-[14px] w-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-solid border-white bluevue-elevation-1"
              :style="{ left: `${(hsv.h / 360) * 100}%`, backgroundColor: `hsl(${hsv.h} 100% 50%)` }"
            />
          </div>
        </div>

        <div class="grid grid-cols-[2fr_1fr_1fr_1fr] gap-[5px]">
          <label
            v-for="field in fields"
            :key="field.name"
            class="flex min-w-0 flex-col items-center gap-[3px]"
          >
            <input
              type="text"
              :inputmode="field.name === 'Hex' ? 'text' : 'numeric'"
              :value="field.value"
              :aria-label="field.name"
              class="h-[26px] w-full min-w-0 rounded-[5px] bluevue-inset-1 text-center text-xs outline-none focus:outline focus:outline-2 focus:outline-[var(--bluevue-accent)]"
              :class="[mode === 'dark' ? 'bluevue-frost-smoke bg-[#ffffff11] text-white' : 'bg-[#00000008] text-black', field.name === 'Hex' ? 'font-mono uppercase' : '']"
              @change="field.commit"
            >
            <span
              class="text-[10px] uppercase tracking-wide"
              :class="mode === 'dark' ? 'text-[#ffffff88]' : 'text-[#000000aa]'"
            >{{ field.name }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { useBluePopover } from '../composables/useBluePopover'
import { hexToRgb, type Hsv, hsvToRgb, type Rgb, rgbToHex, rgbToHsv } from '../utils/color'
import { nextElementId } from '../utils/id'
import { useBlueMode } from '../utils/theme'
import BlueButton from './BlueButton.vue'
import BlueIcon from './BlueIcon.vue'
import BlueTooltip from './BlueTooltip.vue'

/**
 * A colour, picked in a panel of its own from a chip showing the swatch and its hex code.
 */
const props = defineProps<{
  /** The colour, as `#rrggbb`. A trailing alpha pair is ignored, since the picker has no alpha. */
  modelValue: string | null
  /** Name of the control. */
  name: string
  /** Label on the left side of the component. */
  label?: string
  /** Optional info tooltip shown via an info icon next to the control. */
  infoTooltip?: string
  /** A colour to go back to, as `#rrggbb`, offered by a reset button beside the chip. */
  resetValue?: string
  /** Whether the picker is disabled. */
  disabled?: boolean
  /** Theme of the component. */
  theme?: 'light' | 'dark'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const mode = useBlueMode(() => props.theme)
const activatorId = nextElementId('color-picker')
const { anchorRef, popoverRef, popoverId, activatorProps, isPositioned, floatingStyles, onToggle } = useBluePopover()

// Held as HSV rather than derived from the hex, so the hue survives dragging through grey or black.
const hsv = ref<Hsv>({ h: 0, s: 0, v: 0 })
const hex = computed(() => rgbToHex(hsvToRgb(hsv.value)))
const resetHex = computed(() => (props.resetValue ?? '').slice(0, 7).toLowerCase())

watch(
  () => props.modelValue,
  (value) => {
    const rgb = hexToRgb((value ?? '#000000').slice(0, 7))
    if (rgb && rgbToHex(rgb) !== hex.value) hsv.value = rgbToHsv(rgb)
  },
  { immediate: true },
)

const setHsv = (next: Hsv): void => {
  hsv.value = next
  emit('update:modelValue', hex.value)
}

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n))

// Follows the pointer from the press until its release, captured so a drag past the edge keeps going.
const drag = (event: PointerEvent, apply: (x: number, y: number) => void): void => {
  const el = event.currentTarget as HTMLElement
  el.setPointerCapture(event.pointerId)
  const move = (e: PointerEvent): void => {
    const rect = el.getBoundingClientRect()
    apply(clamp01((e.clientX - rect.left) / rect.width), clamp01((e.clientY - rect.top) / rect.height))
  }
  const stop = (): void => {
    el.removeEventListener('pointermove', move)
    el.removeEventListener('pointerup', stop)
    el.removeEventListener('pointercancel', stop)
  }
  move(event)
  el.addEventListener('pointermove', move)
  el.addEventListener('pointerup', stop)
  el.addEventListener('pointercancel', stop)
}

const ARROWS: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }

const onSquareKeydown = (event: KeyboardEvent): void => {
  const step = ARROWS[event.key]
  if (!step) return
  event.preventDefault()
  const amount = event.shiftKey ? 0.1 : 0.01
  setHsv({ ...hsv.value, s: clamp01(hsv.value.s + step[0] * amount), v: clamp01(hsv.value.v + step[1] * amount) })
}

const onHueKeydown = (event: KeyboardEvent): void => {
  const step = ARROWS[event.key]
  if (!step) return
  event.preventDefault()
  const h = hsv.value.h + (step[0] + step[1]) * (event.shiftKey ? 10 : 1)
  setHsv({ ...hsv.value, h: Math.min(360, Math.max(0, h)) })
}

// A typed value only lands when it is a colour; otherwise the field goes back to the current one.
const commitRgb = (event: Event, rgb: Rgb | null): void => {
  const input = event.target as HTMLInputElement
  if (!rgb) {
    input.value = fields.value.find((field) => field.name === input.getAttribute('aria-label'))?.value ?? ''
    return
  }
  setHsv(rgbToHsv(rgb))
}

const fields = computed(() => {
  const rgb = hsvToRgb(hsv.value).map(Math.round) as Rgb
  const channel = (index: number) => (event: Event): void => {
    const text = (event.target as HTMLInputElement).value.trim()
    const typed = text ? Number(text) : NaN
    const next = [...rgb] as Rgb
    next[index] = Math.min(255, Math.max(0, Math.round(typed)))
    commitRgb(event, Number.isFinite(typed) ? next : null)
  }
  return [
    { name: 'Hex', value: hex.value, commit: (event: Event) => commitRgb(event, hexToRgb((event.target as HTMLInputElement).value)) },
    { name: 'R', value: String(rgb[0]), commit: channel(0) },
    { name: 'G', value: String(rgb[1]), commit: channel(1) },
    { name: 'B', value: String(rgb[2]), commit: channel(2) },
  ]
})
</script>
