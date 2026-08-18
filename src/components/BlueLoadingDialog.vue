<script setup lang="ts">
import logo from '../assets/br-logo-white.svg'
import BlueDialog from './BlueDialog.vue'

/**
 * A blocking overlay for an operation that is under way, such as a vehicle restarting. It is up
 * for exactly as long as `modelValue` says it is, and unless it is dismissible there is no way
 * out of it.
 */
defineProps<{
  modelValue: boolean
  /** What the operation is, shown under the propeller. */
  message?: string
  /** Offers a close button and lets Escape through, for a wait the user may walk away from. */
  dismissible?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
  <!-- Persistent unless the wait is dismissible: an operation the user cannot interrupt must not
       end up running under a live page. -->
  <BlueDialog
    :model-value="modelValue"
    :persistent="!dismissible"
    width="320px"
    body-class="flex flex-col items-center justify-center px-6 pt-7 pb-5"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <img
      :src="logo"
      alt=""
      class="bluevue-loading__icon mb-6 h-[100px] w-[100px]"
    >
    <span
      v-if="message"
      class="mt-[5px] text-center text-base text-white"
    >
      {{ message }}
    </span>
  </BlueDialog>
</template>
