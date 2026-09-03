<template>
  <div class="rounded-lg overflow-hidden">
    <div
      class="flex items-center justify-between bg-transparent cursor-pointer select-none px-3 my-2"
      @click="togglePanel"
    >
      <div
        class="flex-1 flex items-center"
        :class="props.headerAlign === 'end' ? 'justify-end' : ''"
      >
        <div
          v-if="props.headerAlign !== 'end'"
          class="flex-1 h-px"
          :class="props.theme === 'dark' ? 'bg-[#ffffff22]' : 'bg-[#00000033]'"
        />
        <span
          class="mx-3 min-w-0 truncate text-base font-normal opacity-60"
          :title="title"
          :class="props.theme === 'dark' ? 'text-white' : 'text-black'"
        >{{ title }}</span>
        <div
          v-if="props.headerAlign !== 'end'"
          class="flex-1 h-px"
          :class="props.theme === 'dark' ? 'bg-[#ffffff11]' : 'bg-[#00000033]'"
        />
      </div>
      <span
        class="mdi ml-3 text-[24px] leading-none opacity-40"
        :class="[
          isOpen ? 'mdi-menu-up' : 'mdi-menu-down',
          props.theme === 'dark' ? 'text-white' : 'text-black',
        ]"
      />
    </div>
    <transition
      name="bluevue-expand"
      @enter="openTo"
      @leave="closeFrom"
      @after-enter="releaseHeight"
      @after-leave="releaseHeight"
      @enter-cancelled="releaseHeight"
      @leave-cancelled="releaseHeight"
    >
      <!-- The animated box holds no inset of its own. max-height cannot take an element below its
           own padding, so padding here would strand the collapse at that height for the rest of
           the run, and a margin would outlive it altogether. -->
      <div v-show="isOpen">
        <div
          :class="[
            'flex flex-col gap-[15px]',
            props.bodyClass || 'px-13 pt-4 pb-8',
            props.theme === 'dark' ? 'border-[#555555]' : 'border-[#dddddd]',
          ]"
        >
          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  /** Panel title */
  title: string
  /** Initial open state */
  expanded?: boolean
  /**
   * Replaces the body's own inset, for a panel nested inside one that already insets its content.
   * The column gap between the panel's children is kept either way. Use padding rather than
   * margin: the body collapses by animating its own height, which a margin would not follow.
   */
  bodyClass?: string
  /**
   * 'full' (default) rules the title off across the panel; 'end' drops the rules and tucks the
   * title against the right edge, for a secondary panel nested inside another one.
   */
  headerAlign?: 'full' | 'end'
  /** 'light' or 'dark' theme */
  theme?: 'light' | 'dark'
}>()

const emit = defineEmits<{
  (e: 'update:expanded', value: boolean): void
}>()

const isOpen = ref(props.expanded ?? true)

// max-height cannot animate to or from a keyword, so every open and close is driven from the
// panel's own measured height. A fixed ceiling instead would either clip a panel taller than it
// or open a short one in a fraction of the duration and then sit still for the rest.
const openTo = (el: Element): void => {
  const panel = el as HTMLElement
  panel.style.maxHeight = '0px'
  const target = panel.scrollHeight
  panel.getBoundingClientRect()
  panel.style.maxHeight = `${target}px`
}

const closeFrom = (el: Element): void => {
  const panel = el as HTMLElement
  panel.style.maxHeight = `${panel.scrollHeight}px`
  panel.getBoundingClientRect()
  panel.style.maxHeight = '0px'
}

// Left in place, the cap would keep the panel from growing with whatever the slot renders next.
const releaseHeight = (el: Element): void => {
  ;(el as HTMLElement).style.maxHeight = ''
}

const togglePanel = (): void => {
  isOpen.value = !isOpen.value
  emit('update:expanded', isOpen.value)
}

watch(
  () => props.expanded,
  (val) => {
    if (val !== undefined) isOpen.value = val
  },
  { immediate: true }
)
</script>
