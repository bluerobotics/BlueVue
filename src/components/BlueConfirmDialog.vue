<script setup lang="ts">
import { ref } from 'vue'

import BlueButton from './BlueButton.vue'
import BlueDialog from './BlueDialog.vue'

/**
 * Asks before something that cannot be taken back. The question is the title, what it will cost
 * is the message, and the committing button says what it does rather than saying yes.
 */
defineProps<{
  modelValue: boolean
  title: string
  /** What confirming will do, and to what. */
  message?: string
  /** Names the action rather than agreeing with the question: 'Delete', 'Restart', 'Overwrite'. */
  confirmLabel?: string
  cancelLabel?: string
  /** Colours the committing button as a warning, for anything destructive. */
  danger?: boolean
  icon?: string
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'confirm'): void
}>()

const dialogRef = ref<InstanceType<typeof BlueDialog> | null>(null)

function confirm(): void {
  dialogRef.value?.close()
  emit('confirm')
}
</script>

<template>
  <BlueDialog
    ref="dialogRef"
    :model-value="modelValue"
    :title="title"
    :icon="icon || (danger ? 'mdi-alert-outline' : 'mdi-help-circle-outline')"
    :icon-color="danger ? 'var(--bluevue-error)' : undefined"
    width="440px"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <p
      v-if="message"
      class="text-sm leading-relaxed text-[#ffffffcc]"
    >
      {{ message }}
    </p>
    <slot />

    <template #footer>
      <BlueButton
        variant="text"
        density="compact"
        @click="dialogRef?.close()"
      >
        {{ cancelLabel || 'Cancel' }}
      </BlueButton>
      <BlueButton
        variant="filled"
        density="compact"
        :color="danger ? 'var(--bluevue-error)' : undefined"
        @click="confirm"
      >
        {{ confirmLabel || 'Confirm' }}
      </BlueButton>
    </template>
  </BlueDialog>
</template>
