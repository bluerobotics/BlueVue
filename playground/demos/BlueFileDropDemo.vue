<script setup lang="ts">
import { ref } from 'vue'

import { BlueChip, BlueFileDrop } from '../../src'

const taken = ref<File[]>([])
</script>

<template>
  <div class="flex w-[420px] flex-col gap-3">
    <BlueFileDrop
      accept=".json,.param"
      multiple
      hint="Profiles saved from this page, or ArduPilot parameter files"
      theme="dark"
      @files="taken = $event"
    />

    <div
      v-if="taken.length > 0"
      class="flex flex-wrap gap-2"
    >
      <BlueChip
        v-for="file in taken"
        :key="file.name"
        icon="mdi-file-outline"
        :label="`${file.name} (${Math.ceil(file.size / 1024)} kB)`"
      />
    </div>
  </div>
</template>
