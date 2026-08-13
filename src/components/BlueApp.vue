<script setup lang="ts">
import { useBlueLoading } from '../composables/useBlueLoading'
import BlueCard from './BlueCard.vue'
import BlueLoadingDialog from './BlueLoadingDialog.vue'
import BlueSnackbar from './BlueSnackbar.vue'

/**
 * The whole of an extension's page: BlueOS's backdrop, one card in the middle of it, and the two
 * pieces of feedback every extension needs mounted once. Wrap your panels in it and the notices
 * raised through useBlueSnackbar and the waits raised through useBlueLoading appear by themselves.
 */
defineProps<{
  title: string
  /** An image beside the title, such as the extension's own mark. */
  logo?: string
  /** An mdi name beside the title, for an extension with no mark of its own. */
  icon?: string
  /** How wide the card is allowed to get (default '615px'). */
  width?: string
  /**
   * What is painted behind the card (default BlueOS's own blue). An extension is served in an
   * iframe whose canvas is opaque, so leaving the page transparent shows black rather than the
   * page behind it.
   */
  backdrop?: string
}>()

const { loading, hideLoading } = useBlueLoading()
</script>

<template>
  <div
    class="min-h-screen w-full px-4 py-6"
    :style="{ backgroundColor: backdrop || '#0C577B' }"
  >
    <BlueCard
      :title="title"
      :logo="logo"
      :icon="icon"
      :width="width"
    >
      <template
        v-if="$slots.actions"
        #actions
      >
        <slot name="actions" />
      </template>

      <slot />

      <template
        v-if="$slots.footer"
        #footer
      >
        <slot name="footer" />
      </template>
    </BlueCard>

    <BlueSnackbar />

    <!-- Dismissing is the only thing the overlay reports, and only a dismissible one can. -->
    <BlueLoadingDialog
      :model-value="loading.show"
      :message="loading.message"
      :dismissible="loading.dismissible"
      @update:model-value="hideLoading"
    />
  </div>
</template>
