<script setup lang="ts">
import { ref } from 'vue'

import { BlueWindRose } from '../../src'

const heading = ref(0)
const relative = ref(-45)
</script>

<template>
  <div class="flex flex-col gap-5">
    <BlueWindRose
      v-model="heading"
      name="heading"
      label="Heading"
      theme="dark"
      width="160px"
    />
    <BlueWindRose
      v-model="relative"
      name="relative"
      label="Relative"
      theme="dark"
      width="160px"
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
