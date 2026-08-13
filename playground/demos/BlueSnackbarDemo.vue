<script setup lang="ts">
import { BlueButton, useBlueSnackbar } from '../../src'

const { notify, notifyError } = useBlueSnackbar()
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <BlueButton
      icon="mdi-check"
      @click="notify('Configuration applied', { severity: 'success' })"
    >
      Success
    </BlueButton>
    <BlueButton
      icon="mdi-alert-outline"
      @click="notify('The vehicle is not a simulation', { severity: 'warning' })"
    >
      Warning
    </BlueButton>
    <BlueButton
      icon="mdi-alert-circle-outline"
      @click="notifyError({ response: { data: { detail: 'The autopilot refused SIM_WIND_SPD' } } })"
    >
      Failure
    </BlueButton>
    <BlueButton
      variant="text"
      @click="notify('Still waiting for the autopilot')"
    >
      Say the same thing again
    </BlueButton>
  </div>
</template>
