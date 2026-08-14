<script setup lang="ts">
import { ref } from 'vue'

import { BlueChip } from '../../src'

const tags = ref(['tank', 'propeller-b', 'wind-270'])
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center gap-2">
      <BlueChip
        color="success"
        icon="mdi-check-circle"
        label="Running"
      />
      <BlueChip
        color="warning"
        label="Disarmed"
      />
      <BlueChip
        color="error"
        variant="filled"
        icon="mdi-alert"
        label="No heartbeat"
      />
      <BlueChip
        color="info"
        variant="outlined"
        label="SITL"
      />
      <BlueChip
        size="small"
        label="4"
      />
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <BlueChip
        v-for="tag in tags"
        :key="tag"
        :label="tag"
        color="#7E57C2"
        closable
        @close="tags = tags.filter((other) => other !== tag)"
      />
      <span
        v-if="tags.length === 0"
        class="text-xs text-[#ffffff66]"
      >All of them are gone. Reload the page to bring them back.</span>
    </div>
  </div>
</template>
