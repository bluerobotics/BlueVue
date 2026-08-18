<script setup lang="ts">
import { ref } from 'vue'

import { BlueSwitch } from '../../src'

const armed = ref(true)
const telemetry = ref(false)
</script>

<template>
  <div class="flex flex-col gap-5">
    <BlueSwitch
      v-model="armed"
      name="armed"
      label="Start armed"
      label-on="Armed"
      label-off="Safe"
      theme="dark"
    />
    <BlueSwitch
      v-model="telemetry"
      name="telemetry"
      label="Telemetry"
      theme="dark"
      info-tooltip="Streams the vehicle's state to the ground station."
    />
    <BlueSwitch
      :model-value="false"
      name="out-of-reach"
      label="Out of reach"
      theme="dark"
      info-tooltip="Needs a companion computer on the vehicle."
      disabled
    />
  </div>
</template>
