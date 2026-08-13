<script setup lang="ts">
/**
 * A subject inside a panel: a quiet heading over a stack of rows. Smaller than a
 * BlueExpansiblePanel, which is a section of the page rather than a part of one, and not foldable.
 */
defineProps<{
  title: string
  /** Space between the rows, in pixels (default 12). */
  gap?: number
}>()
</script>

<template>
  <section>
    <div class="mb-2 flex items-center gap-2">
      <span class="text-[13px] uppercase tracking-wide text-[#ffffff88]">{{ title }}</span>
      <!-- Notes about the subject sit on its heading line, where they are read before the rows
           they qualify rather than after them. -->
      <slot name="notes" />
    </div>
    <div
      class="flex flex-col"
      :style="{ gap: `${gap ?? 12}px` }"
    >
      <slot />
    </div>
  </section>
</template>
