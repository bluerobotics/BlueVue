# BlueVue

The Blue Robotics look, for BlueOS extensions.

A Vue 3 kit that gives an extension the page it is laid out on, the controls that go on it, the
dialogs and notices it talks through, and the calls that reach BlueOS itself. It is built with
Tailwind and depends on no UI framework: Vue, the Material Design Icons font, and nothing else.

Every component has a page of its own, with a live demo and its API, in the
[component gallery](https://bluerobotics.github.io/BlueVue/).

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

An extension is a `BlueApp` with your panels inside it:

```vue
<script setup lang="ts">
import { BlueApp, BlueExpansiblePanel, BlueInput, BlueSwitch, useBlueOs, useBlueSnackbar } from '@bluerobotics/bluevue'
import { ref } from 'vue'

const { vehicleName } = useBlueOs()
const { notify } = useBlueSnackbar()

const name = ref('BlueBoat')
const armed = ref(false)
</script>

<template>
  <BlueApp :title="vehicleName ?? 'My extension'">
    <BlueExpansiblePanel title="Vehicle" theme="dark" :expanded="true">
      <BlueInput v-model="name" name="name" label="Name" theme="dark" />
      <BlueSwitch v-model="armed" name="armed" label="Start armed" label-on="Armed" label-off="Safe" theme="dark" />
    </BlueExpansiblePanel>
  </BlueApp>
</template>
```

Every control takes a `theme` of `light` or `dark`. Extensions are dark.

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

The colours and shadows are CSS custom properties, so an app can restate them, either in CSS or
through `applyBlueTheme({ primary: '#0B5087' })`:

```css
:root {
  --bluevue-primary: #0B5087;
  --bluevue-error: #CF6679;
  --bluevue-surface: #363636;
  --bluevue-accent: #6699CC;
}
```

## What is in it

**The page**

| Component | What it is |
| --- | --- |
| `BlueApp` | The whole page: backdrop, card, and the notices and waits mounted once |
| `BlueCard` | The sheet a page is laid out on, with a title bar and a footer |
| `BlueExpansiblePanel` | Titled section that collapses |
| `BlueSection` | A subject inside a panel |

**Controls**

| Component | What it is |
| --- | --- |
| `BlueButton` | Filled, tonal, text or icon, with a loading state |
| `BlueButtonGroup` | Segmented switch or multi-toggle, with an optional overflow menu |
| `BlueCheckbox` | A plain yes or no, indeterminate included |
| `BlueFileDrop` | A place to drop a file on, or press to choose one |
| `BlueInput` | Text or number field, with a suffix, bounds and validation messages |
| `BlueRadioGroup` | One choice out of a few, each spelled out |
| `BlueSelect` | Single or multiple selection from a list |
| `BlueSlider` | Range with a value pill, editable on double-click |
| `BlueSwitch` | Two-state switch with its own labels |
| `BlueTabs` | The strip that switches between the pages of a view |
| `BlueTextarea` | A `BlueInput` with room for several lines |

**Display**

| Component | What it is |
| --- | --- |
| `BlueBanner` / `BlueBannerGroup` | A one-line note that expands, and a stack of them |
| `BlueChip` | A small standing label: a state, a tag, a count |
| `BlueIcon` | A Material Design Icon in a square box |
| `BlueStat` | One read-only fact, in a row of them |
| `BlueTable` | Rows of records under a header that stays put, ordered by pressing it |

**Overlays**

| Component | What it is |
| --- | --- |
| `BlueDialog` | The base every dialog is built on, over the native `<dialog>` |
| `BlueConfirmDialog` | Asks before something irreversible |
| `BlueJobDialog` | Reports a job of several steps, with its log |
| `BlueMenu` | Action dropdown, anchored to an activator or to a pointer position |
| `BluePromptDialog` | Asks for a name, and optionally a note |
| `BlueTooltip` | A hint on hover or focus |

**Feedback**

| Component | What it is |
| --- | --- |
| `BlueLoadingDialog` | Blocking overlay, under a turning propeller, for an operation in progress |
| `BlueProgressBar` | How far along something is, or that it is going at all |
| `BlueSnackbar` | The corner notices are shown in, raised from anywhere |
| `BlueSpinner` | A turning ring, for a wait with no measure |

**Composables and helpers**

| Export | What it does |
| --- | --- |
| `useBlueSnackbar` | Raises a notice, or reports a failed call, from anywhere |
| `useBlueLoading` | Blocks the page while something is running |
| `useBlueOs` | What the vehicle calls itself, its address and its version |
| `useBlueOsSetting` | A value kept on the vehicle rather than in this browser |
| `blueOsService` | Any BlueOS service by name, with JSON and errors handled |
| `useBluePopover` | The top-layer placement the menus and tooltips are built on |
| `applyBlueTheme` | Restates the tokens at runtime |
| `downloadJson` / `pickJsonFile` | Saves a profile to disk, and reads one back |

## Browser support

The menus use the [popover API](https://developer.mozilla.org/docs/Web/API/Popover_API) and the
dialogs use `<dialog>`, so they need Chrome 114, Edge 114, Firefox 125 or Safari 17 and up.

## Develop

```bash
npm install
npm run dev         # the gallery on http://localhost:8090
npm run build       # dist/bluevue.js, dist/index.d.ts and dist/style.css
npm run docs:build  # the gallery as a static site, in docs-dist
```
