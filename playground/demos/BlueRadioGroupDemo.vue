<script setup lang="ts">
import { ref } from 'vue'

import { BlueRadioGroup, type BlueRadioItem } from '../../src'

const source = ref<string | number>('official')
const speed = ref<string | number>(1)

const sources: BlueRadioItem[] = [
  { label: 'Official firmware', value: 'official', hint: 'The stable build ArduPilot publishes.' },
  { label: 'Beta firmware', value: 'beta' },
  { label: 'Custom file', value: 'custom', hint: 'A build of your own, uploaded from this machine.' },
  { label: 'Latest nightly', value: 'nightly', disabled: true },
]

const speeds: BlueRadioItem[] = [
  { label: '1x', value: 1 },
  { label: '5x', value: 5 },
  { label: '10x', value: 10 },
]
</script>

<template>
  <div class="flex w-[340px] flex-col gap-6">
    <BlueRadioGroup
      v-model="source"
      name="firmware-source"
      label="Firmware source"
      :items="sources"
      theme="dark"
    />

    <BlueRadioGroup
      v-model="speed"
      name="sim-speed"
      label="Simulation speed"
      :items="speeds"
      inline
      theme="dark"
    />
  </div>
</template>
