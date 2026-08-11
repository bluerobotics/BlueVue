<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

import logo from '../assets/br-logo-white.svg'

/**
 * A blocking overlay for an operation that is under way, such as a vehicle restarting. It is up
 * for exactly as long as `modelValue` says it is, and unless it is dismissible there is no way
 * out of it.
 */
const props = defineProps<{
  modelValue: boolean
  /** What the operation is, shown under the propeller. */
  message?: string
  /** Offers a close button and lets Escape through, for a wait the user may walk away from. */
  dismissible?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)

const sync = (show: boolean): void => {
  const el = dialogRef.value
  if (!el) return
  if (show && !el.open) el.showModal()
  if (!show && el.open) el.close()
}

const close = (): void => emit('update:modelValue', false)

// Escape closes a dismissible overlay through the same path as the button, so the caller's
// state follows the dialog instead of thinking it is still up.
const onCancel = (event: Event): void => {
  event.preventDefault()
  if (props.dismissible) close()
}

onMounted(() => sync(props.modelValue))
watch(() => props.modelValue, sync)
</script>

<template>
  <!-- Escape is swallowed unless the wait is dismissible: an operation the user cannot
       interrupt must not end up running under a live page. -->
  <dialog
    ref="dialogRef"
    class="bluevue-dialog"
    @cancel="onCancel"
  >
    <div class="bluevue-panel relative flex w-[320px] flex-col items-center justify-center rounded-lg px-6 pt-7 pb-5">
      <button
        v-if="dismissible"
        type="button"
        class="absolute right-3 top-3 cursor-pointer text-[#ffffffaa] transition-colors hover:text-white"
        title="Close"
        @click="close"
      >
        <span class="mdi mdi-close text-[20px] leading-none" />
      </button>
      <img
        :src="logo"
        alt=""
        class="bluevue-loading__icon mb-6 h-[100px] w-[100px]"
      >
      <span
        v-if="message"
        class="mt-[15px] text-center text-base text-white"
      >
        {{ message }}
      </span>
    </div>
  </dialog>
</template>
