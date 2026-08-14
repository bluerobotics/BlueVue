<script setup lang="ts">
import { BlueApp, BlueButton, BlueExpansiblePanel, BlueStat, useBlueOs, useBlueSnackbar } from '@bluerobotics/bluevue'

const { vehicleName, version } = useBlueOs()
const { notify, notifyError } = useBlueSnackbar()

async function ping(): Promise<void> {
  try {
    const response = await fetch('./v1.0/health')
    if (!response.ok) throw new Error(response.statusText)
    notify('The extension backend answered.', { severity: 'success' })
  } catch (error) {
    notifyError(error, 'Could not reach the extension backend')
  }
}
</script>

<template>
  <BlueApp title="__TITLE__">
    <template #actions>
      <BlueButton
        variant="icon"
        icon="mdi-refresh"
        tooltip="Ask the backend"
        @click="ping"
      />
    </template>

    <div class="mb-4 flex flex-wrap gap-2">
      <BlueStat
        label="Vehicle"
        :value="vehicleName"
      />
      <BlueStat
        label="BlueOS"
        :value="version"
      />
    </div>

    <BlueExpansiblePanel
      title="Getting started"
      theme="dark"
      :expanded="true"
    >
      <p class="text-sm leading-relaxed text-[#ffffffcc]">
        This page is a BlueApp. The notices and the blocking wait are already mounted, so
        useBlueSnackbar and useBlueLoading work from anywhere. Replace this panel with yours.
      </p>
    </BlueExpansiblePanel>
  </BlueApp>
</template>
