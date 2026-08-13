<script setup lang="ts">
import { BlueIcon } from '../../src'
</script>

<template>
  <div class="flex items-center gap-6">
    <BlueIcon name="mdi-ferry" />
    <BlueIcon
      name="mdi-weather-windy"
      :size="28"
    />
    <BlueIcon
      name="mdi-alert-circle-outline"
      color="#FFB74D"
      :size="28"
    />
    <BlueIcon
      name="mdi-refresh"
      :size="28"
      spin
    />
    <span class="text-sm text-[#ffffff99]">
      <BlueIcon
        name="map-marker"
        :size="16"
      />
      beside text, at the size of the text
    </span>
  </div>
</template>
