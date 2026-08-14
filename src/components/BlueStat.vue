<script setup lang="ts">
/**
 * One read-only fact about the vehicle: a quiet label over its value. Meant to sit in a row of
 * them, each taking an equal share of the width and wrapping to the next line when there is none.
 */
defineProps<{
  label: string
  value?: string | number | null
  /** What to show when there is no value yet (default an em dash). */
  placeholder?: string
}>()
</script>

<template>
  <div class="bluevue-elevation-1 min-w-[120px] flex-1 rounded-[6px] bg-[#00000022] px-3 py-2">
    <div class="truncate text-[11px] uppercase tracking-wide text-[#ffffff66]">
      {{ label }}
    </div>
    <div
      class="truncate text-sm text-white"
      :title="value === null || value === undefined || value === '' ? undefined : String(value)"
    >
      {{ value === null || value === undefined || value === '' ? placeholder ?? '—' : value }}
    </div>
  </div>
</template>
