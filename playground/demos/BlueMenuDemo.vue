<script setup lang="ts">
import { ref } from 'vue'

import { BlueButton, BlueMenu, type BlueMenuItem } from '../../src'

const menuOpen = ref(false)
const pointerOpen = ref(false)
const pointerTarget = ref<[number, number]>([0, 0])

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

function openAtPointer(event: MouseEvent): void {
  pointerTarget.value = [event.clientX, event.clientY]
  pointerOpen.value = true
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-6">
    <BlueMenu
      v-model="menuOpen"
      :items="menuItems"
    >
      <template #activator="{ props: menuProps }">
        <BlueButton
          v-bind="menuProps"
          variant="icon"
          icon="mdi-dots-vertical"
          tooltip="Actions"
        />
      </template>
    </BlueMenu>

    <div
      class="cursor-context-menu rounded-[6px] border border-dashed border-[#ffffff33] px-4 py-3 text-sm text-[#ffffff99]"
      @contextmenu.prevent="openAtPointer"
    >
      Right-click here for a menu at the pointer
    </div>

    <BlueMenu
      v-model="pointerOpen"
      :items="menuItems"
      :target="pointerTarget"
    />
  </div>
</template>
