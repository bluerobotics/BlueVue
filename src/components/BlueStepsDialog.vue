<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useSlots, watch } from 'vue'

import BlueDialog from './BlueDialog.vue'
import BlueIcon from './BlueIcon.vue'
import BlueProgressBar from './BlueProgressBar.vue'

/** One stage of the work, in the order it runs. */
export interface BlueStep {
  key: string
  title: string
  state: 'pending' | 'running' | 'done' | 'failed' | 'skipped'
  /** What the step is doing, or why it failed. */
  detail?: string
}

/**
 * Reports on work with stages to it: installing firmware, writing parameters, restarting. The
 * dialog holds the page while the work is running and lets go the moment it is not, so a run that
 * ends in a failure can be read, retried or skipped from the footer.
 */
const props = defineProps<{
  modelValue: boolean
  title: string
  /** What the current stage is doing, under the title. */
  subtitle?: string
  /** Running holds the page; the other two release it. */
  state: 'running' | 'failed' | 'done'
  steps: BlueStep[]
  /** The line above the bar, naming what is being worked through. */
  progressLabel?: string
  /** Percentage of the current stage, when the stage can count itself. */
  progress?: number
  /** For a stage that can only say it is waiting, such as a restart. */
  indeterminate?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

const slots = useSlots()

// The step icons and the connectors between them share this height, which is what puts the line
// on the icons' centre line.
const STEP_ICON_SIZE = 22

const STEP_STYLE = {
  pending: { icon: 'mdi-circle-outline', color: '#ffffff44' },
  running: { icon: 'mdi-progress-clock', color: '#42A5F5' },
  done: { icon: 'mdi-check-circle', color: '#66BB6A' },
  failed: { icon: 'mdi-alert-circle', color: '#EF5350' },
  skipped: { icon: 'mdi-minus-circle-outline', color: '#ffffff44' },
} as const

const HEAD = {
  running: { icon: 'mdi-cog-sync', color: '#42A5F5' },
  failed: { icon: 'mdi-alert-circle', color: '#EF5350' },
  done: { icon: 'mdi-check-circle', color: '#66BB6A' },
} as const

const head = computed(() => HEAD[props.state])

const hasProgress = computed(() => props.progress !== undefined || props.indeterminate || Boolean(slots.log))

const logRef = ref<HTMLElement | null>(null)
let logObserver: MutationObserver | null = null

// Follows the tail as records arrive, but only while the reader is already there: someone who has
// scrolled up to read an earlier line is reading it, and yanking them back down is not help.
const followLog = (): void => {
  const el = logRef.value
  if (!el) return
  if (el.scrollHeight - el.scrollTop - el.clientHeight < 40) el.scrollTop = el.scrollHeight
}

watch(logRef, (el) => {
  logObserver?.disconnect()
  logObserver = null
  if (!el) return
  logObserver = new MutationObserver(followLog)
  logObserver.observe(el, { childList: true, subtree: true, characterData: true })
})

onBeforeUnmount(() => logObserver?.disconnect())
</script>

<template>
  <BlueDialog
    :model-value="modelValue"
    :persistent="state === 'running'"
    width="620px"
    body-class="px-5 pb-4 pt-3"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #header>
      <BlueIcon
        :name="head.icon"
        :size="22"
        :color="head.color"
        class="mt-[2px]"
      />
      <div class="min-w-0 flex-1">
        <div class="truncate text-base leading-tight">
          {{ title }}
        </div>
        <div
          v-if="subtitle"
          class="mt-1 truncate text-xs text-[#ffffff88]"
        >
          {{ subtitle }}
        </div>
      </div>
    </template>

    <div class="flex items-start">
      <template
        v-for="(step, index) in steps"
        :key="step.key"
      >
        <div
          v-if="index"
          class="flex flex-1 items-center"
          :style="{ height: `${STEP_ICON_SIZE}px` }"
        >
          <div class="h-px w-full bg-[#ffffff1a]" />
        </div>
        <!-- Wide enough for the longest step title to stay on one line before the ellipsis. -->
        <div class="flex w-[84px] shrink-0 flex-col items-center gap-1">
          <BlueIcon
            :name="STEP_STYLE[step.state].icon"
            :size="STEP_ICON_SIZE"
            :color="STEP_STYLE[step.state].color"
          />
          <span
            class="w-full truncate text-center text-[10px] leading-tight"
            :title="step.detail || step.title"
            :class="step.state === 'running' ? 'text-white' : 'text-[#ffffff77]'"
          >
            {{ step.title }}
          </span>
        </div>
      </template>
    </div>

    <div
      v-if="hasProgress"
      class="mt-4 border-t border-[#ffffff0d] pt-4"
    >
      <div class="mb-2 flex items-baseline justify-between">
        <span class="truncate text-xs text-[#ffffffcc]">{{ progressLabel }}</span>
        <div class="flex shrink-0 gap-2 pl-3">
          <slot name="badges" />
        </div>
      </div>

      <BlueProgressBar
        :model-value="progress ?? 100"
        :indeterminate="indeterminate && state === 'running'"
        :color="state === 'failed' ? 'var(--bluevue-error)' : undefined"
        :label="progressLabel"
      />

      <div
        v-if="slots.log"
        ref="logRef"
        class="mt-3 max-h-[220px] overflow-y-auto rounded-[6px] bg-[#00000033] px-3 py-2 font-mono text-[11px]"
      >
        <slot name="log" />
      </div>
    </div>

    <template
      v-if="slots.footer"
      #footer
    >
      <slot name="footer" />
    </template>
  </BlueDialog>
</template>
