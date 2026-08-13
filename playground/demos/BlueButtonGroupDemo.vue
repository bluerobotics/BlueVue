<script setup lang="ts">
import { ref } from 'vue'

import { BlueButtonGroup, BlueMenu, type BlueMenuItem } from '../../src'

const menuOpen = ref(false)
const menuTarget = ref<[number, number]>([0, 0])
const held = ref('')

const menuItems: BlueMenuItem[] = [
  { title: 'Rename', icon: 'mdi-pencil-outline', action: () => undefined },
  { title: 'Delete', icon: 'mdi-delete-outline', danger: true, action: () => undefined },
]

// What a preset row does with the event: the pointer position places the menu, and the item it
// was opened on decides what the menu offers.
function onContextMenu({ item, x, y }: { item: { name: string }; x: number; y: number }): void {
  held.value = item.name
  menuTarget.value = [x, y]
  menuOpen.value = true
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <BlueButtonGroup
      label="Speedup"
      theme="dark"
      type="switch"
      :button-items="[{ name: '1x', preSelected: true }, { name: '5x' }, { name: '10x' }]"
      :buttons-menu="[{ name: 'Custom…', action: () => undefined }]"
    />
    <BlueButtonGroup
      label="Spawn location"
      theme="dark"
      type="switch"
      density="compact"
      info-tooltip="Right-click or hold a preset for its actions."
      :button-items="[{ name: 'Sydney' }, { name: 'Santiago', preSelected: true }, { name: 'Lake' }]"
      @context-menu="onContextMenu"
    />
    <BlueButtonGroup
      label="Overlays"
      theme="dark"
      type="toggle"
      :button-items="[{ name: 'Wind', preSelected: true }, { name: 'Waves' }, { name: 'Current', disabled: true }]"
    />

    <BlueMenu
      v-model="menuOpen"
      :items="menuItems"
      :target="menuTarget"
    />
  </div>
</template>
