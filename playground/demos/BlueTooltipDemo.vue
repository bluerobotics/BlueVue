<script setup lang="ts">
import { BlueButton, BlueTooltip } from '../../src'

const readings = 'Connected since 4:43 PM\n2 clients connected\nThis\t↑ 0.2 ↓ 17 kbps\nAll\t↑ 0.8 ↓ 63 kbps'
</script>

<template>
  <div class="flex flex-wrap items-center gap-6">
    <BlueTooltip text="Reads every value from the vehicle again">
      <BlueButton
        variant="icon"
        icon="mdi-refresh"
      />
    </BlueTooltip>

    <BlueTooltip
      text="Hangs off the right, and flips when there is no room there"
      placement="right"
    >
      <span class="cursor-help text-sm text-[#ffffff99] underline decoration-dotted">
        placement="right"
      </span>
    </BlueTooltip>

    <BlueTooltip
      text="Appears the moment the pointer arrives"
      :open-delay="0"
    >
      <span class="cursor-help text-sm text-[#ffffff99] underline decoration-dotted">
        no delay
      </span>
    </BlueTooltip>

    <BlueTooltip :text="readings">
      <span class="cursor-help text-sm text-[#ffffff99] underline decoration-dotted">
        lines and columns
      </span>
    </BlueTooltip>
  </div>
</template>
