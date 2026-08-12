<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

import BlueInput from './BlueInput.vue'

/**
 * Asks for a name, and optionally a note to go with it: icon and title over a subtitle, the
 * fields in their own section, then a footer whose middle explains what the buttons will do.
 */
const props = defineProps<{
  modelValue: boolean
  title: string
  /** Field label for the name. */
  label: string
  icon?: string
  /** Explains what the name will be attached to. */
  subtitle?: string
  initial?: string
  /** When given, a second optional field is shown and its value comes back with the name. */
  notesLabel?: string
  notesInitial?: string
  confirmLabel?: string
  /** Footer text, for anything worth saying about the outcome rather than the input. */
  hint?: string
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'confirm', name: string, notes: string): void
}>()

const name = ref(props.initial ?? '')
const notes = ref(props.notesInitial ?? '')
const dialogRef = ref<HTMLDialogElement | null>(null)

// Reset on open rather than on close, so the fields are right before the dialog animates in.
watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      name.value = props.initial ?? ''
      notes.value = props.notesInitial ?? ''
    }
    const el = dialogRef.value
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }
)

onMounted(() => {
  if (props.modelValue) dialogRef.value?.showModal()
})

function close(): void {
  // Every way out of the dialog closes the element, and its close event is what reports back,
  // so Escape and the backdrop need no separate handling.
  dialogRef.value?.close()
}

function confirm(): void {
  const trimmed = name.value.trim()
  if (!trimmed) return
  close()
  emit('confirm', trimmed, notes.value.trim())
}

// A click landing on the dialog itself is a click on the backdrop, since the panel covers the
// whole of the element's own box.
function onBackdropClick(event: MouseEvent): void {
  if (event.target === dialogRef.value) close()
}
</script>

<template>
  <dialog
    ref="dialogRef"
    class="bluevue-dialog"
    @close="emit('update:modelValue', false)"
    @click="onBackdropClick"
  >
    <div class="bluevue-panel w-[624px] max-w-full rounded-lg text-white">
      <div class="flex items-start gap-3 px-5 pt-4 pb-3">
        <span
          class="mdi mt-[2px] shrink-0 text-[22px] leading-none text-[#42A5F5]"
          :class="icon || 'mdi-content-save-outline'"
        />
        <div class="flex-1 min-w-0">
          <div class="text-base leading-tight truncate">
            {{ title }}
          </div>
          <div
            v-if="subtitle"
            class="text-xs text-[#ffffff88] mt-1 leading-relaxed"
          >
            {{ subtitle }}
          </div>
        </div>
        <button
          type="button"
          class="cursor-pointer text-[#ffffffaa] transition-colors hover:text-white"
          title="Close"
          @click="close"
        >
          <span class="mdi mdi-close text-[20px] leading-none" />
        </button>
      </div>

      <div class="flex flex-col gap-3 border-t border-[#ffffff0d] px-5 py-4">
        <BlueInput
          v-model="name"
          name="bluevue-prompt-name"
          :label="label"
          theme="dark"
          width="380px"
          autofocus
          @keydown.enter="confirm"
        />
        <BlueInput
          v-if="notesLabel"
          v-model="notes"
          name="bluevue-prompt-notes"
          :label="notesLabel"
          theme="dark"
          width="380px"
          @keydown.enter="confirm"
        />
      </div>

      <div class="flex items-center justify-between gap-3 border-t border-[#ffffff0d] px-5 py-3">
        <button
          type="button"
          class="h-7 shrink-0 cursor-pointer rounded-[4px] bg-[#ffffff11] px-3 text-[13px] font-medium uppercase tracking-wide transition-colors hover:bg-[#ffffff22]"
          @click="close"
        >
          Cancel
        </button>
        <span class="flex-1 text-center text-xs text-[#ffffff88]">{{ hint }}</span>
        <button
          type="button"
          :disabled="!name.trim()"
          class="h-7 shrink-0 rounded-[4px] bg-[var(--bluevue-primary)] px-3 text-[13px] font-medium uppercase tracking-wide transition-colors hover:brightness-125 disabled:cursor-not-allowed disabled:bg-[#9e9e9e80] disabled:text-[#afafaf] disabled:opacity-30 disabled:hover:brightness-100"
          :class="name.trim() ? 'cursor-pointer' : ''"
          @click="confirm"
        >
          {{ confirmLabel || 'Save' }}
        </button>
      </div>
    </div>
  </dialog>
</template>
