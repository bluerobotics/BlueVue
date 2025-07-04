<template>
  <div class="flex flex-col" :class="buttonClass">
    <!-- button container, above the main row -->
    <div class="flex justify-start items-center">
      <button
        class="inline-flex items-center text-[12px] font-medium font-xs focus:outline-none opacity-75 hover:opacity-100"
        style="text-transform: none"
        @click="toggle"
      >
        <div class="flex items-center mr-2">
          {{ isOpen ? closeLabel : openLabel }}
          <v-icon size="18" :class="['transition-transform', isOpen ? 'rotate-180' : 'rotate-0']">
            mdi-menu-down
          </v-icon>
        </div>
      </button>
      <div class="h-[1px] w-1/3 bg-[#ffffff22] my-2 ml-6 borde" />
    </div>

    <transition name="slide-fade">
      <div
        v-if="isOpen"
        class="flex justify-end"
        :class="[contentClass, { 'border-b-[1px] border-[#ffffff15] pb-3': isOpen }]"
      >
        <slot />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  openLabel?: string
  closeLabel?: string
  initiallyOpen?: boolean
  isOpen?: boolean
  buttonClass?: string
  contentClass?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
}>()

const { openLabel = 'More', closeLabel = 'Less', initiallyOpen = false } = props

const isOpen = ref<boolean>(props.isOpen ?? initiallyOpen)

function toggle(): void {
  isOpen.value = !isOpen.value
  emit('update:isOpen', isOpen.value)
}
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 300ms ease, opacity 300ms ease;
  transform-origin: top;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: scaleY(0);
  opacity: 0;
}
.slide-fade-enter-to,
.slide-fade-leave-from {
  transform: scaleY(1);
  opacity: 1;
}
</style>
