<script setup lang="ts">
import { ref } from 'vue'

import BlueIcon from './BlueIcon.vue'

/**
 * A place to drop a file on, which is also a place to press for the file picker. It hands the
 * files over and keeps none of them, so what is done with one, and whether it is any good, stays
 * with the consumer.
 */
const props = defineProps<{
  /** What the picker offers, as the accept attribute takes it (e.g. '.json,.param'). */
  accept?: string
  /** Takes more than one file at a time. */
  multiple?: boolean
  /** The line under the invitation, usually naming the formats that are understood. */
  hint?: string
  /** The invitation itself. */
  label?: string
  disabled?: boolean
  theme?: 'light' | 'dark'
}>()

const emit = defineEmits<{
  (event: 'files', files: File[]): void
}>()

const input = ref<HTMLInputElement>()
const hovering = ref(false)
// Dragging over a child fires leave on the parent, so the crossings are counted rather than
// treated as one, and the zone only cools down when the pointer has really left it.
const depth = ref(0)

const take = (files: FileList | null): void => {
  if (props.disabled || !files?.length) return
  emit('files', Array.from(files))
}

const onDrop = (event: DragEvent): void => {
  depth.value = 0
  hovering.value = false
  take(event.dataTransfer?.files ?? null)
}

const onPick = (event: Event): void => {
  const element = event.target as HTMLInputElement
  take(element.files)
  // Cleared so picking the same file twice in a row is still an event the second time.
  element.value = ''
}
</script>

<template>
  <div
    class="w-full"
    :class="disabled ? 'pointer-events-none opacity-30' : ''"
  >
    <button
      type="button"
      class="flex w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-[8px] border border-dashed px-4 py-6 text-center transition-colors"
      :class="[
        hovering
          ? 'border-[var(--bluevue-accent)] bg-[var(--bluevue-accent)]/10'
          : theme === 'light' ? 'border-[#00000033] hover:bg-[#00000006]' : 'border-[#ffffff33] hover:bg-[#ffffff08]',
        theme === 'light' ? 'text-black' : 'text-white',
      ]"
      @click="input?.click()"
      @dragenter.prevent="depth += 1; hovering = true"
      @dragover.prevent
      @dragleave.prevent="depth -= 1; hovering = depth > 0"
      @drop.prevent="onDrop"
    >
      <BlueIcon
        name="mdi-tray-arrow-up"
        :size="24"
        class="opacity-70"
      />
      <span class="text-[13px]">{{ label ?? 'Drop a file here, or press to choose one' }}</span>
      <span
        v-if="hint"
        class="text-[11px] opacity-60"
      >{{ hint }}</span>
    </button>

    <input
      ref="input"
      type="file"
      class="hidden"
      :accept="accept"
      :multiple="multiple"
      @change="onPick"
    >
  </div>
</template>
