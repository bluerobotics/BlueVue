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
        :for="name"
        class="block truncate text-start mr-6"
        :title="label"
        :class="theme === 'dark' ? 'text-white' : 'text-black'"
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
      <!-- The inset shadow darkens a band along the top edge, which the eye takes for the rim of
           the well rather than part of its floor. That drops the centre the value looks centred
           against by part of that band, which the top padding pushes the content down to meet. It
           is set inline because a host reset can beat the equivalent utility class, as Vuetify's
           does. -->
      <div
        class="relative flex items-center rounded-[6px] bluevue-inset-1 min-w-[90px] max-w-full"
        :class="[
          disabled ? 'opacity-30 pointer-events-none' : '',
          hasError ? 'border-2 border-solid border-[var(--bluevue-error)]' : '',
        ]"
        :style="{
          height: height || '30px',
          width: width || 'auto',
          backgroundColor: fieldBackground,
          paddingTop: '2px',
        }"
      >
        <!-- Always a text input, even for numbers: a native number input reports a half-typed
             value ('-', '-27.') as an empty string, which would wipe the model mid-keystroke. -->
        <input
          :id="name"
          ref="inputRef"
          :name="name"
          type="text"
          :value="draft"
          :placeholder="placeholder"
          :disabled="disabled"
          :autofocus="autofocus"
          :inputmode="type === 'number' ? 'decimal' : undefined"
          class="w-full min-w-0 bg-transparent pl-4 text-sm font-medium outline-none"
          :class="[
            suffix ? 'pr-1' : 'pr-4',
            theme === 'dark' ? 'text-white placeholder:text-[#ffffff44]' : 'text-black placeholder:text-[#00000055]',
          ]"
          @input="onInput"
          @keydown.up.prevent="nudge(1)"
          @keydown.down.prevent="nudge(-1)"
          @focus="focused = true"
          @blur="onBlur"
          @keydown.enter="normalize"
        >
        <span
          v-if="suffix"
          class="shrink-0 pr-4 pl-1 text-sm select-none"
          :class="[
            theme === 'dark' ? 'text-[#ffffff66]' : 'text-[#00000066]',
            suffixRidesHigh ? 'translate-y-[0.22em]' : '',
          ]"
        >
          {{ suffix }}
        </span>
        <!-- Focus reads as a hairline in the accent blue rather than a browser outline, so a
             focused field sits at the same weight as a selected button group segment. It rides
             on its own layer so the border costs the field no height. -->
        <div
          class="pointer-events-none absolute inset-0 rounded-[6px]"
          :style="{ border: `1px solid ${focused ? 'var(--bluevue-accent)' : 'transparent'}` }"
        />
      </div>
      <div
        v-if="hasError"
        class="text-[14px] text-[var(--bluevue-error)]"
      >
        {{ (errorMessages?.[0]) || '' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import BlueIcon from './BlueIcon.vue'
import BlueTooltip from './BlueTooltip.vue'

const props = defineProps<{
  /**
   * Model value for v-model. A 'number' field emits numbers and never emits an empty value:
   * clearing it leaves the last number in place until a new one is typed.
   */
  modelValue: string | number | null
  /** Label on the left */
  label?: string
  /** Name and id for the input, tying the label to it */
  name?: string
  /** 'text' (default) or 'number' */
  type?: 'text' | 'number'
  /** Unit or short hint shown inside the field, after the value */
  suffix?: string
  /** Placeholder shown while the field is empty */
  placeholder?: string
  /**
   * Take focus when the field appears. The attribute is what a dialog opening around the field
   * honours, and the call below covers a field mounted into something already on screen.
   */
  autofocus?: boolean
  /** Disable the field */
  disabled?: boolean
  /** light or dark theme */
  theme?: 'light' | 'dark'
  /** Control height (default '30px') */
  height?: string
  /** Control width (default fits the content) */
  width?: string
  /** Optional info tooltip shown via an info icon next to the control. */
  infoTooltip?: string
  /** Bounds and increment, forwarded to a number input */
  min?: number
  max?: number
  step?: number
  /** Error messages, used to give feedback from validators */
  errorMessages?: string[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
}>()

const hasError = computed(() => props.errorMessages && props.errorMessages.length > 0)

// Degree and its relatives are cut at cap height, so on the baseline the value sits on their ink
// lands near the top of the field. That is right against a number ('27°') but reads as floating
// when the mark stands alone at the far edge, so it drops to the optical centre. Word suffixes
// keep the shared baseline, which is where they belong.
const suffixRidesHigh = computed(() => /^[°′″'"]+$/.test(props.suffix ?? ''))

// Applied inline so it survives a host stylesheet whose reset is unlayered, as Vuetify's is:
// utilities sit in a cascade layer, and unlayered rules win over layered ones outright.
const fieldBackground = computed(() => (props.theme === 'dark' ? '#FFFFFF11' : '#00000011'))

// Everything a number can look like on the way to being one, including the stages that are
// not a number yet: '', '-', '-27.'.
const PARTIAL_NUMBER = /^-?\d*\.?\d*$/

const format = (value: string | number | null): string =>
  value === null || value === undefined ? '' : String(value)

// What the field shows, kept apart from the model so a half-typed number stays on screen
// instead of being rewritten by the parent on every keystroke.
const draft = ref<string>(format(props.modelValue))
const inputRef = ref<HTMLInputElement | null>(null)
const focused = ref(false)

onMounted(() => {
  if (props.autofocus) inputRef.value?.focus()
})

const parse = (raw: string): string | number | null => {
  if (props.type !== 'number') return raw
  if (raw.trim() === '') return null
  const value = Number(raw)
  return Number.isFinite(value) ? value : null
}

const clamp = (value: number): number => {
  const low = props.min !== undefined ? Math.max(value, props.min) : value
  return props.max !== undefined ? Math.min(low, props.max) : low
}

const onInput = (event: Event): void => {
  const input = event.target as HTMLInputElement
  if (props.type === 'number' && !PARTIAL_NUMBER.test(input.value)) {
    // Nothing a number could grow into, so the keystroke never happened.
    input.value = draft.value
    return
  }
  draft.value = input.value
  const parsed = parse(draft.value)
  // An emptied or half-typed number field is a value being rewritten, not a value of none, so
  // the model keeps the last real number until a new one is typed. Blur puts it back on screen.
  if (parsed === null && props.type === 'number') return
  emit('update:modelValue', parsed)
}

// Arrow keys walk a number field by its step, the way the spinners this control hides would.
const nudge = (direction: number): void => {
  if (props.type !== 'number' || props.disabled) return
  const step = props.step ?? 1
  const current = typeof props.modelValue === 'number' ? props.modelValue : Number(draft.value) || 0
  const decimals = (String(step).split('.')[1] ?? '').length
  const next = clamp(Number((current + direction * step).toFixed(decimals)))
  draft.value = String(next)
  emit('update:modelValue', next)
}

// On the way out, show the value the way the model holds it: '-27.5630' becomes '-27.563',
// anything that never parsed goes back to the last good value, and a number outside its
// bounds is pulled back in rather than silently applied.
const normalize = (): void => {
  if (props.type === 'number' && typeof props.modelValue === 'number') {
    const bounded = clamp(props.modelValue)
    if (bounded !== props.modelValue) {
      emit('update:modelValue', bounded)
      draft.value = String(bounded)
      return
    }
  }
  draft.value = format(props.modelValue)
}

const onBlur = (): void => {
  focused.value = false
  normalize()
}

watch(
  () => props.modelValue,
  (value) => {
    if (parse(draft.value) !== value) draft.value = format(value)
  },
)
</script>