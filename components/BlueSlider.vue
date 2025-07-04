<template>
  <div class="flex w-full justify-between items-center">
    <div v-if="label">
      <label class="text-start mr-6" :class="theme === 'dark' ? 'text-white' : 'text-black'">{{ label }}</label>
    </div>
    <div class="flex justify-between items-center">
      <div
        name="slider-track"
        class="relative overflow-visible rounded-[6px] elevation-1"
        :class="[theme === 'dark' ? 'bg-[#464646]' : 'bg-[#00000011]', disabled ? 'opacity-50' : '']"
        :style="{ width: width || '100%', height: height || '30px', cursor: disabled ? 'not-allowed' : 'pointer' }"
        @mousedown="startSliding"
        @mouseup="stopSliding"
        @mouseleave="stopSliding"
        @touchstart="startSliding"
        @touchend="stopSliding"
      >
        <div class="absolute inset-x-[18%] top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
          <div
            v-for="i in 6"
            :key="i"
            class="mdi mdi-circle w-2 h-2"
            :style="{
              fontSize: '6px',
              color: theme === 'dark' ? '#ffffff11' : '#00000011',
            }"
          />
        </div>
        <div
          class="absolute translate-y-1/2 bottom-1/2 text-white text-center text-[14px] min-w-[60px] py-[1px] rounded-[6px] elevation-1 z-50 h-3/4"
          :class="isEditingCurrent ? 'pointer-events-auto' : 'pointer-events-none select-none'"
          :style="{
            left: `calc((100% - 70px) * ${fillWidth / 100})`,
            marginLeft: '5px',
            backgroundColor: color || '#0B5087',
          }"
        >
          <div v-if="!isEditingCurrent">
            <p class="font-bold select-none" draggable="false">
              {{ step && step < 1 ? current.toFixed(1) : current }}
            </p>
          </div>
          <div v-else>
            <input
              ref="editInput"
              v-model.number="current"
              type="number"
              :min="min"
              :max="max"
              :step="step || 0.1"
              autofocus
              class="bg-white border border-gray-300 rounded px-1 py-0.5"
              @input="current = Math.min(Math.max(current, min), max)"
              @keydown="handleValueChange"
              @blur="isEditingCurrent = false"
            />
          </div>
        </div>
        <input
          v-model.number="current"
          type="range"
          class="absolute inset-0 w-full h-full opacity-0"
          :class="disabled ? 'cursor-not-allowed' : 'cursor-pointer'"
          style="width: 95%; left: 2.5%"
          :min="min"
          :max="max"
          :step="step || 0.1"
          :disabled="disabled"
          @input="onSliderInput"
          @dblclick="isEditingCurrent = true"
        />
        <p
          class="absolute min-w-[30px] ml-[10px] mt-1 text-[15px] text-center z-10 pointer-events-none"
          :class="theme === 'dark' ? 'text-[#ffffff44]' : 'text-[#00000066]'"
        >
          {{ labelMin || min }}
        </p>
        <p
          class="absolute right-0 min-w-[30px] mr-[10px] mt-1 text-[15px] text-center z-10 pointer-events-none"
          :class="theme === 'dark' ? 'text-[#ffffff44]' : 'text-[#00000066]'"
        >
          {{ labelMax || max }}
        </p>
        <div
          v-if="isEditingCurrent"
          class="absolute mdi mdi-check mdi-24px"
          style="right: -30px; top: 50%; transform: translateY(-50%); cursor: pointer; color: green"
          @click="isEditingCurrent = false"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, onBeforeUnmount, computed } from 'vue'

const props = defineProps<{
  /** Pill color override. */
  color?: string
  /** Current slider value. */
  current: number
  /** Disable user interaction. Add disabled visual feedback */
  disabled?: boolean
  /** Slider height (default. '30px'). */
  height?: string
  /** Main Label text on the left. */
  label?: string
  /** Custom text for the max label. */
  labelMax?: string
  /** Custom text for the min label. */
  labelMin?: string
  /** Maximum allowed value. */
  max: number
  /** Minimum allowed value. */
  min: number
  /** Name attribute for the range input. */
  name: string
  /** Step increment (default 1). */
  step?: number
  /** 'light' or 'dark' theme. (default 'light')*/
  theme?: 'light' | 'dark'
  /** Container width (default '100%'). */
  width?: string
}>()

const emit = defineEmits<{
  (e: 'update:current', value: number): void
}>()

const current = ref(props.current)
const lastSentValue = ref(current.value)
const isEditingCurrent = ref(false)

let sliderInterval: number | null = null
let isSliding = false

const fillWidth = computed(() => ((current.value - props.min) / (props.max - props.min)) * 100)

const sendValue = (val: number) => {
  if (val === lastSentValue.value) return
  lastSentValue.value = val
  emit('update:current', val)
}

const onSliderInput = (): void => {
  current.value = Math.min(Math.max(current.value, props.min), props.max)
  if (!isSliding) sendValue(current.value)
}

const startSliding = (): void => {
  isSliding = true
  if (!sliderInterval) {
    sliderInterval = window.setInterval(() => {
      if (isSliding) sendValue(current.value)
    }, 500)
  }
}

const stopSliding = (): void => {
  isSliding = false
  if (sliderInterval) {
    clearInterval(sliderInterval)
    sliderInterval = null
  }
  sendValue(current.value)
}

const handleValueChange = (e: KeyboardEvent): void => {
  if (e.key === 'Escape') {
    isEditingCurrent.value = false
    current.value = lastSentValue.value
  } else if (e.key === 'Enter') {
    isEditingCurrent.value = false
    current.value = Math.min(Math.max(current.value, props.min), props.max)
    sendValue(current.value)
  }
}

watch(
  () => props.current,
  (v) => (current.value = v)
)

onBeforeUnmount(() => {
  if (sliderInterval) clearInterval(sliderInterval)
})
</script>
