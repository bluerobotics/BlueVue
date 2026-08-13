<script setup lang="ts">
import { ref } from 'vue'

import { type BlueColumn, BlueChip, BlueTable } from '../../src'

const columns: BlueColumn[] = [
  { key: 'name', title: 'Vehicle', sortable: true },
  { key: 'frame', title: 'Frame', sortable: true },
  { key: 'uptime', title: 'Uptime', align: 'end', sortable: true, width: '110px' },
  { key: 'state', title: 'State', align: 'end', width: '120px' },
]

const rows = ref([
  { id: 1, name: 'Bluebird', frame: 'motorboat', uptime: 128, state: 'running' },
  { id: 2, name: 'Ariel', frame: 'catamaran', uptime: 12, state: 'stopped' },
  { id: 3, name: 'Nautilus', frame: 'vectored', uptime: 4096, state: 'running' },
  { id: 4, name: 'Pelican', frame: 'motorboat', uptime: null, state: 'failed' },
])

const TONE: Record<string, string> = { running: 'success', stopped: 'neutral', failed: 'error' }
</script>

<template>
  <BlueTable
    class="w-[560px]"
    :columns="columns"
    :rows="rows"
    row-key="id"
    sort-by="name"
    theme="dark"
    max-height="240px"
  >
    <template #cell-uptime="{ value }">
      {{ value == null ? '—' : `${value} min` }}
    </template>

    <template #cell-state="{ value }">
      <BlueChip
        size="small"
        :color="TONE[String(value)]"
        :label="String(value)"
      />
    </template>
  </BlueTable>
</template>
