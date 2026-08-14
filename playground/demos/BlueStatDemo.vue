<script setup lang="ts">
import { BlueStat } from '../../src'
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <BlueStat
      label="Board"
      value="SITL"
    />
    <BlueStat
      label="Firmware"
      value="ArduPilot 4.5.7 (official)"
    />
    <BlueStat
      label="Frame"
      value="motorboat"
    />
    <BlueStat label="Vehicle type" />
  </div>
</template>
