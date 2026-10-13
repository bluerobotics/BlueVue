<script setup lang="ts">
import { ref } from 'vue'

import { BlueRange } from '../../src'

const servo = ref([1100, 1500, 1900])
const depth = ref([5, 40])
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <span class="text-sm text-white">Servo output: {{ servo.join(' / ') }} µs</span>
      <BlueRange
        v-model="servo"
        theme="dark"
        :min="500"
        :max="2200"
        :step="10"
        :handle-labels="['Min', 'Trim', 'Max']"
        :format="(value: number) => `${value} µs`"
      />
    </div>
    <div class="flex flex-col gap-2">
      <span class="text-sm text-white">Survey depth: {{ depth[0] }} to {{ depth[1] }} m</span>
      <BlueRange
        v-model="depth"
        theme="dark"
        :min="0"
        :max="100"
        :handle-labels="['Shallowest', 'Deepest']"
        :format="(value: number) => `${value} m`"
      />
    </div>
  </div>
</template>
