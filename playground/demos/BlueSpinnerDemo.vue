<script setup lang="ts">
import { BlueSpinner } from '../../src'
</script>

<template>
  <div class="flex items-center gap-6">
    <BlueSpinner :size="16" />
    <BlueSpinner :size="24" />
    <BlueSpinner
      :size="36"
      :width="3"
      color="#FFB74D"
    />
    <span class="flex items-center gap-2 text-sm text-[#ffffff99]">
      <BlueSpinner
        :size="14"
        label="Reading the vehicle"
      />
      Reading the vehicle
    </span>
  </div>
</template>
