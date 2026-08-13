<script setup lang="ts">
import { BlueButton, BlueCard, BlueStat } from '../../src'
</script>

<template>
  <BlueCard
    title="Vehicle"
    icon="mdi-ferry"
    width="460px"
  >
    <template #actions>
      <BlueButton
        variant="icon"
        icon="mdi-dots-vertical"
        tooltip="Actions"
      />
    </template>

    <div class="flex flex-wrap gap-2">
      <BlueStat
        label="Board"
        value="SITL"
      />
      <BlueStat
        label="Vehicle type"
        value="Boat"
      />
    </div>

    <template #footer>
      <span class="text-xs text-[#ffffff88]">Read a moment ago.</span>
      <BlueButton
        variant="filled"
        density="compact"
      >
        Apply
      </BlueButton>
    </template>
  </BlueCard>
</template>
