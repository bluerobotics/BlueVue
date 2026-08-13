import type { Component } from 'vue'

import BlueAppDemo from './demos/BlueAppDemo.vue'
import BlueBannerDemo from './demos/BlueBannerDemo.vue'
import BlueBannerGroupDemo from './demos/BlueBannerGroupDemo.vue'
import BlueButtonDemo from './demos/BlueButtonDemo.vue'
import BlueButtonGroupDemo from './demos/BlueButtonGroupDemo.vue'
import BlueCardDemo from './demos/BlueCardDemo.vue'
import BlueConfirmDialogDemo from './demos/BlueConfirmDialogDemo.vue'
import BlueDialogDemo from './demos/BlueDialogDemo.vue'
import BlueExpansiblePanelDemo from './demos/BlueExpansiblePanelDemo.vue'
import BlueIconDemo from './demos/BlueIconDemo.vue'
import BlueInputDemo from './demos/BlueInputDemo.vue'
import BlueJobDialogDemo from './demos/BlueJobDialogDemo.vue'
import BlueLoadingDialogDemo from './demos/BlueLoadingDialogDemo.vue'
import BlueMenuDemo from './demos/BlueMenuDemo.vue'
import BlueProgressBarDemo from './demos/BlueProgressBarDemo.vue'
import BluePromptDialogDemo from './demos/BluePromptDialogDemo.vue'
import BlueSectionDemo from './demos/BlueSectionDemo.vue'
import BlueSelectDemo from './demos/BlueSelectDemo.vue'
import BlueSliderDemo from './demos/BlueSliderDemo.vue'
import BlueSnackbarDemo from './demos/BlueSnackbarDemo.vue'
import BlueSpinnerDemo from './demos/BlueSpinnerDemo.vue'
import BlueStatDemo from './demos/BlueStatDemo.vue'
import BlueSwitchDemo from './demos/BlueSwitchDemo.vue'
import BlueTooltipDemo from './demos/BlueTooltipDemo.vue'

/** One row of a component's API: a prop, an event or a slot. */
export interface ApiRow {
  name: string
  type: string
  default?: string
  description: string
}

export type DocGroup = 'Layout' | 'Controls' | 'Overlays' | 'Feedback' | 'Display'

export interface ComponentDoc {
  /** The name it is imported and written as. */
  name: string
  /** Its address in the hash, kebab-cased. */
  slug: string
  group: DocGroup
  /** One line, for the card in the gallery. */
  blurb: string
  /** What it is and how it behaves, for the top of its own page. */
  about: string
  /** When to reach for it, and when to reach for something else. */
  when?: string[]
  props?: ApiRow[]
  events?: ApiRow[]
  slots?: ApiRow[]
  /** Anything else worth a table, such as the composable a component is driven by. */
  extraApi?: { title: string; rows: ApiRow[] }[]
  /** Enough of a template to paste into a panel and have it work. */
  snippet: string
  demo: Component
}

/** The order the gallery lays the groups out in: the page first, then what goes on it. */
export const GROUPS: DocGroup[] = ['Layout', 'Controls', 'Display', 'Overlays', 'Feedback']

const THEME_ROW: ApiRow = {
  name: 'theme',
  type: "'light' | 'dark'",
  default: "'light'",
  description: 'Which surface the control is drawn for. Extensions are dark.',
}

export const catalog: ComponentDoc[] = [
  {
    name: 'BlueApp',
    slug: 'blue-app',
    group: 'Layout',
    blurb: "An extension's whole page, feedback included.",
    about:
      "BlueOS's backdrop, one card in the middle of it, and the two pieces of feedback every extension needs mounted once. Wrap your panels in it and the notices raised through useBlueSnackbar and the waits raised through useBlueLoading appear by themselves, from wherever in the application they were raised.",
    when: [
      'Reach for it as the root of an extension, around everything else.',
      'Use BlueCard directly instead when a page needs more than one sheet, or when the extension is not the whole page.',
    ],
    props: [
      { name: 'title', type: 'string', description: 'The name in the bar, which is the extension\'s own.' },
      { name: 'logo', type: 'string', description: 'An image beside the title, such as the extension\'s mark.' },
      { name: 'icon', type: 'string', description: 'An mdi name beside the title, for an extension with no mark.' },
      { name: 'width', type: 'string', default: "'615px'", description: 'How wide the card is allowed to get.' },
      {
        name: 'backdrop',
        type: 'string',
        default: "'#0C577B'",
        description: "What is painted behind the card. An extension's iframe has an opaque canvas, so a transparent page shows black rather than BlueOS.",
      },
    ],
    slots: [
      { name: 'default', type: '', description: 'The page.' },
      { name: 'actions', type: '', description: 'Buttons at the right of the title bar.' },
      { name: 'footer', type: '', description: 'A strip under the body.' },
    ],
    snippet: `<BlueApp title="SITL Manager" :logo="logo">
  <template #actions>
    <BlueButton variant="icon" icon="mdi-refresh" tooltip="Refresh" @click="reload" />
  </template>

  <StatusPanel />
  <BlueExpansiblePanel title="Vehicle & frame" theme="dark" :expanded="true">
    <VehiclePanel />
  </BlueExpansiblePanel>
</BlueApp>`,
    demo: BlueAppDemo,
  },
  {
    name: 'BlueCard',
    slug: 'blue-card',
    group: 'Layout',
    blurb: 'The sheet a page is laid out on.',
    about:
      'A titled bar over a body, raised off the backdrop, with an optional strip along the bottom. The bar carries the mark and the actions that belong to the whole sheet; anything narrower in scope belongs to the section it acts on.',
    when: [
      'Reach for it when a page needs a second sheet beside the one BlueApp already draws.',
      'Keep the actions in the bar to the ones that act on everything below it.',
    ],
    props: [
      { name: 'title', type: 'string', description: 'The heading in the bar.' },
      { name: 'logo / icon', type: 'string', description: 'An image or an mdi name before the title.' },
      { name: 'width', type: 'string', default: "'615px'", description: 'How wide the card is allowed to get.' },
      { name: 'bodyClass', type: 'string', default: "'px-5 py-4'", description: "Replaces the body's own inset." },
    ],
    slots: [
      { name: 'default', type: '', description: 'The body.' },
      { name: 'header', type: '', description: 'Replaces the mark and the title.' },
      { name: 'actions', type: '', description: 'Buttons at the right of the bar.' },
      { name: 'footer', type: '', description: 'A strip under the body, laid out with space between.' },
    ],
    snippet: `<BlueCard title="Vehicle" icon="mdi-ferry">
  <BlueStat label="Board" :value="status.board" />
</BlueCard>`,
    demo: BlueCardDemo,
  },
  {
    name: 'BlueSection',
    slug: 'blue-section',
    group: 'Layout',
    blurb: 'A subject inside a panel.',
    about:
      'A quiet heading over a stack of rows, evenly spaced. Smaller than a BlueExpansiblePanel, which is a section of the page rather than a part of one, and not foldable. Notes about the subject sit on the heading line, where they are read before the rows they qualify.',
    when: [
      'Reach for it to group the fields inside a panel by what they are about: wind, then waves.',
      'Use a BlueExpansiblePanel instead when the group is large enough to be worth hiding.',
    ],
    props: [
      { name: 'title', type: 'string', description: 'The heading.' },
      { name: 'gap', type: 'number', default: '12', description: 'Space between the rows, in pixels.' },
    ],
    slots: [
      { name: 'default', type: '', description: 'The rows.' },
      { name: 'notes', type: '', description: 'Beside the heading, for a BlueBannerGroup qualifying the subject.' },
    ],
    snippet: `<BlueSection title="Wind">
  <template #notes>
    <BlueBannerGroup :banners="windNotes" />
  </template>

  <BlueSlider v-model="speed" name="wind-speed" label="Speed" theme="dark" :min="0" :max="60" />
</BlueSection>`,
    demo: BlueSectionDemo,
  },
  {
    name: 'BlueStat',
    slug: 'blue-stat',
    group: 'Display',
    blurb: 'One read-only fact, in a row of them.',
    about:
      'A quiet label over its value, in a box that takes an equal share of the row and wraps to the next line when there is no room. A value that has not arrived yet reads as an em dash rather than as an empty box, and a value too long for its box keeps the whole of itself in the hover text.',
    when: [
      'Reach for a row of them to say what the vehicle currently is: board, firmware, frame.',
      'Use a BlueInput instead the moment the reader is meant to change it.',
    ],
    props: [
      { name: 'label', type: 'string', description: 'What the fact is.' },
      { name: 'value', type: 'string | number | null', description: 'The fact. Null, undefined and empty all read as absent.' },
      { name: 'placeholder', type: 'string', default: "'—'", description: 'What to show while there is no value.' },
    ],
    snippet: `<div class="flex flex-wrap gap-2">
  <BlueStat label="Board" :value="status?.board" />
  <BlueStat label="Firmware" :value="status?.firmware_version" />
</div>`,
    demo: BlueStatDemo,
  },
  {
    name: 'BlueExpansiblePanel',
    slug: 'blue-expansible-panel',
    group: 'Layout',
    blurb: 'A titled section of a page that folds away.',
    about:
      'Groups a page into sections a reader can shut. The title bar carries the state, and the body is a slot, so anything can live inside one. Panels stack without a wrapper: each is a block with its own hairline.',
    when: [
      'Reach for it to divide a long configuration page into subjects.',
      'Give the section a plain heading instead when its contents are two or three fields that nobody needs to hide.',
    ],
    props: [
      { name: 'title', type: 'string', description: 'The heading on the bar.' },
      { name: 'expanded', type: 'boolean', default: 'false', description: 'Whether it starts open.' },
      THEME_ROW,
    ],
    events: [{ name: 'update:expanded', type: '(value: boolean)', description: 'Opened or shut, so the state can be kept.' }],
    slots: [{ name: 'default', type: '', description: 'The body of the section.' }],
    snippet: `<BlueExpansiblePanel
  title="Ambient conditions"
  theme="dark"
  :expanded="true"
>
  <!-- anything -->
</BlueExpansiblePanel>`,
    demo: BlueExpansiblePanelDemo,
  },
  {
    name: 'BlueButton',
    slug: 'blue-button',
    group: 'Controls',
    blurb: 'The standard action, in four weights.',
    about:
      'A button with no colour of its own is a secondary action and reads as a barely-there fill. The filled one is what the panel is actually asking to be done, and a panel asks for one thing at a time. Out of reach, a filled or tonal button becomes the same flat grey chip; a text or icon button simply fades, since it has no chip to grey.',
    when: [
      "Use variant=\"filled\" for the single action a panel exists to perform, such as applying what was edited.",
      'Leave the variant off for everything beside it: cancel, reset, import, export.',
      'Use variant="icon" for a glyph on its own, and give it a tooltip, which is also the name assistive technology reads.',
    ],
    props: [
      {
        name: 'variant',
        type: "'tonal' | 'filled' | 'text' | 'icon'",
        default: "'tonal'",
        description: 'How much weight the action carries.',
      },
      { name: 'color', type: 'string', default: 'var(--bluevue-primary)', description: 'The fill of a filled button, the glyph colour of the rest.' },
      {
        name: 'density',
        type: "'compact' | 'regular' | 'comfortable'",
        default: "'regular'",
        description: 'Height and inset. Regular is the height of a button group beside it.',
      },
      { name: 'icon', type: 'string', description: 'An mdi name before the label, or the whole of an icon button.' },
      { name: 'appendIcon', type: 'string', description: 'An mdi name after the label.' },
      { name: 'loading', type: 'boolean', description: 'Swaps the icon for a spinner and takes the button out of reach.' },
      { name: 'disabled', type: 'boolean', description: 'Out of reach, with a reason worth stating nearby.' },
      { name: 'block', type: 'boolean', description: 'Takes the whole width it is given.' },
      { name: 'tooltip', type: 'string', description: 'Hover text, and the accessible name of an icon button.' },
      THEME_ROW,
    ],
    events: [{ name: 'click', type: '(event: MouseEvent)', description: 'Pressed.' }],
    slots: [{ name: 'default', type: '', description: 'The label. Ignored by an icon button.' }],
    snippet: `<BlueButton
  variant="filled"
  icon="mdi-check"
  :loading="applying"
  @click="apply"
>
  Apply
</BlueButton>`,
    demo: BlueButtonDemo,
  },
  {
    name: 'BlueButtonGroup',
    slug: 'blue-button-group',
    group: 'Controls',
    blurb: 'One choice out of a few, or several toggles, in a single track.',
    about:
      'A row of buttons in one track: type="switch" keeps exactly one selected, type="toggle" lets each stand on its own. The selected one is raised and takes the primary colour, and a crowded group tightens its own padding before it starts cutting into names. A right-click or a press-and-hold on a button reports back rather than selecting it, which is what preset rows use to offer rename and delete.',
    when: [
      'Reach for it when the options are few, short and worth seeing all at once, such as presets or a speed multiplier.',
      'Use a BlueSelect instead once the list is long enough to need scrolling.',
    ],
    props: [
      { name: 'buttonItems', type: 'ButtonItem[]', description: 'Name, and optionally tooltip, preSelected, activeColor, disabled and onSelected.' },
      { name: 'type', type: "'switch' | 'toggle'", description: 'One selected at a time, or each independent.' },
      { name: 'buttonsMenu', type: 'MenuItem[]', description: 'Extra actions, behind an arrow at the end of the track.' },
      { name: 'density', type: "'compact' | 'regular' | 'comfortable'", default: "'comfortable'", description: 'How much room each name is given.' },
      { name: 'label', type: 'string', description: 'Row label on the left.' },
      { name: 'infoTooltip', type: 'string', description: 'A hint behind an info icon beside the group.' },
      { name: 'disabled', type: 'boolean', description: 'Fades and takes the whole group out of reach.' },
      { name: 'height', type: 'string', description: 'Overrides the height the density asks for.' },
      THEME_ROW,
    ],
    events: [
      { name: 'update:selected', type: '(value: boolean[])', description: 'The selection, one flag per button.' },
      {
        name: 'context-menu',
        type: '({ item, index, x, y })',
        description: 'A button was right-clicked or held, with the position to open a BlueMenu at.',
      },
    ],
    slots: [{ name: 'insetElement', type: '', description: 'Something to sit between the label and the track.' }],
    snippet: `<BlueButtonGroup
  label="Speedup"
  theme="dark"
  type="switch"
  :button-items="[{ name: '1x', preSelected: true }, { name: '5x' }]"
  @context-menu="openPresetMenu"
/>`,
    demo: BlueButtonGroupDemo,
  },
  {
    name: 'BlueInput',
    slug: 'blue-input',
    group: 'Controls',
    blurb: 'A text or number field, sunk into the surface.',
    about:
      'The field is a well cut into the panel rather than a box on top of it, which is what tells a reader it is somewhere to type. A number field emits numbers and never emits an empty value: clearing it leaves the last number in place until a new one is typed, so a half-typed value never travels to a vehicle.',
    when: [
      'Reach for it for a value typed by hand: a name, a coordinate, a port.',
      'Use a BlueSlider instead when the value is a magnitude the reader would rather feel than type.',
    ],
    props: [
      { name: 'modelValue', type: 'string | number | null', description: 'The value, through v-model.' },
      { name: 'type', type: "'text' | 'number'", default: "'text'", description: 'What the field accepts and emits.' },
      { name: 'label', type: 'string', description: 'Label on the left of the row.' },
      { name: 'name', type: 'string', description: 'Name and id, tying the label to the field.' },
      { name: 'suffix', type: 'string', description: 'Unit or short hint shown inside the field, after the value.' },
      { name: 'placeholder', type: 'string', description: 'Shown while the field is empty.' },
      { name: 'min / max / step', type: 'number', description: 'Bounds and increment of a number field.' },
      { name: 'errorMessages', type: 'string[]', description: 'Validation messages, which also outline the field.' },
      { name: 'autofocus', type: 'boolean', description: 'Takes focus when it appears, including inside a dialog.' },
      { name: 'disabled', type: 'boolean', description: 'Fades and takes the field out of reach.' },
      { name: 'infoTooltip', type: 'string', description: 'A hint behind an info icon beside the field.' },
      { name: 'width / height', type: 'string', default: "height '30px'", description: 'Size of the field itself, not of the row.' },
      THEME_ROW,
    ],
    events: [{ name: 'update:modelValue', type: '(value: string | number)', description: 'A new value was typed.' }],
    slots: [{ name: 'insetElement', type: '', description: 'Something to sit between the label and the field.' }],
    snippet: `<BlueInput
  v-model="latitude"
  name="latitude"
  label="Latitude"
  type="number"
  suffix="deg"
  theme="dark"
  :step="0.001"
/>`,
    demo: BlueInputDemo,
  },
  {
    name: 'BlueSelect',
    slug: 'blue-select',
    group: 'Controls',
    blurb: 'One or several options from a list.',
    about:
      'The list opens in the top layer, so a panel that clips its own overflow cannot cut it off, and it is at least as wide as the control it hangs off. Options carry a name and may be disabled; multiSelect keeps the list open and returns an array.',
    when: [
      'Reach for it once the options are too many, too long, or too changeable to lay out as a button group.',
    ],
    props: [
      { name: 'items', type: '{ name: string; disabled?: boolean }[]', description: 'The options.' },
      { name: 'modelValue', type: 'unknown', description: 'The chosen option, or an array of them.' },
      { name: 'multiSelect', type: 'boolean', description: 'Lets several be chosen, and keeps the list open.' },
      { name: 'label', type: 'string', description: 'Label on the left of the row.' },
      { name: 'errorMessages', type: 'string[]', description: 'Validation messages, which also outline the control.' },
      { name: 'infoTooltip', type: 'string', description: 'A hint behind an info icon beside the control.' },
      { name: 'disabled', type: 'boolean', description: 'Fades and takes the control out of reach.' },
      { name: 'width / height', type: 'string', description: 'Size of the control itself.' },
      THEME_ROW,
    ],
    events: [{ name: 'update:modelValue', type: '(value: unknown)', description: 'A different option was chosen.' }],
    slots: [{ name: 'insetElement', type: '', description: 'Something to sit between the label and the control.' }],
    snippet: `<BlueSelect
  v-model="vehicle"
  label="Vehicle type"
  theme="dark"
  :items="[{ name: 'BlueBoat' }, { name: 'BlueROV2' }]"
/>`,
    demo: BlueSelectDemo,
  },
  {
    name: 'BlueSlider',
    slug: 'blue-slider',
    group: 'Controls',
    blurb: 'A magnitude, dragged rather than typed.',
    about:
      'The pill shows the value it is at, and the ends of the track say where the range stops. A scale function pair lets the track be linear while the value is not, for something like a wind speed that wants more room at its low end than at its high one.',
    when: [
      'Reach for it for a bounded magnitude whose exact number matters less than its size.',
      'Pair it with a BlueInput when the number does have to be exact.',
    ],
    props: [
      { name: 'modelValue', type: 'number | null', description: 'The value, through v-model.' },
      { name: 'min / max', type: 'number', description: 'The ends of the range.' },
      { name: 'step', type: 'number', default: '1', description: 'Increment.' },
      { name: 'name', type: 'string', description: 'Name of the underlying range input.' },
      { name: 'label', type: 'string', description: 'Label on the left of the row.' },
      { name: 'labelMin / labelMax', type: 'string', description: 'What to write at the ends of the track.' },
      { name: 'color', type: 'string', description: 'The pill, in place of the primary token.' },
      { name: 'scaleFn / unscaleFn', type: '(value: number) => number', description: 'Maps the track to the value and back, for a non-linear range.' },
      { name: 'formatDisplay', type: '(value: number) => string', description: 'How the value reads on the pill.' },
      { name: 'disabled', type: 'boolean', description: 'Fades and takes the slider out of reach.' },
      { name: 'width / height', type: 'string', default: "width '100%'", description: 'Size of the track.' },
      THEME_ROW,
    ],
    events: [{ name: 'update:modelValue', type: '(value: number)', description: 'The pill was moved.' }],
    snippet: `<BlueSlider
  v-model="windSpeed"
  name="wind-speed"
  label="Wind speed"
  theme="dark"
  :min="0"
  :max="100"
/>`,
    demo: BlueSliderDemo,
  },
  {
    name: 'BlueSwitch',
    slug: 'blue-switch',
    group: 'Controls',
    blurb: 'One thing on or off, with both states named.',
    about:
      'Both labels are laid out rather than drawn over, so the track takes its width from the longer of the two and the knob covering either side has the same room. The label under the knob is white; the far one stays as a dim reminder of what the other position says.',
    when: [
      'Reach for it when the two states have names worth reading, such as Armed and Safe.',
      'Use a BlueCheckbox instead for a plain yes or no in a list of settings.',
    ],
    props: [
      { name: 'modelValue', type: 'boolean | null', description: 'The state, through v-model.' },
      { name: 'name', type: 'string', description: 'Name of the control.' },
      { name: 'labelOn / labelOff', type: 'string', default: "'On' / 'Off'", description: 'What each position says.' },
      { name: 'label', type: 'string', description: 'Label on the left of the row.' },
      { name: 'color', type: 'string', description: 'The knob when it is on.' },
      { name: 'infoTooltip', type: 'string', description: 'A hint behind an info icon beside the control.' },
      { name: 'disabled', type: 'boolean', description: 'Fades and takes the switch out of reach.' },
      { name: 'width / height', type: 'string', default: "height '30px'", description: 'Size of the track.' },
      THEME_ROW,
    ],
    events: [{ name: 'update:modelValue', type: '(value: boolean)', description: 'Flipped.' }],
    snippet: `<BlueSwitch
  v-model="armed"
  name="armed"
  label="Start armed"
  label-on="Armed"
  label-off="Safe"
  theme="dark"
/>`,
    demo: BlueSwitchDemo,
  },
  {
    name: 'BlueIcon',
    slug: 'blue-icon',
    group: 'Display',
    blurb: 'A Material Design Icon in a square box.',
    about:
      'The box is the size of the em rather than of whatever the glyph advances, so a column of icons lines up whichever ones it carries. Names may be written with or without the mdi- prefix. Without a label it is hidden from assistive technology, which is right for an icon beside text that already says the same thing.',
    when: [
      'Reach for it anywhere a glyph appears next to text.',
      'Give it a label only when the icon is the whole of the message.',
    ],
    props: [
      { name: 'name', type: 'string', description: 'Icon name, with or without the mdi- prefix.' },
      { name: 'size', type: 'number | string', default: '20', description: 'Side of the box.' },
      { name: 'color', type: 'string', description: 'Any CSS colour. Defaults to the text colour around it.' },
      { name: 'spin', type: 'boolean', description: 'Turns, for something under way.' },
      { name: 'label', type: 'string', description: 'Read out in place of the icon.' },
    ],
    snippet: '<BlueIcon name="mdi-refresh" :size="18" :spin="refreshing" />',
    demo: BlueIconDemo,
  },
  {
    name: 'BlueMenu',
    slug: 'blue-menu',
    group: 'Overlays',
    blurb: 'A list of actions, from a button or from a pointer.',
    about:
      'Opens in the top layer, so it is never clipped and needs no z-index. Give it an activator to hang it off a button, or a target to place it at a right-click. The browser dismisses it on an outside click and on Escape. Items carry an icon, an action, and optionally a hint explaining why they are out of reach.',
    when: [
      'Reach for it for actions that are worth having but not worth a button each.',
      'Pair it with a button group\'s context-menu event for per-item actions such as rename and delete.',
    ],
    props: [
      { name: 'modelValue', type: 'boolean', description: 'Whether the menu is up, through v-model.' },
      { name: 'items', type: 'BlueMenuItem[]', description: 'title, icon, action, and optionally danger, disabled and hint.' },
      { name: 'target', type: '[number, number]', description: 'A viewport position to open at, instead of an activator.' },
    ],
    events: [{ name: 'update:modelValue', type: '(value: boolean)', description: 'Opened, or dismissed by the browser.' }],
    slots: [{ name: 'activator', type: '{ props }', description: 'Bind the props onto the button the menu hangs off.' }],
    snippet: `<BlueMenu
  v-model="menuOpen"
  :items="menuItems"
>
  <template #activator="{ props }">
    <BlueButton v-bind="props" variant="icon" icon="mdi-dots-vertical" tooltip="Actions" />
  </template>
</BlueMenu>`,
    demo: BlueMenuDemo,
  },
  {
    name: 'BlueTooltip',
    slug: 'blue-tooltip',
    group: 'Overlays',
    blurb: 'A label for whatever it wraps.',
    about:
      'Appears on hover and on keyboard focus, after a rest long enough that a pointer crossing a row of controls does not trail tooltips behind it. It opens in the top layer, so a panel that clips its own overflow cannot cut it off.',
    when: [
      'Reach for it to name an icon button or to explain a control whose label has no room for the explanation.',
      'Do not put anything in one that the reader must have: a tooltip is unreachable on a touch screen.',
    ],
    props: [
      { name: 'text', type: 'string', description: 'The label. An empty one shows nothing.' },
      { name: 'placement', type: 'Placement', default: "'top'", description: 'Which side it hangs off, flipped when there is no room.' },
      { name: 'openDelay', type: 'number', default: '300', description: 'How long the pointer rests before it appears, in ms.' },
      { name: 'disabled', type: 'boolean', description: 'Wraps its content and shows nothing.' },
      THEME_ROW,
    ],
    slots: [{ name: 'default', type: '', description: 'What the tooltip describes.' }],
    snippet: `<BlueTooltip text="Reads the vehicle again">
  <BlueButton variant="icon" icon="mdi-refresh" />
</BlueTooltip>`,
    demo: BlueTooltipDemo,
  },
  {
    name: 'BlueDialog',
    slug: 'blue-dialog',
    group: 'Overlays',
    blurb: 'The surface every other dialog is built on.',
    about:
      'A frosted panel in the browser\'s top layer, with an optional header, a body and an optional footer. Being a native modal it dims the page itself, keeps focus inside, and closes on Escape and on the backdrop. Made persistent it does none of those and offers no way out, which is what an operation that must not be interrupted needs.',
    when: [
      'Reach for it for a dialog the kit does not already have: an editor, a picker, a report.',
      'Use BlueConfirmDialog, BluePromptDialog or BlueJobDialog when one of them already says what you mean.',
      'Keep the footer to two actions: the way out on the left, the committing one on the right.',
    ],
    props: [
      { name: 'modelValue', type: 'boolean', description: 'Whether the dialog is up, through v-model.' },
      { name: 'title', type: 'string', description: 'The heading. Without one the dialog is only its body.' },
      { name: 'subtitle', type: 'string', description: 'A line under the title, for what the dialog acts on.' },
      { name: 'icon / iconColor', type: 'string', default: "'#42A5F5'", description: 'An mdi name beside the title, and its colour.' },
      { name: 'persistent', type: 'boolean', description: 'Takes away Escape, the backdrop and the close button.' },
      { name: 'width', type: 'string', default: "'624px'", description: 'Panel width. It never exceeds the viewport.' },
      { name: 'bodyClass', type: 'string', default: "'px-5 py-4'", description: "Replaces the body's own inset." },
    ],
    events: [{ name: 'update:modelValue', type: '(value: boolean)', description: 'Closed, however it was closed.' }],
    slots: [
      { name: 'default', type: '', description: 'The body.' },
      { name: 'header', type: '', description: 'Replaces the icon, title and subtitle.' },
      { name: 'footer', type: '', description: 'Laid out with space between, so a hint and the actions sit at opposite ends.' },
    ],
    snippet: `<BlueDialog v-model="open" title="Endpoint" icon="mdi-lan-connect">
  <BlueInput v-model="port" name="port" label="UDP port" type="number" theme="dark" />

  <template #footer>
    <BlueButton variant="text" density="compact" @click="open = false">Cancel</BlueButton>
    <BlueButton variant="filled" density="compact" @click="save">Save</BlueButton>
  </template>
</BlueDialog>`,
    demo: BlueDialogDemo,
  },
  {
    name: 'BlueConfirmDialog',
    slug: 'blue-confirm-dialog',
    group: 'Overlays',
    blurb: 'Asks before something that cannot be taken back.',
    about:
      'The question is the title, what it will cost is the message, and the committing button names the action rather than agreeing with the question. Marked as dangerous it takes the error colour and the warning icon.',
    when: [
      'Reach for it before deleting, overwriting, or restarting something.',
      'Do not reach for it for an action the reader can simply undo.',
    ],
    props: [
      { name: 'modelValue', type: 'boolean', description: 'Whether the dialog is up, through v-model.' },
      { name: 'title', type: 'string', description: 'The question.' },
      { name: 'message', type: 'string', description: 'What confirming will do, and to what.' },
      { name: 'confirmLabel', type: 'string', default: "'Confirm'", description: "Names the action: 'Delete', 'Restart', 'Overwrite'." },
      { name: 'cancelLabel', type: 'string', default: "'Cancel'", description: 'The way out.' },
      { name: 'danger', type: 'boolean', description: 'Colours the committing button as a warning.' },
      { name: 'icon', type: 'string', description: 'Overrides the icon the danger flag picks.' },
    ],
    events: [{ name: 'confirm', type: '()', description: 'The committing button was pressed.' }],
    slots: [{ name: 'default', type: '', description: 'Anything more the reader needs, under the message.' }],
    snippet: `<BlueConfirmDialog
  v-model="open"
  title="Delete “Sydney Harbour”?"
  message="The preset cannot be recovered once it is gone."
  confirm-label="Delete"
  danger
  @confirm="remove"
/>`,
    demo: BlueConfirmDialogDemo,
  },
  {
    name: 'BlueJobDialog',
    slug: 'blue-job-dialog',
    group: 'Overlays',
    blurb: 'Work with stages to it, reported as it goes.',
    about:
      'The pattern behind installing firmware, writing parameters and waiting for a restart: a row of stages, a bar for the one in flight, and a log of what has happened. It holds the page while the job is running and lets go the moment it is not, so a job that ends in a failure can be read, retried or skipped from the footer. The log follows its own tail, unless the reader has scrolled up, in which case it leaves them where they are.',
    when: [
      'Reach for it for anything long enough that the reader would otherwise wonder whether it is still going.',
      'Use a BlueLoadingDialog instead when the work has no stages worth showing.',
    ],
    props: [
      { name: 'modelValue', type: 'boolean', description: 'Whether the dialog is up, through v-model.' },
      { name: 'title', type: 'string', description: 'What the job is.' },
      { name: 'subtitle', type: 'string', description: 'What it is doing right now.' },
      { name: 'state', type: "'running' | 'failed' | 'done'", description: 'Running holds the page; the other two release it.' },
      { name: 'steps', type: 'BlueJobStep[]', description: 'key, title, state, and optionally detail.' },
      { name: 'progress', type: 'number', description: 'Percentage of the stage in flight, when it can count itself.' },
      { name: 'indeterminate', type: 'boolean', description: 'For a stage that can only say it is waiting.' },
      { name: 'progressLabel', type: 'string', description: 'The line above the bar.' },
    ],
    events: [{ name: 'update:modelValue', type: '(value: boolean)', description: 'Closed.' }],
    slots: [
      { name: 'log', type: '', description: 'Monospace records, in a box that follows its own tail.' },
      { name: 'badges', type: '', description: 'Counts at the right of the progress line.' },
      { name: 'footer', type: '', description: 'A hint on the left, the actions on the right.' },
    ],
    snippet: `<BlueJobDialog
  v-model="open"
  title="Applying BlueBoat"
  :state="job.state"
  :steps="job.steps"
  :progress="job.done / job.total * 100"
  :progress-label="\`\${job.done}/\${job.total} parameters processed\`"
>
  <template #log>
    <div v-for="record in job.records" :key="record.name">{{ record.name }}</div>
  </template>
</BlueJobDialog>`,
    demo: BlueJobDialogDemo,
  },
  {
    name: 'BluePromptDialog',
    slug: 'blue-prompt-dialog',
    group: 'Overlays',
    blurb: 'Asks for a name, and optionally a note.',
    about:
      'A modal built on the native dialog element: Escape and the backdrop close it, and focus starts in the field. The footer states what the buttons will do between them. Confirming reports the trimmed name and note; an empty name cannot be confirmed.',
    when: ['Reach for it to name something being saved, or to rename something saved earlier.'],
    props: [
      { name: 'modelValue', type: 'boolean', description: 'Whether the dialog is up, through v-model.' },
      { name: 'title', type: 'string', description: 'The heading.' },
      { name: 'label', type: 'string', description: 'Field label for the name.' },
      { name: 'subtitle', type: 'string', description: 'What the name will be attached to.' },
      { name: 'initial', type: 'string', description: 'What the field starts with.' },
      { name: 'notesLabel / notesInitial', type: 'string', description: 'Adds a second, optional field.' },
      { name: 'confirmLabel', type: 'string', default: "'Save'", description: 'The committing button.' },
      { name: 'icon', type: 'string', description: 'An mdi name beside the title.' },
      { name: 'hint', type: 'string', description: 'A line in the footer, for anything worth saying about the outcome.' },
    ],
    events: [
      { name: 'confirm', type: '(name: string, notes: string)', description: 'Confirmed, with both values trimmed.' },
      { name: 'update:modelValue', type: '(value: boolean)', description: 'Closed, however it was closed.' },
    ],
    snippet: `<BluePromptDialog
  v-model="saveOpen"
  title="Save configuration"
  label="Name"
  hint="Stored on the vehicle."
  @confirm="save"
/>`,
    demo: BluePromptDialogDemo,
  },
  {
    name: 'BlueLoadingDialog',
    slug: 'blue-loading-dialog',
    group: 'Feedback',
    blurb: 'A blocking wait, under a turning propeller.',
    about:
      'Covers the page for exactly as long as it is told to. Unless it is dismissible there is no way out of it, and Escape is swallowed: an operation the user cannot interrupt must not end up running under a live page.',
    when: [
      'Reach for it while the values on screen no longer describe the vehicle, such as during a restart.',
      'Make it dismissible when the wait is one the reader may reasonably walk away from.',
      'Use a BlueProgressBar instead when the work can say how far along it is.',
    ],
    props: [
      { name: 'modelValue', type: 'boolean', description: 'Whether the overlay is up, through v-model.' },
      { name: 'message', type: 'string', description: 'What is happening, under the propeller.' },
      { name: 'dismissible', type: 'boolean', description: 'Offers a close button and lets Escape through.' },
    ],
    events: [{ name: 'update:modelValue', type: '(value: boolean)', description: 'Dismissed.' }],
    snippet: `<BlueLoadingDialog
  v-model="loading"
  message="Restarting the autopilot…"
  dismissible
/>`,
    demo: BlueLoadingDialogDemo,
  },
  {
    name: 'BlueSnackbar',
    slug: 'blue-snackbar',
    group: 'Feedback',
    blurb: 'What just happened, in the corner of the page.',
    about:
      'Mount it once, at the root, and raise notices from wherever they happen through useBlueSnackbar. Anything that failed waits to be dismissed, since a failure is worth acting on; everything else passes after five seconds. The same message arriving again counts up rather than stacking, so a retry loop reads as one thing that keeps happening.',
    when: [
      'Reach for it to confirm something that worked, or to report something that did not.',
      'Use a BlueBanner instead for a condition that stays true, such as a frame that ignores wind.',
      'Use a BlueConfirmDialog instead when the reader has to answer rather than be told.',
    ],
    props: [
      {
        name: 'position',
        type: "'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'",
        default: "'bottom-right'",
        description: 'Which corner the notices gather in.',
      },
    ],
    extraApi: [
      {
        title: 'useBlueSnackbar()',
        rows: [
          { name: 'notify', type: '(text, { severity, timeout })', description: "Says something happened. Severity is 'info' unless it is given." },
          { name: 'notifyError', type: '(error, fallback?)', description: "Reports a failure in the server's own words when it sent any, and never times out." },
          { name: 'dismiss', type: '(id: number)', description: 'Takes a notice down early.' },
          { name: 'notices', type: 'Readonly<Ref<BlueNotice[]>>', description: 'The queue, for anything wanting to read it.' },
        ],
      },
    ],
    snippet: `// anywhere
const { notify, notifyError } = useBlueSnackbar()
notify('Configuration applied', { severity: 'success' })

// at the root, once (BlueApp does this for you)
<BlueSnackbar />`,
    demo: BlueSnackbarDemo,
  },
  {
    name: 'BlueBanner',
    slug: 'blue-banner',
    group: 'Display',
    blurb: 'A note that keeps to a square until it is asked for.',
    about:
      'Shut, a banner is its icon and nothing else; open, it is one line of message. Only its width moves between the two, so a row of them keeps its height and nothing around it is pushed about. A message too long for the room keeps its line and loses its tail to the edge, since the pointer is where the whole of it is read either way.',
    when: [
      'Reach for it for a condition that stays true while the page is open: a frame that ignores wind, a profile that cancels what is beside it.',
      'Use a BlueSnackbar instead for something that just happened.',
      'Use several of them through a BlueBannerGroup rather than stacking them by hand.',
    ],
    props: [
      { name: 'text', type: 'string', description: 'The message, which the banner is only as wide as while it is open.' },
      { name: 'severity', type: "'error' | 'warning' | 'info' | 'success'", default: "'info'", description: 'Which of the standard looks to take.' },
      { name: 'expanded', type: 'boolean', default: 'true', description: 'Whether it starts open.' },
      { name: 'icon', type: 'string', description: "An mdi name, in place of the severity's icon." },
      { name: 'color / background / border', type: 'string', description: "Each part of the look, in place of the severity's." },
    ],
    events: [{ name: 'update:expanded', type: '(value: boolean)', description: 'Opened or shut by a click.' }],
    snippet: `<BlueBanner
  text="The BlueBoat frame ignores wind: it never leaves the surface."
  severity="warning"
  :expanded="false"
/>`,
    demo: BlueBannerDemo,
  },
  {
    name: 'BlueBannerGroup',
    slug: 'blue-banner-group',
    group: 'Display',
    blurb: 'A row of banners that opens one at a time.',
    about:
      'The banners sit side by side as squares. Opening one shuts the others and gives it the room they leave, and the ones already read gather at the end of the row. The row is ordered through CSS rather than reordered, so each banner stays where it is and none of them loses the animation it is in the middle of.',
    when: [
      'Reach for it wherever a section can raise more than one note, which is most of them.',
    ],
    props: [
      { name: 'banners', type: 'BannerContent[]', description: 'Message and look for each. The message identifies it, so make them distinct.' },
    ],
    snippet: `<BlueBannerGroup
  v-if="notes.length"
  :banners="notes"
/>`,
    demo: BlueBannerGroupDemo,
  },
  {
    name: 'BlueProgressBar',
    slug: 'blue-progress-bar',
    group: 'Feedback',
    blurb: 'How far along something is.',
    about:
      'Give it a value for work whose size is known, and set indeterminate for work that is under way but cannot say how much of it is left. A value outside the range is clamped rather than painted past the end of the track.',
    when: [
      'Reach for it for a job with countable steps, such as parameters being written.',
      'Use a BlueSpinner instead when the wait is short and unmeasurable.',
    ],
    props: [
      { name: 'modelValue', type: 'number', default: '0', description: 'Percentage complete, clamped to 0-100.' },
      { name: 'indeterminate', type: 'boolean', description: 'Sweeps instead of filling.' },
      { name: 'height', type: 'number', default: '4', description: 'Bar thickness in pixels.' },
      { name: 'color', type: 'string', description: 'The fill, in place of the primary token.' },
      { name: 'label', type: 'string', description: 'What is progressing, for assistive technology.' },
      THEME_ROW,
    ],
    snippet: '<BlueProgressBar :model-value="written / total * 100" label="Writing parameters" />',
    demo: BlueProgressBarDemo,
  },
  {
    name: 'BlueSpinner',
    slug: 'blue-spinner',
    group: 'Feedback',
    blurb: 'A turning ring, for a wait with no measure.',
    about:
      'The smallest way to say that something is happening. A button that is waiting on its own result carries one in place of its icon, which BlueButton does for you when it is given loading.',
    when: [
      'Reach for it inline, beside or inside whatever is waiting.',
      'Use a BlueLoadingDialog instead when the whole page has to wait.',
    ],
    props: [
      { name: 'size', type: 'number | string', default: '20', description: 'Diameter.' },
      { name: 'color', type: 'string', default: 'var(--bluevue-accent)', description: 'The arc that turns.' },
      { name: 'width', type: 'number', default: '2', description: 'Ring thickness in pixels.' },
      { name: 'label', type: 'string', description: 'What is being waited for, for assistive technology.' },
    ],
    snippet: '<BlueSpinner :size="16" label="Reading the vehicle" />',
    demo: BlueSpinnerDemo,
  },
]
