<script setup lang="ts">
import { ref } from 'vue'

import { type BlueTab, BlueTabs } from '../../src'

const current = ref<string | number>('vehicle')

const tabs: BlueTab[] = [
  { value: 'vehicle', label: 'Vehicle', icon: 'mdi-ferry' },
  { value: 'environment', label: 'Environment', icon: 'mdi-weather-windy' },
  { value: 'logs', label: 'Logs', icon: 'mdi-file-document-outline', badge: 12 },
  { value: 'advanced', label: 'Advanced', disabled: true },
]

const BODIES: Record<string, string> = {
  vehicle: 'Board, frame and firmware live here.',
  environment: 'Wind, waves and current live here.',
  logs: 'Twelve runs have been recorded.',
}
</script>

<template>
  <div class="w-[440px]">
    <BlueTabs
      v-model="current"
      :tabs="tabs"
      theme="dark"
    />
    <div class="px-1 py-4 text-sm text-[#ffffffcc]">
      {{ BODIES[current] }}
    </div>
  </div>
</template>
