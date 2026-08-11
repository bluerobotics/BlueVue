<script setup lang="ts">
import { watch } from 'vue'

import { useBluePopover } from '../composables/useBluePopover'

/**
 * A dropdown of actions, opened either from the activator slot or, with `target`, at a pointer
 * position, which is what a right-click or a long press wants. Pass `target` to place it at a
 * point; leave it out and the activator slot decides where it hangs.
 */
export interface BlueMenuItem {
  title: string
  icon: string
  /** Renders in the warning colour, for the items that remove something. */
  danger?: boolean
  disabled?: boolean
  /** Shown on hover, to say why an item is disabled. */
  hint?: string
  action: () => void
}

const props = defineProps<{
  modelValue: boolean
  items: BlueMenuItem[]
  target?: [number, number]
}>()

const emit = defineEmits<{ (event: 'update:modelValue', value: boolean): void }>()

const {
  anchorRef,
  popoverRef,
  popoverId,
  activatorProps,
  isOpen,
  isPositioned,
  floatingStyles,
  show,
  hide,
  onToggle,
} = useBluePopover()

// The activator opens the menu through the browser, so the model follows the menu as well as
// driving it: this keeps the two in step whichever of them moved first.
watch(isOpen, (open) => emit('update:modelValue', open))

watch(
  () => [props.modelValue, props.target] as const,
  ([open, target]) => {
    if (open) show(target)
    else hide()
  },
  { immediate: true }
)

function runItem(item: BlueMenuItem): void {
  hide()
  item.action()
}
</script>

<template>
  <span
    v-if="!target"
    ref="anchorRef"
    class="inline-flex"
  >
    <slot
      name="activator"
      :props="activatorProps"
    />
  </span>

  <div
    :id="popoverId"
    ref="popoverRef"
    popover
    class="bluevue-popover"
    :style="floatingStyles"
    @toggle="onToggle"
  >
    <ul
      class="bluevue-elevation-5 min-w-[220px] max-h-[60vh] overflow-y-auto rounded-[4px] border border-[#ffffff1a] bg-[#2d2d2d]"
      :class="isPositioned ? 'opacity-100' : 'opacity-0'"
    >
      <li
        v-for="(item, index) in items"
        :key="item.title"
      >
        <div
          v-if="index"
          class="h-px bg-[#ffffff0d]"
        />
        <button
          type="button"
          :disabled="item.disabled"
          class="flex w-full items-start gap-3 px-4 py-2 text-left"
          :class="[
            item.danger ? 'text-[#ff6b6b]' : 'text-white',
            item.disabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer hover:bg-[#ffffff11]',
          ]"
          @click="runItem(item)"
        >
          <span
            class="mdi shrink-0 mt-[2px] text-[18px] leading-none"
            :class="item.icon"
          />
          <span class="min-w-0">
            <span class="block text-[13px] leading-snug">{{ item.title }}</span>
            <span
              v-if="item.hint"
              class="block text-[10px] text-[#ffffff66]"
            >{{ item.hint }}</span>
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>
