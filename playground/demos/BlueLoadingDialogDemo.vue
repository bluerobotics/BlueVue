<script setup lang="ts">
import { ref } from 'vue'

import { BlueButton, BlueLoadingDialog } from '../../src'

const blocking = ref(false)
const dismissible = ref(false)

// Nothing here is actually restarting, so the blocking overlay comes down on a timer.
function flash(): void {
  blocking.value = true
  window.setTimeout(() => (blocking.value = false), 2500)
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <BlueButton @click="flash">
      Blocking wait
    </BlueButton>
    <BlueButton @click="dismissible = true">
      Dismissible wait
    </BlueButton>

    <BlueLoadingDialog
      v-model="blocking"
      message="Restarting the autopilot…"
    />
    <BlueLoadingDialog
      v-model="dismissible"
      message="Reading the vehicle configuration…"
      dismissible
    />
  </div>
</template>
