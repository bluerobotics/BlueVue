<script setup lang="ts">
import { computed } from 'vue'

import { type BlueNoticeSeverity, useBlueSnackbar } from '../composables/useBlueSnackbar'
import BlueButton from './BlueButton.vue'
import BlueIcon from './BlueIcon.vue'

/**
 * Puts the application's notices on screen, newest nearest the edge. Mount it once, at the root;
 * BlueApp already does. Raising a notice is useBlueSnackbar's job, from wherever it happened.
 */
const props = defineProps<{
  /** Which corner they gather in (default 'bottom-right'). */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}>()

const { notices, dismiss } = useBlueSnackbar()

const LOOK: Record<BlueNoticeSeverity, { icon: string; color: string }> = {
  success: { icon: 'mdi-check-circle-outline', color: '#66BB6A' },
  error: { icon: 'mdi-alert-circle-outline', color: 'var(--bluevue-error)' },
  warning: { icon: 'mdi-alert-outline', color: '#FFB74D' },
  info: { icon: 'mdi-information-outline', color: '#42A5F5' },
}

const corner = computed(() => {
  switch (props.position) {
    case 'bottom-left':
      return 'bottom-4 left-4 items-start'
    case 'top-right':
      return 'top-4 right-4 items-end'
    case 'top-left':
      return 'top-4 left-4 items-start'
    default:
      return 'bottom-4 right-4 items-end'
  }
})

// Newest nearest the edge the stack grows from, so the one that just arrived is where the eye
// already is.
const stacked = computed(() => (props.position?.startsWith('top') ? [...notices.value].reverse() : notices.value))
</script>

<template>
  <div
    class="pointer-events-none fixed z-[2000] flex max-w-[min(90vw,420px)] flex-col gap-2"
    :class="corner"
    role="status"
    aria-live="polite"
  >
    <TransitionGroup name="bluevue-notice">
      <div
        v-for="notice in stacked"
        :key="notice.id"
        class="bluevue-panel pointer-events-auto flex items-start gap-3 rounded-[6px] py-2 pl-3 pr-2 text-white"
      >
        <BlueIcon
          :name="LOOK[notice.severity].icon"
          :size="18"
          :color="LOOK[notice.severity].color"
          class="mt-[1px]"
        />
        <span class="min-w-0 flex-1 text-[13px] leading-snug">
          {{ notice.text }}
          <span
            v-if="notice.repeats > 1"
            class="text-[#ffffff88]"
          >(×{{ notice.repeats }})</span>
        </span>
        <BlueButton
          variant="icon"
          density="compact"
          icon="mdi-close"
          tooltip="Dismiss"
          @click="dismiss(notice.id)"
        />
      </div>
    </TransitionGroup>
  </div>
</template>
