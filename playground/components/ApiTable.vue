<script setup lang="ts">
import type { ApiRow } from '../catalog'

defineProps<{
  title: string
  rows: ApiRow[]
}>()
</script>

<template>
  <section
    v-if="rows.length"
    class="mt-8"
  >
    <h3 class="mb-3 text-xs font-medium uppercase tracking-wide text-[#ffffff66]">
      {{ title }}
    </h3>
    <div class="overflow-hidden rounded-[6px] border border-[#ffffff14]">
      <table class="w-full border-collapse text-left text-sm">
        <tbody>
          <tr
            v-for="(row, index) in rows"
            :key="row.name"
            :class="index % 2 ? 'bg-[#ffffff06]' : ''"
          >
            <td class="w-[190px] align-top px-3 py-2 font-mono text-[13px] text-[#8FD3F4]">
              {{ row.name }}
            </td>
            <td class="w-[170px] align-top px-3 py-2 font-mono text-[12px] text-[#ffffff88]">
              {{ row.type }}
            </td>
            <td class="align-top px-3 py-2 text-[13px] leading-relaxed text-[#ffffffcc]">
              {{ row.description }}
              <span
                v-if="row.default"
                class="text-[#ffffff66]"
              >Default {{ row.default }}.</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
