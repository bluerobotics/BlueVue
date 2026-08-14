<script setup lang="ts">
import { computed, onMounted, ref, useSlots, watch } from 'vue'

import BlueButton from './BlueButton.vue'
import BlueIcon from './BlueIcon.vue'

/**
 * The surface every dialog in the kit is built on: a frosted panel in the browser's top layer,
 * with an optional header, a body and an optional footer. Being a native modal, it dims the page
 * itself, traps focus, and closes on Escape and on the backdrop unless it is told not to.
 */
const props = defineProps<{
  modelValue: boolean
  /** The heading. Without one, and without a header slot, the dialog is only its body. */
  title?: string
  /** An mdi name beside the title. */
  icon?: string
  iconColor?: string
  /** A line under the title, for what the dialog is about to act on. */
  subtitle?: string
  /**
   * Takes away Escape, the backdrop and the close button. For an operation that must not end up
   * running under a live page.
   */
  persistent?: boolean
  /** Panel width (default '624px'). It never exceeds the viewport. */
  width?: string
  /** Replaces the body's own inset, for a dialog laying its contents out differently. */
  bodyClass?: string
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

const slots = useSlots()
const dialogRef = ref<HTMLDialogElement | null>(null)

const hasHeader = computed(() => Boolean(props.title || slots.header))

const sync = (show: boolean): void => {
  const el = dialogRef.value
  if (!el) return
  if (show && !el.open) el.showModal()
  if (!show && el.open) el.close()
}

onMounted(() => sync(props.modelValue))
watch(() => props.modelValue, sync)

// Every way out closes the element, and its close event is what reports back, so Escape and the
// backdrop need no separate answer.
const close = (): void => dialogRef.value?.close()

const onCancel = (event: Event): void => {
  if (props.persistent) event.preventDefault()
}

// A click landing on the dialog itself landed on the backdrop, since the panel covers the whole of
// the element's own box.
const onBackdropClick = (event: MouseEvent): void => {
  if (!props.persistent && event.target === dialogRef.value) close()
}

defineExpose({ close })
</script>

<template>
  <dialog
    ref="dialogRef"
    class="bluevue-dialog"
    @close="emit('update:modelValue', false)"
    @cancel="onCancel"
    @click="onBackdropClick"
  >
    <div
      class="bluevue-panel relative max-w-full rounded-lg text-white"
      :style="{ width: width || '624px' }"
    >
      <header
        v-if="hasHeader"
        class="flex items-start gap-3 px-5 pt-4 pb-3"
      >
        <slot name="header">
          <BlueIcon
            v-if="icon"
            :name="icon"
            :size="22"
            :color="iconColor || '#42A5F5'"
            class="mt-[2px]"
          />
          <div class="min-w-0 flex-1">
            <div class="truncate text-base leading-tight">
              {{ title }}
            </div>
            <div
              v-if="subtitle"
              class="mt-1 text-xs leading-relaxed text-[#ffffff88]"
            >
              {{ subtitle }}
            </div>
          </div>
        </slot>
        <BlueButton
          v-if="!persistent"
          variant="icon"
          icon="mdi-close"
          tooltip="Close"
          @click="close"
        />
      </header>

      <!-- With no header to hold it, the way out sits over the corner of the panel. -->
      <BlueButton
        v-else-if="!persistent"
        variant="icon"
        icon="mdi-close"
        tooltip="Close"
        class="absolute right-3 top-3 z-10"
        @click="close"
      />

      <div :class="[bodyClass || 'px-5 py-4', hasHeader ? 'border-t border-[#ffffff0d]' : '']">
        <slot />
      </div>

      <footer
        v-if="slots.footer"
        class="flex items-center justify-between gap-3 border-t border-[#ffffff0d] px-5 py-3"
      >
        <slot name="footer" />
      </footer>
    </div>
  </dialog>
</template>
