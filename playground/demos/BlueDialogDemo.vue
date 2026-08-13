<script setup lang="ts">
import { ref } from 'vue'

import { BlueButton, BlueDialog, BlueInput } from '../../src'

const open = ref(false)
const persistent = ref(false)
const port = ref(14550)
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <BlueButton
      icon="mdi-tune"
      @click="open = true"
    >
      Open a dialog
    </BlueButton>
    <BlueButton
      variant="text"
      @click="persistent = true"
    >
      Persistent
    </BlueButton>

    <BlueDialog
      v-model="open"
      title="Endpoint"
      subtitle="Where the autopilot sends its telemetry."
      icon="mdi-lan-connect"
      width="440px"
    >
      <BlueInput
        v-model="port"
        name="port"
        label="UDP port"
        type="number"
        theme="dark"
        width="180px"
      />

      <template #footer>
        <BlueButton
          variant="text"
          density="compact"
          @click="open = false"
        >
          Cancel
        </BlueButton>
        <BlueButton
          variant="filled"
          density="compact"
          @click="open = false"
        >
          Save
        </BlueButton>
      </template>
    </BlueDialog>

    <BlueDialog
      v-model="persistent"
      title="Persistent"
      subtitle="No backdrop, no Escape, no close button: the footer is the only way out."
      persistent
      width="440px"
    >
      <p class="text-sm text-[#ffffffcc]">
        For anything that must not be left running under a live page.
      </p>

      <template #footer>
        <span class="text-xs text-[#ffffff88]">Nothing else can be touched until this is answered.</span>
        <BlueButton
          variant="filled"
          density="compact"
          @click="persistent = false"
        >
          Understood
        </BlueButton>
      </template>
    </BlueDialog>
  </div>
</template>
