<script setup lang="ts">
import { ref, watch } from 'vue'

import BlueButton from './BlueButton.vue'
import BlueDialog from './BlueDialog.vue'
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
const dialogRef = ref<InstanceType<typeof BlueDialog> | null>(null)

// Reset on open rather than on close, so the fields are right before the dialog animates in.
watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    name.value = props.initial ?? ''
    notes.value = props.notesInitial ?? ''
  }
)

function confirm(): void {
  const trimmed = name.value.trim()
  if (!trimmed) return
  dialogRef.value?.close()
  emit('confirm', trimmed, notes.value.trim())
}
</script>

<template>
  <BlueDialog
    ref="dialogRef"
    :model-value="modelValue"
    :title="title"
    :subtitle="subtitle"
    :icon="icon || 'mdi-content-save-outline'"
    body-class="flex flex-col gap-3 px-5 py-4"
    @update:model-value="emit('update:modelValue', $event)"
  >
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

    <template #footer>
      <BlueButton
        density="compact"
        @click="dialogRef?.close()"
      >
        Cancel
      </BlueButton>
      <span class="flex-1 text-center text-xs text-[#ffffff88]">{{ hint }}</span>
      <BlueButton
        variant="filled"
        density="compact"
        :disabled="!name.trim()"
        @click="confirm"
      >
        {{ confirmLabel || 'Save' }}
      </BlueButton>
    </template>
  </BlueDialog>
</template>
