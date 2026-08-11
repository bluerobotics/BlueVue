import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// The library build emits JavaScript and types only. Styles are built separately, by the
// build:css script, so importing a component never drags a stylesheet along with it.
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    dts({ include: ['src'], exclude: ['src/**/*.spec.ts'] }),
  ],
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: () => 'bluevue.js',
    },
    rollupOptions: {
      // Left to the consumer's copy, so a page never runs two Vues or two floating-uis.
      external: ['vue', '@floating-ui/vue'],
    },
  },
  server: {
    port: 8090,
  },
})
