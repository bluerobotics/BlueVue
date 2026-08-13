<script setup lang="ts">
import { BlueApp, BlueButton, BlueSection, BlueStat, BlueSwitch, useBlueLoading, useBlueSnackbar } from '../../src'
import { ref } from 'vue'

const armed = ref(false)
const { notify } = useBlueSnackbar()
const { showLoading, hideLoading } = useBlueLoading()

function refresh(): void {
  showLoading('Reading the vehicle configuration…', true)
  window.setTimeout(() => {
    hideLoading()
    notify('Vehicle configuration read', { severity: 'success' })
  }, 1600)
}
</script>

<template>
  <div>
    <!-- The page fills whatever it is given, so the preview gives it a window rather than the
         whole of the documentation page. -->
    <div class="overflow-hidden rounded-[8px] border border-[#ffffff14]">
      <BlueApp
        class="!min-h-full"
        title="SITL Manager"
        icon="mdi-ferry"
        width="100%"
      >
        <template #actions>
          <BlueButton
            variant="icon"
            icon="mdi-refresh"
            tooltip="Read the vehicle again"
            @click="refresh"
          />
        </template>

        <div class="mb-4 flex flex-wrap gap-2">
          <BlueStat
            label="Board"
            value="SITL"
          />
          <BlueStat
            label="Firmware"
            value="4.5.7"
          />
          <BlueStat label="Frame" />
        </div>

        <BlueSection title="Vehicle">
          <BlueSwitch
            v-model="armed"
            name="armed"
            label="Start armed"
            label-on="Armed"
            label-off="Safe"
            theme="dark"
          />
        </BlueSection>
      </BlueApp>
    </div>
    <p class="mt-3 text-xs text-[#ffffff66]">
      The refresh button raises a wait and then a notice, neither of which this page had to mount.
    </p>
  </div>
</template>
