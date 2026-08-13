import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// Two builds from one config. The library build emits JavaScript and types only, since styles are
// built separately by the build:css script and importing a component should never drag a
// stylesheet along with it. The docs build is the ordinary application build of the same
// components, served from a project page whose URLs all sit under the repository name.
export default defineConfig(({ mode }) => {
  const docs = mode === 'docs'

  return {
    base: docs ? '/BlueVue/' : '/',
    plugins: [
      vue(),
      tailwindcss(),
      ...(docs ? [] : [dts({ include: ['src'], exclude: ['src/**/*.spec.ts'] })]),
    ],
    build: docs
      ? { outDir: 'docs-dist', emptyOutDir: true }
      : {
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
  }
})
