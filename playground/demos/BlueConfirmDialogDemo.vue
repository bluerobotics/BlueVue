<script setup lang="ts">
import { ref } from 'vue'

import { BlueButton, BlueConfirmDialog } from '../../src'

const open = ref(false)
const outcome = ref('')
</script>

<template>
  <div class="flex items-center gap-4">
    <BlueButton
      icon="mdi-delete-outline"
      @click="open = true"
    >
      Delete preset
    </BlueButton>
    <span
      v-if="outcome"
      class="text-sm text-[#ffffff99]"
    >{{ outcome }}</span>

    <BlueConfirmDialog
      v-model="open"
      title="Delete “Sydney Harbour”?"
      message="The preset is stored on the vehicle and cannot be recovered once it is gone."
      confirm-label="Delete"
      danger
      @confirm="outcome = 'Deleted'"
    />
  </div>
</template>
