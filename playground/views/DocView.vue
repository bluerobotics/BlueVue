<script setup lang="ts">
import { ref } from 'vue'

import { BlueIcon } from '../../src'
import type { ComponentDoc } from '../catalog'
import ApiTable from '../components/ApiTable.vue'

const props = defineProps<{
  entry: ComponentDoc
}>()

const copied = ref(false)
let copiedTimer: number | null = null

async function copySnippet(): Promise<void> {
  try {
    await navigator.clipboard.writeText(props.entry.snippet)
  } catch {
    // Clipboard access is refused on an insecure origin, and a docs page is no place to argue
    // about it: the snippet is on screen and can be selected.
    return
  }
  copied.value = true
  if (copiedTimer !== null) clearTimeout(copiedTimer)
  copiedTimer = window.setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <article class="flex flex-col">
    <a
      href="#/"
      class="mb-6 inline-flex w-fit items-center gap-1 text-[13px] text-[#ffffff88] no-underline transition-colors hover:text-white"
    >
      <BlueIcon
        name="mdi-chevron-left"
        :size="18"
      />
      All components
    </a>

    <header class="mb-6">
      <div class="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[#ffffff66]">
        {{ entry.group }}
      </div>
      <h1 class="font-mono text-[26px] leading-tight text-white">
        {{ entry.name }}
      </h1>
      <p class="mt-4 max-w-[680px] text-sm leading-relaxed text-[#ffffffcc]">
        {{ entry.about }}
      </p>
    </header>

    <section
      v-if="entry.when?.length"
      class="mb-8 rounded-[6px] border border-[#ffffff14] bg-[#ffffff08] px-5 py-4"
    >
      <h2 class="mb-3 text-xs font-medium uppercase tracking-wide text-[#ffffff66]">
        When to reach for it
      </h2>
      <ul class="flex flex-col gap-2">
        <li
          v-for="line in entry.when"
          :key="line"
          class="flex gap-2 text-[13px] leading-relaxed text-[#ffffffcc]"
        >
          <BlueIcon
            name="mdi-circle-small"
            :size="18"
            class="mt-[1px] text-[#ffffff66]"
          />
          <span>{{ line }}</span>
        </li>
      </ul>
    </section>

    <section class="bluevue-panel rounded-lg px-5 py-5">
      <component :is="entry.demo" />
    </section>

    <section class="mt-8">
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-xs font-medium uppercase tracking-wide text-[#ffffff66]">
          Usage
        </h2>
        <button
          type="button"
          class="cursor-pointer rounded-[4px] bg-[#ffffff11] px-3 py-1 text-[12px] text-white transition-colors hover:bg-[#ffffff22]"
          @click="copySnippet"
        >
          {{ copied ? 'Copied' : 'Copy' }}
        </button>
      </div>
      <pre class="overflow-x-auto rounded-[6px] border border-[#ffffff14] bg-[#00000044] px-4 py-3 text-[13px] leading-relaxed text-[#D6E9F5]"><code>{{ entry.snippet }}</code></pre>
    </section>

    <ApiTable
      title="Props"
      :rows="entry.props ?? []"
    />
    <ApiTable
      title="Events"
      :rows="entry.events ?? []"
    />
    <ApiTable
      title="Slots"
      :rows="entry.slots ?? []"
    />
  </article>
</template>
