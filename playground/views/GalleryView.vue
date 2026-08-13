<script setup lang="ts">
import { computed } from 'vue'

import { catalog, GROUPS } from '../catalog'
import { hrefFor } from '../route'

const groups = computed(() =>
  GROUPS.map((name) => ({ name, entries: catalog.filter((entry) => entry.group === name) })).filter(
    (group) => group.entries.length > 0
  )
)
</script>

<template>
  <div class="flex flex-col gap-10">
    <p class="max-w-[640px] text-sm leading-relaxed text-[#ffffffaa]">
      Every component, live, on the surface it was drawn for. Each one links to a page that says what
      it is for, when to reach for it, and what it takes.
    </p>

    <section
      v-for="group in groups"
      :key="group.name"
    >
      <h2 class="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-[#ffffff66]">
        {{ group.name }}
      </h2>

      <div class="flex flex-col gap-5">
        <article
          v-for="entry in group.entries"
          :key="entry.slug"
          class="bluevue-panel rounded-lg"
        >
          <header class="flex items-center gap-4 border-b border-[#ffffff0d] px-5 py-3">
            <div class="min-w-0 flex-1">
              <h3 class="font-mono text-[15px] text-white">
                {{ entry.name }}
              </h3>
              <p class="mt-1 text-[13px] text-[#ffffff88]">
                {{ entry.blurb }}
              </p>
            </div>
            <a
              :href="hrefFor(entry.slug)"
              class="shrink-0 rounded-[4px] bg-[#ffffff11] px-3 py-[6px] text-[12px] font-medium uppercase tracking-wide text-white no-underline transition-colors hover:bg-[#ffffff22]"
            >
              Docs
            </a>
          </header>

          <div class="px-5 py-5">
            <component :is="entry.demo" />
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
