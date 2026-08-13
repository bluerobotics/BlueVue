<script setup lang="ts">
import { computed, ref } from 'vue'

import { BlueTextarea } from '../../src'

const notes = ref('Tank test, propeller B.\nStarted with the current fully off.')
const parameters = ref('')

const invalid = computed(() =>
  parameters.value
    .split('\n')
    .filter((line) => line.trim() !== '' && !/^[A-Z0-9_]+[,\s]+-?\d/.test(line.trim()))
)
</script>

<template>
  <div class="flex w-[420px] flex-col gap-6">
    <BlueTextarea
      v-model="notes"
      name="notes"
      label="Notes"
      placeholder="What this run is for"
      theme="dark"
      auto-grow
    />

    <BlueTextarea
      v-model="parameters"
      name="parameters"
      label="Parameters"
      info-tooltip="One per line, as NAME,VALUE."
      placeholder="SIM_WIND_SPD,12&#10;SIM_WIND_DIR,270"
      theme="dark"
      :rows="5"
      :error-messages="invalid.length > 0 ? [`${invalid.length} line(s) are not NAME,VALUE`] : []"
    />
  </div>
</template>
