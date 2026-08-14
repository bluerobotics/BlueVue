<script setup lang="ts">
import { ref } from 'vue'

import { BlueSelect } from '../../src'

const vehicle = ref('BlueBoat')
const streams = ref<string[]>(['Camera 1'])
</script>

<template>
  <div class="flex flex-col gap-5">
    <BlueSelect
      v-model="vehicle"
      label="Vehicle type"
      theme="dark"
      width="240px"
      :items="[{ name: 'BlueBoat' }, { name: 'BlueROV2' }, { name: 'Rover', disabled: true }]"
      info-tooltip="A frame is a physics model built into one firmware."
    />
    <BlueSelect
      v-model="streams"
      label="Video streams"
      theme="dark"
      width="240px"
      multi-select
      :items="[{ name: 'Camera 1' }, { name: 'Camera 2' }, { name: 'Screen' }]"
    />
  </div>
</template>
