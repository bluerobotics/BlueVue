<script setup lang="ts">
import { computed, ref } from 'vue'

import { BlueCheckbox } from '../../src'

const streams = ref({ video: true, telemetry: false, logs: true })

const values = computed(() => Object.values(streams.value))
const all = computed(() => values.value.every(Boolean))
const some = computed(() => !all.value && values.value.some(Boolean))

const setAll = (on: boolean): void => {
  streams.value = { video: on, telemetry: on, logs: on }
}
</script>

<template>
  <div class="flex w-[320px] flex-col gap-3">
    <BlueCheckbox
      :model-value="all"
      :indeterminate="some"
      name="record-all"
      label="Record everything"
      theme="dark"
      @update:model-value="setAll"
    />

    <div class="flex flex-col gap-3 border-t border-[#ffffff14] pt-3">
      <BlueCheckbox
        v-model="streams.video"
        name="record-video"
        label="Video"
        theme="dark"
      />
      <BlueCheckbox
        v-model="streams.telemetry"
        name="record-telemetry"
        label="Telemetry"
        info-tooltip="Attitude, position and battery, at 4 Hz."
        theme="dark"
      />
      <BlueCheckbox
        v-model="streams.logs"
        name="record-logs"
        label="Autopilot logs"
        theme="dark"
      />
      <BlueCheckbox
        :model-value="false"
        name="record-sonar"
        label="Sonar"
        disabled
        theme="dark"
      />
    </div>
  </div>
</template>
