<script setup lang="ts">
import { ref } from 'vue'

import { type BannerContent, BlueBannerGroup, BlueSection, BlueSlider, BlueSwitch } from '../../src'

const speed = ref(12)
const gusts = ref(false)

const notes: BannerContent[] = [
  { text: 'This profile fades the wind to nothing at ground level.', severity: 'warning' },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <BlueSection title="Wind">
      <template #notes>
        <BlueBannerGroup :banners="notes" />
      </template>

      <BlueSlider
        v-model="speed"
        name="wind-speed"
        label="Speed"
        theme="dark"
        :min="0"
        :max="60"
      />
      <BlueSwitch
        v-model="gusts"
        name="gusts"
        label="Gusts"
        theme="dark"
      />
    </BlueSection>

    <BlueSection title="Waves & current">
      <BlueSlider
        v-model="speed"
        name="wave-height"
        label="Wave height"
        theme="dark"
        :min="0"
        :max="10"
      />
    </BlueSection>
  </div>
</template>
