<script setup lang="ts">
import { ref } from 'vue'

import { BlueExpansiblePanel, BlueSwitch } from '../../src'

const logging = ref(true)
</script>

<template>
  <div class="flex flex-col">
    <BlueExpansiblePanel
      title="Vehicle & frame"
      theme="dark"
      :expanded="true"
    >
      <p class="text-sm leading-relaxed text-[#ffffff99]">
        The body is a slot, so a section holds whatever the page needs: fields, a map, a table.
      </p>
    </BlueExpansiblePanel>
    <BlueExpansiblePanel
      title="Advanced"
      theme="dark"
    >
      <BlueSwitch
        v-model="logging"
        name="logging"
        label="Verbose logging"
        theme="dark"
      />
    </BlueExpansiblePanel>
  </div>
</template>
