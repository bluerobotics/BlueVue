<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import type { BannerContent, BannerSeverity } from '../types/banner'

interface Look {
  icon: string
  color: string
  background: string
  border: string
}

/**
 * A note that keeps to a square until it is asked for: shut, it is its icon; open, it is one line
 * of message, and only its width moves between the two, so nothing around it is pushed about.
 */
const LOOKS: Record<BannerSeverity, Look> = {
  error: { icon: 'mdi-alert-circle-outline', color: '#EF9A9A', background: '#CF667926', border: '#CF667955' },
  warning: { icon: 'mdi-alert', color: '#FFB74D', background: '#FB8C0022', border: '#FB8C0055' },
  info: { icon: 'mdi-information-outline', color: '#81D4FA', background: '#4FC3F71A', border: '#4FC3F744' },
  success: { icon: 'mdi-check-circle-outline', color: '#A5D6A7', background: '#66BB6A22', border: '#66BB6A55' },
}

const props = withDefaults(
  defineProps<
    BannerContent & {
      /** Whether it starts open (default true). */
      expanded?: boolean
    }
  >(),
  // An absent boolean prop is `false` unless a default says otherwise, which would start every
  // banner shut.
  {
    severity: undefined,
    icon: undefined,
    color: undefined,
    background: undefined,
    border: undefined,
    expanded: undefined,
  }
)

const emit = defineEmits<{
  (e: 'update:expanded', value: boolean): void
}>()

const box = ref<HTMLElement | null>(null)
const reveal = ref<HTMLElement | null>(null)
const label = ref<HTMLElement | null>(null)

const isOpen = ref(props.expanded ?? true)
const messageWidth = ref(0)
const measured = ref(false)

const look = computed(() => LOOKS[props.severity ?? 'info'])

const boxStyle = computed(() => ({
  color: props.color ?? look.value.color,
  backgroundColor: props.background ?? look.value.background,
  borderColor: props.border ?? look.value.border,
}))

// Shut has nothing to show and needs no measurement; open before the first one takes whatever room
// there is, which is what the measurement will say anyway.
const revealStyle = computed(() => {
  if (!isOpen.value) {
    return { width: '0px' }
  }
  return measured.value ? { width: `${messageWidth.value}px` } : undefined
})

// Held at its measured width in either state, so opening uncovers a line laid out once rather than
// one relaid on every frame of the way.
const labelStyle = computed(() => (measured.value ? { width: `${messageWidth.value}px` } : undefined))

// The room there is for the message and the width it asks for, read off elements laid out by their
// content and put back within the one task, so nothing is painted in between.
function measure(): void {
  const button = box.value
  const pane = reveal.value
  const message = label.value
  if (!button || !pane || !message) {
    return
  }
  const buttonStyle = button.style.cssText
  const paneStyle = pane.style.cssText
  const messageStyle = message.style.cssText
  const putBack = (): void => {
    button.style.cssText = buttonStyle
    pane.style.cssText = paneStyle
    message.style.cssText = messageStyle
    // Resolve the restored width while transitions are off: `auto` is not a width an animation can
    // start from, and the banner would jump to its new size rather than move to it.
    void pane.getBoundingClientRect()
    button.classList.remove('bluevue-banner--measuring')
  }
  button.classList.add('bluevue-banner--measuring')

  button.style.width = '100%'
  pane.style.flex = '1 1 auto'
  pane.style.width = 'auto'
  message.style.width = '0px'
  const room = pane.getBoundingClientRect().width
  // Nothing to measure against inside something closed or off screen, and the last measurement
  // beats none.
  if (room <= 0) {
    putBack()
    return
  }

  message.style.width = 'max-content'
  const wanted = Math.ceil(message.getBoundingClientRect().width)

  // A message too long for the room keeps its line and loses its tail to the edge, the pointer
  // being where the whole of it is read either way.
  messageWidth.value = Math.min(wanted, Math.floor(room))

  putBack()
  measured.value = true
}

function toggle(): void {
  // A click is proof of being on screen, which a banner mounted inside a closed panel was not.
  measure()
  isOpen.value = !isOpen.value
  emit('update:expanded', isOpen.value)
}

let observer: ResizeObserver | null = null

onMounted(() => {
  measure()
  // The message is text, so the width it asks for changes when the font arrives.
  void document.fonts?.ready.then(measure)
  const parent = box.value?.parentElement
  if (parent) {
    // Width changes only, and on the next frame: laying the message out again from inside the
    // notification resizes what is being reported on, which the browser calls a loop.
    let room = parent.clientWidth
    observer = new ResizeObserver(() => {
      if (parent.clientWidth !== room) {
        room = parent.clientWidth
        requestAnimationFrame(measure)
      }
    })
    observer.observe(parent)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})

// After the render, since a new message is measured on screen rather than in the props.
watch(() => props.text, measure, { flush: 'post' })

watch(
  () => props.expanded,
  (value) => {
    if (value !== undefined) {
      isOpen.value = value
    }
  }
)
</script>

<template>
  <button
    ref="box"
    type="button"
    class="bluevue-banner bluevue-elevation-1-soft flex w-fit items-center rounded-[6px] border text-left cursor-pointer"
    :style="boxStyle"
    :aria-expanded="isOpen"
    :aria-label="text"
    :title="text"
    @click="toggle"
  >
    <span
      class="mdi bluevue-banner__icon shrink-0"
      :class="props.icon ?? look.icon"
    />
    <span
      ref="reveal"
      class="bluevue-banner__reveal overflow-hidden"
      :class="measured ? 'shrink-0' : ''"
      :style="revealStyle"
    >
      <span
        ref="label"
        class="bluevue-banner__text block whitespace-nowrap"
        :style="labelStyle"
      >{{ text }}</span>
    </span>
  </button>
</template>
