<script setup lang="ts">
import { ref } from 'vue'

import { BlueInput } from '../../src'

const name = ref('BlueBoat SITL')
const latitude = ref(-27.563)
</script>

<template>
  <div class="flex flex-col gap-5">
    <BlueInput
      v-model="name"
      name="name"
      label="Name"
      theme="dark"
      width="240px"
    />
    <BlueInput
      v-model="latitude"
      name="latitude"
      label="Latitude"
      type="number"
      suffix="deg"
      theme="dark"
      width="240px"
      :step="0.001"
      info-tooltip="Arrow keys step by 0.001."
      :error-messages="latitude < -90 || latitude > 90 ? ['Outside the supported range'] : []"
    />
    <BlueInput
      v-model="name"
      name="disabled"
      label="Out of reach"
      theme="dark"
      width="240px"
      info-tooltip="The hint stays readable while the row is faded, since it is often where the reason lives."
      disabled
    />
  </div>
</template>
