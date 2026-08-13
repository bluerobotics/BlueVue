import type { Component } from 'vue'

import BlueButtonDemo from './demos/BlueButtonDemo.vue'
import BlueButtonGroupDemo from './demos/BlueButtonGroupDemo.vue'
import BlueExpansiblePanelDemo from './demos/BlueExpansiblePanelDemo.vue'
import BlueIconDemo from './demos/BlueIconDemo.vue'
import BlueInputDemo from './demos/BlueInputDemo.vue'
import BlueLoadingDialogDemo from './demos/BlueLoadingDialogDemo.vue'
import BlueMenuDemo from './demos/BlueMenuDemo.vue'
import BlueProgressBarDemo from './demos/BlueProgressBarDemo.vue'
import BluePromptDialogDemo from './demos/BluePromptDialogDemo.vue'
import BlueSelectDemo from './demos/BlueSelectDemo.vue'
import BlueSliderDemo from './demos/BlueSliderDemo.vue'
import BlueSpinnerDemo from './demos/BlueSpinnerDemo.vue'
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
