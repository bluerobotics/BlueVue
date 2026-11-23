<script setup lang="ts">
import { ref } from 'vue'

import { BlueColorPicker } from '../../src'

const track = ref('#1f7aa8')
const fence = ref('#ef5350')
</script>

<template>
  <div class="flex flex-col gap-5">
    <BlueColorPicker
      v-model="track"
      name="track-color"
      reset-value="#1f7aa8"
      label="Track color"
      theme="dark"
    />
    <BlueColorPicker
      v-model="fence"
      name="fence-color"
      label="Fence color"
      theme="dark"
      info-tooltip="Drawn around the geofence on the map."
    />
    <BlueColorPicker
      model-value="#90a4ae"
      name="out-of-reach"
      label="Out of reach"
      theme="dark"
      disabled
    />
  </div>
</template>
