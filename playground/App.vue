<script setup lang="ts">
import { computed } from 'vue'

import { BlueSnackbar } from '../src'
import logo from '../src/assets/br-logo-white.svg'
import { catalog } from './catalog'
import { currentSlug } from './route'
import DocView from './views/DocView.vue'
import GalleryView from './views/GalleryView.vue'

const entry = computed(() => catalog.find((component) => component.slug === currentSlug.value) ?? null)
</script>

<template>
  <div class="min-h-screen bg-[#0C577B] bg-gradient-to-b from-[#0C577B] to-[#07293C] text-white">
    <header class="border-b border-[#ffffff1a] bg-[#00000033]">
      <!-- Equal flanks centre the tagline on the row itself, rather than on whatever room the mark
           and the links happen to leave it. Baselines rather than boxes, too: both are smaller than
           the wordmark, so centring their boxes leaves their text riding above it. The mark has no
           baseline of its own and stays centred. -->
      <div class="mx-auto grid max-w-[900px] grid-cols-[1fr_auto_1fr] items-baseline gap-4 px-6 py-4">
        <a
          href="#/"
          class="flex items-baseline gap-3 no-underline"
        >
          <img
            :src="logo"
            alt=""
            class="h-7 w-7 self-center"
          >
          <span class="text-lg font-medium text-white">BlueVue</span>
        </a>
        <span class="hidden text-[13px] text-[#ffffff88] sm:inline">
          The Blue Robotics look, for BlueOS ecosystem
        </span>
        <div class="col-start-3 flex items-baseline justify-end gap-4">
          <a
            href="https://github.com/bluerobotics/BlueVue"
            class="text-[13px] text-[#ffffffaa] no-underline transition-colors hover:text-white"
          >
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/@bluerobotics/bluevue"
            class="text-[13px] text-[#ffffffaa] no-underline transition-colors hover:text-white"
          >
            npm
          </a>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-[900px] px-6 py-10">
      <DocView
        v-if="entry"
        :entry="entry"
      />
      <GalleryView v-else />
    </main>

    <BlueSnackbar />
  </div>
</template>
