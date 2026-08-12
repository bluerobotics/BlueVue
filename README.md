# BlueVue

Blue Robotics Vue components for common UI.

A small set of Vue 3 controls built with Tailwind, with no UI-framework dependency: they need
Vue, the Material Design Icons font, and nothing else.

## Install

```bash
npm install @bluerobotics/bluevue
```

Vue and [`@mdi/font`](https://pictogrammers.com/library/mdi/) are peer dependencies, so the app
provides them:

```bash
npm install vue @mdi/font
```

## Use

```ts
import '@mdi/font/css/materialdesignicons.css'
import '@bluerobotics/bluevue/style.css'
```

```vue
<script setup lang="ts">
import { BlueInput, BlueSelect } from '@bluerobotics/bluevue'
import { ref } from 'vue'

const name = ref('BlueBoat')
const vehicle = ref('boat')
</script>

<template>
  <BlueInput v-model="name" label="Name" theme="dark" />
  <BlueSelect v-model="vehicle" label="Vehicle" theme="dark" :items="[{ name: 'Boat', value: 'boat' }]" />
</template>
```

Every control takes a `theme` of `light` or `dark`.

## Styles

There are two ways to get the styles in, depending on whether your app runs Tailwind.

**Without Tailwind**, import the ready-made stylesheet. It carries the tokens, the component
classes and the Tailwind utilities the components use, and deliberately leaves out Tailwind's
Preflight so it cannot reset your app's base styles:

```ts
import '@bluerobotics/bluevue/style.css'
```

**With Tailwind v4**, let your own build compile the utilities, and import only the tokens and
component classes. This avoids shipping a second copy of the utilities you already have:

```css
@import "tailwindcss";
@import "@bluerobotics/bluevue/bluevue.css";

@source "../node_modules/@bluerobotics/bluevue/dist";
```

The `@source` line is required: Tailwind does not scan `node_modules` unless it is told to, and
without it the components' classes are never generated.

Doing both works and costs only the duplicated utility bytes.

### Theming

The colours and shadows are CSS custom properties, so an app can restate them:

```css
:root {
  --bluevue-primary: #0B5087;
  --bluevue-error: #CF6679;
  --bluevue-surface: #363636;
  --bluevue-accent: #6699CC;
}
```

## Components

| Component | What it is |
| --- | --- |
| `BlueButtonGroup` | Segmented switch or multi-toggle, with an optional overflow menu |
| `BlueExpansiblePanel` | Titled section that collapses |
| `BlueInput` | Text or number field, with a suffix, bounds and validation messages |
| `BlueLoadingDialog` | Blocking overlay, under a turning propeller, for an operation in progress |
| `BlueMenu` | Action dropdown, anchored to an activator or to a pointer position |
| `BluePromptDialog` | Asks for a name, and optionally a note |
| `BlueSelect` | Single or multiple selection from a list |
| `BlueSlider` | Range with a value pill, editable on double-click |
| `BlueSwitch` | Two-state switch with its own labels |

`useBluePopover` is also exported, for building further dropdowns on the same top-layer
placement the menus use.

## Browser support

The menus use the [popover API](https://developer.mozilla.org/docs/Web/API/Popover_API) and the
dialogs use `<dialog>`, so they need Chrome 114, Edge 114, Firefox 125 or Safari 17 and up.

## Develop

```bash
npm install
npm run dev     # playground on http://localhost:8090
npm run build   # dist/bluevue.js, dist/index.d.ts and dist/style.css
```
