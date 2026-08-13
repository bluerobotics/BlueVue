<script setup lang="ts">
import BlueIcon from './BlueIcon.vue'

/**
 * The sheet an extension's page is laid out on: a titled bar over a body, raised off the backdrop.
 * BlueApp puts one in the middle of the page for you; reach for it directly when a page needs more
 * than one.
 */
defineProps<{
  title?: string
  /** An image beside the title, such as the extension's own mark. */
  logo?: string
  /** An mdi name beside the title, for a card with no mark of its own. */
  icon?: string
  /** How wide the card is allowed to get (default '615px'). */
  width?: string
  /** Replaces the body's own inset, for a body that lays itself out. */
  bodyClass?: string
}>()
</script>

<template>
  <section
    class="bluevue-elevation-5 mx-auto w-full rounded-[8px] bg-[var(--bluevue-surface)] text-white"
    :style="{ maxWidth: width || '615px' }"
  >
    <!-- Relative, so the bar's own shadow paints over the body below it rather than under it. -->
    <header
      v-if="title || $slots.header || $slots.actions"
      class="bluevue-elevation-1 relative flex items-center gap-5 rounded-t-[8px] bg-[#15151577] px-5 py-3"
    >
      <slot name="header">
        <img
          v-if="logo"
          :src="logo"
          alt=""
          class="h-6 w-6 shrink-0"
        >
        <BlueIcon
          v-else-if="icon"
          :name="icon"
          :size="24"
        />
        <span class="truncate text-lg font-medium">{{ title }}</span>
      </slot>
      <div class="ml-auto flex shrink-0 items-center gap-1">
        <slot name="actions" />
      </div>
    </header>

    <div :class="bodyClass || 'px-5 py-4'">
      <slot />
    </div>

    <footer
      v-if="$slots.footer"
      class="flex items-center justify-between gap-3 border-t border-[#ffffff0d] px-5 py-3"
    >
      <slot name="footer" />
    </footer>
  </section>
</template>
