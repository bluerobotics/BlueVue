<script setup lang="ts">
import { BlueBannerGroup, type BannerContent } from '../../src'

const notes: BannerContent[] = [
  { text: 'This profile fades the wind to nothing at ground level, and the frame never leaves it.', severity: 'warning' },
  { text: 'Wind stands in for current on a surface vehicle.' },
  { text: 'Waves are ignored by this frame.', severity: 'warning' },
]
</script>

<template>
  <div class="max-w-[420px]">
    <BlueBannerGroup :banners="notes" />
    <p class="mt-4 text-xs text-[#ffffff66]">
      The row is narrower than any of the messages, so the opened note takes the room the others
      leave.
    </p>
  </div>
</template>
