<script setup lang="ts">
import { ref } from 'vue'

import { BlueWindRose } from '../../src'

const wind = ref(315)
const heading = ref(0)
const relative = ref(-45)
</script>

<template>
  <div class="flex flex-col gap-5">
    <BlueWindRose
      v-model="wind"
      name="wind"
      label="Wind"
      theme="dark"
      width="160px"
      info-tooltip="A wind is named for where it comes from, so the arrow flies in from the rim."
    />
    <BlueWindRose
      v-model="heading"
      name="heading"
      label="Heading"
      theme="dark"
      width="160px"
      angle
      info-tooltip="A heading is an angle rather than a wind, so the rose marks it with a bar."
    />
    <BlueWindRose
      v-model="relative"
      name="relative"
      label="Relative"
      theme="dark"
      width="160px"
      angle
      :min="-180"
      :max="180"
      info-tooltip="The same rose, mapped onto −180° to 180°."
    />
    <BlueWindRose
      :model-value="118"
      name="out-of-reach"
      label="Out of reach"
      theme="dark"
      width="160px"
      info-tooltip="Both the label and this icon fade with the field."
      disabled
    />
  </div>
</template>
