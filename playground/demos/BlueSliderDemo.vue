<script setup lang="ts">
import { ref } from 'vue'

import { BlueSlider } from '../../src'

const wind = ref(12)
const speedup = ref(1)
</script>

<template>
  <div class="flex flex-col gap-5">
    <BlueSlider
      v-model="wind"
      name="wind"
      label="Wind speed"
      theme="dark"
      :min="0"
      :max="60"
      label-min="calm"
      label-max="60 m/s"
    />
    <BlueSlider
      v-model="speedup"
      name="speedup"
      label="Simulation speed"
      theme="dark"
      :min="0.5"
      :max="10"
      :step="0.5"
      :format-display="(value: number) => `${value.toFixed(1)}×`"
    />
  </div>
</template>
