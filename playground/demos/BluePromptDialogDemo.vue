<script setup lang="ts">
import { ref } from 'vue'

import { BlueButton, BluePromptDialog } from '../../src'

const open = ref(false)
const saved = ref('')

function onConfirm(name: string, notes: string): void {
  saved.value = notes ? `${name} (${notes})` : name
}
</script>

<template>
  <div class="flex items-center gap-4">
    <BlueButton
      icon="mdi-content-save-outline"
      @click="open = true"
    >
      Save as…
    </BlueButton>
    <span
      v-if="saved"
      class="text-sm text-[#ffffff99]"
    >Saved: {{ saved }}</span>

    <BluePromptDialog
      v-model="open"
      title="Save configuration"
      subtitle="Names the configuration you are about to store."
      label="Name"
      notes-label="Notes"
      hint="Stored on the vehicle."
      @confirm="onConfirm"
    />
  </div>
</template>
