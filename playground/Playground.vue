<script setup lang="ts">
import { ref } from 'vue'

import {
  BlueButtonGroup,
  BlueExpansiblePanel,
  BlueInput,
  BlueLoadingDialog,
  BlueMenu,
  type BlueMenuItem,
  BluePromptDialog,
  BlueSelect,
  BlueSlider,
  BlueSwitch,
} from '../src'

const text = ref('BlueBoat SITL')
const latitude = ref(-27.563)
const vehicle = ref('BlueBoat')
const speed = ref(40)
const armed = ref(true)
const promptOpen = ref(false)
const menuOpen = ref(false)
const contextOpen = ref(false)
const contextTarget = ref<[number, number]>([0, 0])
const loadingOpen = ref(false)

const vehicles = [{ name: 'BlueBoat' }, { name: 'BlueROV2' }, { name: 'Rover', disabled: true }]

const menuItems: BlueMenuItem[] = [
  { title: 'Save current config', icon: 'mdi-content-save-outline', action: () => undefined },
  { title: 'Download file', icon: 'mdi-download-outline', action: () => undefined },
  {
    title: 'Delete',
    icon: 'mdi-delete-outline',
    danger: true,
    disabled: true,
    hint: 'Nothing selected',
    action: () => undefined,
  },
]

// The loading overlay cannot be dismissed, so the playground takes it down on a timer.
function flashLoading(): void {
  loadingOpen.value = true
  window.setTimeout(() => (loadingOpen.value = false), 2500)
}

function openContextMenu(event: MouseEvent): void {
  contextTarget.value = [event.clientX, event.clientY]
  contextOpen.value = true
}
</script>

<template>
  <div
    class="min-h-screen bg-[#132029] p-6"
    @contextmenu.prevent="openContextMenu"
  >
    <div class="bluevue-panel mx-auto w-[760px] rounded-lg px-6 py-4 text-white">
      <BlueExpansiblePanel
        title="Controls"
        theme="dark"
        :expanded="true"
      >
        <div class="flex flex-col gap-5">
          <BlueInput
            v-model="text"
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
            :error-messages="latitude < -90 ? ['Outside the supported range'] : []"
          />
          <BlueSelect
            v-model="vehicle"
            label="Vehicle type"
            theme="dark"
            width="240px"
            :items="vehicles"
          />
          <BlueSlider
            v-model="speed"
            name="speed"
            label="Wind speed"
            theme="dark"
            :min="0"
            :max="100"
            :step="1"
            width="240px"
          />
          <BlueSwitch
            v-model="armed"
            name="armed"
            label="Start armed"
            label-on="Armed"
            label-off="Safe"
            theme="dark"
          />
          <BlueButtonGroup
            label="Speedup"
            theme="dark"
            type="switch"
            :button-items="[{ name: '1x', preSelected: true }, { name: '5x' }, { name: '10x' }]"
            :buttons-menu="[{ name: 'Custom…', action: () => undefined }]"
          />
          <div class="flex items-center justify-end gap-3">
            <button
              type="button"
              class="h-7 cursor-pointer rounded-[4px] bg-[#ffffff11] px-3 text-[13px]"
              @click="promptOpen = true"
            >
              Prompt dialog
            </button>
            <button
              type="button"
              class="h-7 cursor-pointer rounded-[4px] bg-[#ffffff11] px-3 text-[13px]"
              @click="flashLoading"
            >
              Loading overlay
            </button>
            <BlueMenu
              v-model="menuOpen"
              :items="menuItems"
            >
              <template #activator="{ props: menuProps }">
                <button
                  v-bind="menuProps"
                  type="button"
                  class="cursor-pointer rounded-[6px] px-1 py-1 text-[#ffffffaa] hover:text-white"
                  title="Actions"
                >
                  <span class="mdi mdi-dots-vertical text-[24px] leading-none" />
                </button>
              </template>
            </BlueMenu>
          </div>
          <p class="text-center text-xs text-[#ffffff66]">
            Right-click anywhere for the pointer-anchored menu.
          </p>
        </div>
      </BlueExpansiblePanel>
    </div>

    <BlueMenu
      v-model="contextOpen"
      :items="menuItems"
      :target="contextTarget"
    />

    <BluePromptDialog
      v-model="promptOpen"
      title="Save configuration"
      subtitle="Names the configuration you are about to store."
      label="Name"
      notes-label="Notes"
      hint="Stored on the vehicle."
    />

    <BlueLoadingDialog
      v-model="loadingOpen"
      message="Restarting the autopilot…"
    />
  </div>
</template>
