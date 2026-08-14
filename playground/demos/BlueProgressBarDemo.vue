<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

import { BlueProgressBar } from '../../src'

const written = ref(12)

// Walks the bar so the demo shows it moving rather than sitting at a number.
const timer = window.setInterval(() => {
  written.value = written.value >= 100 ? 0 : written.value + 4
}, 400)

onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="flex flex-col gap-5">
    <div>
      <div class="mb-2 flex items-baseline justify-between text-xs text-[#ffffff99]">
        <span>Writing parameters</span>
        <span>{{ written }}%</span>
      </div>
      <BlueProgressBar
        :model-value="written"
        label="Writing parameters"
      />
    </div>
    <div>
      <div class="mb-2 text-xs text-[#ffffff99]">
        Waiting for the autopilot
      </div>
      <BlueProgressBar
        indeterminate
        :height="6"
        color="#FFB74D"
      />
    </div>
  </div>
</template>
