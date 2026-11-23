<script setup lang="ts">
import { computed, ref } from 'vue'

import {
  applyBlueTheme,
  BlueButton,
  BlueButtonGroup,
  BlueColorPicker,
  type BlueMode,
  BlueSlider,
  BlueSwitch,
  isAdaptiveGlassSupported,
} from '../../src'
import { SCENERY } from '../scenery'

const mode = defineModel<BlueMode>({ required: true })
const scenery = defineModel<number>('scenery', { required: true })

const cycleScenery = (step: number): void => {
  scenery.value = (scenery.value + step + SCENERY.length) % SCENERY.length
}

const GLASS_DEFAULTS = { adaptive: true, level: 0.6, sensitivity: 0.5, color: '#636363', opacity: 0.05, blur: 22 }
const adaptive = ref(GLASS_DEFAULTS.adaptive)
const level = ref(GLASS_DEFAULTS.level)
const sensitivity = ref(GLASS_DEFAULTS.sensitivity)
const glassColor = ref(GLASS_DEFAULTS.color)
const opacity = ref(GLASS_DEFAULTS.opacity)
const blur = ref(GLASS_DEFAULTS.blur)
const adaptiveSupported = isAdaptiveGlassSupported()

const glassTuned = computed(() =>
  adaptive.value !== GLASS_DEFAULTS.adaptive ||
  level.value !== GLASS_DEFAULTS.level ||
  sensitivity.value !== GLASS_DEFAULTS.sensitivity ||
  glassColor.value !== GLASS_DEFAULTS.color ||
  opacity.value !== GLASS_DEFAULTS.opacity ||
  blur.value !== GLASS_DEFAULTS.blur
)

const resetGlass = (): void => {
  adaptive.value = GLASS_DEFAULTS.adaptive
  level.value = GLASS_DEFAULTS.level
  sensitivity.value = GLASS_DEFAULTS.sensitivity
  glassColor.value = GLASS_DEFAULTS.color
  opacity.value = GLASS_DEFAULTS.opacity
  blur.value = GLASS_DEFAULTS.blur
  applyGlass()
}

const MODES: { name: string; value: BlueMode }[] = [
  { name: 'Dark', value: 'dark' },
  { name: 'Light', value: 'light' },
  { name: 'Glass', value: 'glass' },
]

const selectMode = (value: BlueMode): void => {
  mode.value = value
  applyBlueTheme({ mode: value })
}

const applyGlass = (): void => {
  applyBlueTheme({
    glass: {
      adaptive: adaptive.value,
      level: level.value,
      sensitivity: sensitivity.value,
      color: glassColor.value,
      opacity: opacity.value,
      blur: blur.value,
    },
  })
}
</script>

<template>
  <div class="mx-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
    <BlueButtonGroup
      label="Theme"
      theme="dark"
      type="switch"
      density="compact"
      :button-items="MODES.map((item) => ({
        name: item.name,
        preSelected: item.value === mode,
        onSelected: () => selectMode(item.value),
      }))"
    />
    <template v-if="mode === 'glass'">
      <div class="flex w-full items-center justify-between">
        <span class="mr-6 truncate text-white">Background</span>
        <div class="flex items-center gap-1">
          <BlueButton
            variant="icon"
            icon="mdi-chevron-left"
            tooltip="Previous background"
            @click="cycleScenery(-1)"
          />
          <span class="min-w-[140px] text-center text-sm text-[#ffffffcc]">{{ SCENERY[scenery].name }}</span>
          <BlueButton
            variant="icon"
            icon="mdi-chevron-right"
            tooltip="Next background"
            @click="cycleScenery(1)"
          />
        </div>
      </div>
      <div class="flex w-full items-center justify-between">
        <span class="mr-6 truncate text-white">Adaptive</span>
        <div class="flex items-center gap-1">
          <BlueButton
            variant="icon"
            density="compact"
            icon="mdi-restore"
            tooltip="Reset glass settings"
            :disabled="!glassTuned"
            @click="resetGlass"
          />
          <BlueSwitch
            v-model="adaptive"
            name="adaptive-glass"
            label-on="On"
            label-off="Off"
            theme="dark"
            :disabled="!adaptiveSupported"
            :info-tooltip="adaptiveSupported
              ? 'Darkens bright scenery behind the glass, while dark scenery stays see-through.'
              : 'Needs a Chromium-based browser (Chrome, Edge). Glass keeps its plain tint here.'"
            @update:model-value="applyGlass"
          />
        </div>
      </div>
      <template v-if="adaptive && adaptiveSupported">
        <BlueSlider
          v-model="level"
          name="adaptive-level"
          label="Level"
          theme="dark"
          :min="0"
          :max="1"
          :step="0.05"
          @update:model-value="applyGlass"
        />
        <BlueSlider
          v-model="sensitivity"
          name="adaptive-sensitivity"
          label="Sensitivity"
          theme="dark"
          :min="0"
          :max="1"
          :step="0.05"
          @update:model-value="applyGlass"
        />
      </template>
      <template v-else>
        <BlueColorPicker
          v-model="glassColor"
          name="glass-color"
          label="Color"
          theme="dark"
          @update:model-value="applyGlass"
        />
        <BlueSlider
          v-model="opacity"
          name="glass-opacity"
          label="Opacity"
          theme="dark"
          :min="0"
          :max="1"
          :step="0.01"
          @update:model-value="applyGlass"
        />
        <BlueSlider
          v-model="blur"
          name="glass-blur"
          label="Blur"
          theme="dark"
          :min="0"
          :max="50"
          :step="1"
          @update:model-value="applyGlass"
        />
      </template>
    </template>
  </div>
</template>
