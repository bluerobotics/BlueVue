<script setup lang="ts">
import { BlueBanner, BlueButton, BlueStat, BlueSwitch, useBlueOs, useBlueOsSetting } from '../../src'

const { vehicleName, hostname, version, embedded, error, refresh } = useBlueOs()

const verbose = useBlueOsSetting('bluevue-docs/verbose', false)
</script>

<template>
  <div class="flex w-[460px] flex-col gap-3">
    <BlueBanner
      v-if="error"
      severity="info"
      :text="`This page is not being served by a vehicle, so there is nothing to ask: ${error.message}`"
    />

    <div class="flex flex-wrap gap-2">
      <BlueStat
        label="Vehicle"
        :value="vehicleName"
      />
      <BlueStat
        label="Hostname"
        :value="hostname"
      />
      <BlueStat
        label="BlueOS"
        :value="version"
      />
    </div>

    <BlueSwitch
      v-model="verbose"
      name="verbose"
      label="Verbose logging"
      info-tooltip="Kept on the vehicle, not in this browser."
      theme="dark"
    />

    <BlueButton
      class="self-start"
      variant="text"
      density="compact"
      icon="mdi-refresh"
      @click="refresh"
    >
      {{ embedded ? 'Read again' : 'Read again (this page is not an extension)' }}
    </BlueButton>
  </div>
</template>
