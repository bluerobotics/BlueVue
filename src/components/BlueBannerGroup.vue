<script setup lang="ts">
import { ref } from 'vue'

import type { BannerContent } from '../types/banner'
import BlueBanner from './BlueBanner.vue'

/**
 * A row of banners that opens one at a time: the opened one takes the room the others leave, and
 * the ones already read gather at the end of the row.
 */
const props = defineProps<{
  /** The banners, in the order they sit in until one of them is opened. Messages identify them. */
  banners: BannerContent[]
}>()

const opened = ref<string | null>(null)
const promoted = ref<string[]>([])

// The row is the banners still to be read followed by the ones that have been, in the order they
// were opened. Ordering the row rather than reordering it leaves the elements where they are: a
// banner moved in the DOM loses both the transition it is in the middle of and the focus it holds.
function orderOf(banner: BannerContent): number {
  const moved = promoted.value.indexOf(banner.text)
  return moved === -1 ? props.banners.indexOf(banner) : props.banners.length + moved
}

function onToggle(text: string, open: boolean): void {
  opened.value = open ? text : null
  if (open) {
    promoted.value = [...promoted.value.filter((moved) => moved !== text), text]
  }
}
</script>

<template>
  <div class="flex min-w-0 items-center gap-2">
    <BlueBanner
      v-for="banner in props.banners"
      :key="banner.text"
      v-bind="banner"
      :expanded="opened === banner.text"
      :class="opened === banner.text ? 'min-w-0 shrink' : 'shrink-0'"
      :style="{ order: orderOf(banner) }"
      @update:expanded="onToggle(banner.text, $event)"
    />
  </div>
</template>
