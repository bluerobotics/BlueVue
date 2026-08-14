<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'

import { BlueButton, type BlueStep, BlueStepsDialog } from '../../src'

const open = ref(false)
const written = ref(0)
const stage = ref(0)
const failed = ref(false)
let timer: number | undefined

const STAGES = ['Firmware', 'Parameters', 'Restart', 'Read back']

const steps = computed<BlueStep[]>(() =>
  STAGES.map((title, index) => ({
    key: title,
    title,
    state:
      index < stage.value
        ? 'done'
        : index > stage.value
          ? 'pending'
          : failed.value
            ? 'failed'
            : 'running',
  }))
)

const state = computed(() => (failed.value ? 'failed' : stage.value >= STAGES.length ? 'done' : 'running'))

const log = computed(() => Array.from({ length: written.value }, (_, index) => `SIM_WIND_${index + 1}`))

function stop(): void {
  window.clearInterval(timer)
  timer = undefined
}

// A job with nothing behind it: it walks its stages, writes a few parameters, then stops on the
// restart so the failure footer can be seen.
function run(): void {
  stop()
  written.value = 0
  stage.value = 0
  failed.value = false
  open.value = true
  timer = window.setInterval(() => {
    if (stage.value === 1 && written.value < 8) {
      written.value += 1
      return
    }
    stage.value += 1
    if (stage.value === 2) {
      failed.value = true
      stop()
    }
    if (stage.value >= STAGES.length) stop()
  }, 500)
}

function retry(): void {
  failed.value = false
  run()
}

onBeforeUnmount(stop)
</script>

<template>
  <div class="flex items-center gap-3">
    <BlueButton
      variant="filled"
      icon="mdi-cog-sync"
      @click="run"
    >
      Apply and restart
    </BlueButton>

    <BlueStepsDialog
      v-model="open"
      title="Applying BlueBoat"
      :subtitle="failed ? 'The autopilot did not come back' : 'Working…'"
      :state="state"
      :steps="steps"
      :progress="(written / 8) * 100"
      :indeterminate="stage !== 1"
      :progress-label="stage === 1 ? `${written}/8 parameters processed` : STAGES[Math.min(stage, 3)]"
    >
      <template #badges>
        <span class="text-[11px] text-[#66BB6A]">{{ written }} written</span>
      </template>

      <template #log>
        <div
          v-for="line in log"
          :key="line"
          class="flex justify-between py-[2px]"
        >
          <span class="text-[#ffffffcc]">{{ line }}</span>
          <span class="text-[#66BB6A]">written</span>
        </div>
      </template>

      <template #footer>
        <span class="text-xs text-[#ffffff88]">
          {{ failed ? 'Retry or skip the step and carry on from there.' : '' }}
        </span>
        <div class="flex shrink-0 items-center gap-2">
          <BlueButton
            v-if="failed"
            density="compact"
            icon="mdi-refresh"
            @click="retry"
          >
            Retry step
          </BlueButton>
          <BlueButton
            variant="filled"
            density="compact"
            @click="open = false"
          >
            Close
          </BlueButton>
        </div>
      </template>
    </BlueStepsDialog>
  </div>
</template>
