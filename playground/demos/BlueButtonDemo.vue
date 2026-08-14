<script setup lang="ts">
import { ref } from 'vue'

import { BlueButton } from '../../src'

const applying = ref(false)

// The demo has nothing to wait for, so it waits for a moment on purpose.
function apply(): void {
  applying.value = true
  window.setTimeout(() => (applying.value = false), 1800)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center gap-3">
      <BlueButton
        variant="filled"
        icon="mdi-check"
        :loading="applying"
        @click="apply"
      >
        Apply
      </BlueButton>
      <BlueButton icon="mdi-restore">
        Reset
      </BlueButton>
      <BlueButton variant="text">
        Cancel
      </BlueButton>
      <BlueButton
        variant="icon"
        icon="mdi-refresh"
        tooltip="Read the vehicle again"
      />
      <BlueButton
        variant="filled"
        disabled
      >
        Out of reach
      </BlueButton>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <BlueButton density="compact">
        Compact
      </BlueButton>
      <BlueButton>Regular</BlueButton>
      <BlueButton density="comfortable">
        Comfortable
      </BlueButton>
    </div>
  </div>
</template>
