<script setup lang="ts">
import { computed, ref } from 'vue'

import BlueIcon from './BlueIcon.vue'

/** One column of the table. */
export interface BlueColumn {
  /** The field it reads from each row, and the name of its cell slot. */
  key: string
  title: string
  width?: string
  align?: 'start' | 'center' | 'end'
  /** Lets the header be pressed to order the rows by this column. */
  sortable?: boolean
}

/**
 * Rows of records under a header that stays put while they scroll. Sorting is its own, so a
 * consumer hands it a list and gets an ordered table without keeping the order itself.
 */
const props = defineProps<{
  columns: BlueColumn[]
  rows: Record<string, unknown>[]
  /** The field that identifies a row. Falls back to the row's place in the list. */
  rowKey?: string
  /** Column to order by before anyone presses a header. */
  sortBy?: string
  /** How tall the body may get before it scrolls under its header. */
  maxHeight?: string
  /** Tighter rows, for a table of many short ones. */
  dense?: boolean
  /** What to say instead of an empty body. */
  emptyText?: string
  theme?: 'light' | 'dark'
}>()

defineEmits<{
  (event: 'row-click', row: Record<string, unknown>): void
}>()

const sortKey = ref(props.sortBy ?? '')
const sortDesc = ref(false)

const toggleSort = (column: BlueColumn): void => {
  if (!column.sortable) return
  if (sortKey.value === column.key) {
    sortDesc.value = !sortDesc.value
    return
  }
  sortKey.value = column.key
  sortDesc.value = false
}

// Numbers compare as numbers and everything else as text, which is what keeps 9 above 10 from
// happening in a column of counts. Absent values sink, since a row missing the field it is being
// ordered by has nothing to say about where it belongs.
const compare = (a: unknown, b: unknown): number => {
  if (a == null) return b == null ? 0 : 1
  if (b == null) return -1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b), undefined, { numeric: true })
}

const sorted = computed(() => {
  if (!sortKey.value) return props.rows
  const direction = sortDesc.value ? -1 : 1
  return [...props.rows].sort((a, b) => direction * compare(a[sortKey.value], b[sortKey.value]))
})

const alignment = (column: BlueColumn): string =>
  column.align === 'end' ? 'text-end' : column.align === 'center' ? 'text-center' : 'text-start'
</script>

<template>
  <div
    class="w-full overflow-auto rounded-[6px]"
    :class="theme === 'light' ? 'bg-[#00000006]' : 'bg-[#ffffff08]'"
    :style="{ maxHeight }"
  >
    <table class="w-full border-collapse text-[13px]">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            scope="col"
            class="sticky top-0 z-[1] whitespace-nowrap border-b px-3 py-2 text-[11px] font-medium uppercase tracking-wide backdrop-blur-sm"
            :class="[
              alignment(column),
              column.sortable ? 'cursor-pointer select-none' : '',
              theme === 'light'
                ? 'border-[#00000014] bg-[#f5f5f5cc] text-[#00000088]'
                : 'border-[#ffffff14] bg-[#1e1e1ecc] text-[#ffffff88]',
            ]"
            :style="{ width: column.width }"
            :aria-sort="sortKey === column.key ? (sortDesc ? 'descending' : 'ascending') : undefined"
            @click="toggleSort(column)"
          >
            <span class="inline-flex items-center gap-1">
              {{ column.title }}
              <BlueIcon
                v-if="column.sortable"
                :name="sortKey === column.key ? (sortDesc ? 'mdi-arrow-down' : 'mdi-arrow-up') : 'mdi-arrow-up-down'"
                :size="12"
                :class="sortKey === column.key ? '' : 'opacity-30'"
              />
            </span>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(row, index) in sorted"
          :key="String(rowKey ? row[rowKey] : index)"
          class="transition-colors"
          :class="theme === 'light' ? 'hover:bg-[#0000000a]' : 'hover:bg-[#ffffff0a]'"
          @click="$emit('row-click', row)"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            class="border-b px-3"
            :class="[
              alignment(column),
              dense ? 'py-1' : 'py-2',
              theme === 'light' ? 'border-[#0000000a] text-black' : 'border-[#ffffff0a] text-white',
            ]"
          >
            <slot
              :name="`cell-${column.key}`"
              :row="row"
              :value="row[column.key]"
            >
              {{ row[column.key] ?? '—' }}
            </slot>
          </td>
        </tr>

        <tr v-if="sorted.length === 0">
          <td
            :colspan="columns.length"
            class="px-3 py-6 text-center text-[13px]"
            :class="theme === 'light' ? 'text-[#00000066]' : 'text-[#ffffff66]'"
          >
            <slot name="empty">
              {{ emptyText ?? 'Nothing here yet.' }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
