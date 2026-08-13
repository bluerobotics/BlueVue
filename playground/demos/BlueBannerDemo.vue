<script setup lang="ts">
import { BlueBanner } from '../../src'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <BlueBanner
      text="The BlueBoat frame ignores wind: it never leaves the surface."
      severity="warning"
      :expanded="false"
    />
    <BlueBanner
      text="Wind stands in for current on this frame."
      :expanded="false"
    />
    <BlueBanner
      text="Parameters written."
      severity="success"
      :expanded="false"
    />
    <BlueBanner
      text="Click any of them: the note is only as wide as its message while it is open."
      severity="error"
      :expanded="false"
    />
  </div>
</template>
