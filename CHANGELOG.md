# Changelog

One entry per release, newest first.

## 0.2.2: what came back from the 4K Cam Manager

The 4K Cam Manager extension has carried forked copies of `BlueSlider`, `BlueSelect`, `BlueSwitch`,
`BlueButtonGroup` and `ExpansiblePanel` since July 2025, well before this package existed. Over
roughly thirty commits those copies picked up fixes that were never brought back here. This release
brings them back, so the extension can drop the forks and consume the package.

The traffic is almost entirely one way. Everything below is a behaviour the extension had and this
package did not.

---

### BlueSlider

#### The commit lock ran backwards

The lock exists so the slider does not flicker when its own emitted value comes back through
`modelValue`. The condition inverted that: it returned early for values that did **not** match the
lock and fell through for values that did, so the control ignored the host and accepted its own
echo.

```diff
-      Date.now() < commitLockUntilMs.value &&
-      !approxEqual(next, commitLockValue.value)
-    ) {
-      return
-    }
+      Date.now() < commitLockUntilMs.value
+    ) {
+      if (approxEqual(next, commitLockValue.value)) return
+      clearCommitLock()
+    }
```

The lock also fell from 2000ms to 400ms. Two seconds is long enough to swallow a value the host
drives on its own, which is what focus and zoom correlation does on every move.

#### `lastSentValue` never tracked the host

The parent-sync watch set `currentSliderValue` but left `lastSentValue` alone, so a value the host
set was still remembered as un-sent. Dragging away and back to it emitted nothing, because
`sendValue` compares against `lastSentValue`.

#### `endInteracting` could run more than once, and leaked listeners

It is reached from the pointer, from the range input's `blur`, and from its `change` event, but it
had no guard and committed once per arrival. Its `pointerup` and `pointercancel` listeners were
registered `{ once: true }`, so whenever one of the other two paths ended the interaction the
listener stayed on `window` until the next pointer down consumed it. Both now settle once, and the
listeners are removed explicitly. `startInteracting` also refuses re-entry.

#### An emptied edit box committed NaN

Clearing the number input reads as `NaN`. `clampEditedValue` clamped it and the edit-mode watcher
committed it. Both now check `Number.isFinite` first.

#### Escape re-committed the value it had just restored

`handleValueChange` restored the old value and left edit mode, and the watcher on
`isEditingCurrentSliderValue` then committed that restored value as a fresh edit. A `skipEditCommit`
flag, set before the mode changes, makes Escape mean nothing happened.

#### Native number spinners lost their click

Clicking a spinner arrow blurs the input before the step is applied, so `@blur` closed the editor
and the step went nowhere. Leaving edit mode now waits 150ms and checks whether focus came back.

#### Float drift read as a new value

`sendValue` compared with `===`. It now allows a quarter of a step, below which two values are the
same value.

#### A zero-width range divided by zero

`fillWidth` divided by `max - min` unguarded, so `min === max` positioned the pill at `NaN`.

#### The label named nothing

The `<label>` had no `for`, and the edit input had no accessible name. Both are wired now, through
a generated id.

---

### BlueSwitch

The track is a `div`, so it had no role, no state, no name and no way to reach it from the keyboard.
It now carries `role="switch"`, `aria-checked`, `aria-disabled` and `tabindex`, is named by its own
visible label through `aria-labelledby`, and answers Enter and Space.

**Breaking: `width` is gone.** Every part of the track was positioned absolutely, so the track could
not see its own text: its width came only from that prop and the knob took a flat 60% of it. A word
longer than the knob was clipped, and a generous `width` stretched a pair of short words across the
page, which is what the SITL manager's battery switch did at `width="340px"`. The track now measures
the longer of the two words at the knob's own type size and takes its width from that, so the knob
clears its text by 5px at either end of its travel however long the word is, and a short pair stays
compact. Delete the prop at the call site; there is nothing to replace it with.

### BlueDialog

`showModal()` hands focus to the first control inside, so every dialog opened with a button already
ringed and one Enter away from firing. Chromium ignores `autofocus` on the dialog element, so the
surface takes the focus back itself on open: it is still inside the trap and still announced, the
first Tab still reaches the first control, and nothing is preselected.

The `max-height: 92vh` cap also stopped at the dialog and never reached the panel, so a dialog taller
than the viewport painted its footer below the fold with no way to reach it: an element in the top
layer does not scroll with the page. The dialog is a column while open, the panel takes its height,
and the body is the part that gives, so the header and the footer hold their place and whatever does
not fit scrolls between them. The 4K Cam Manager is where this shows, since Cockpit embeds it in an
iframe that can be shorter than the connecting dialog is tall.

`headerDivider` defaults to on, but Vue casts an absent boolean prop to `false`, so no header was
ever ruled unless a caller asked for it. The default is now declared as `undefined` and read with
`?? true`, the same shape `BlueBanner` uses for `expanded`. Both rules also take the panel's own
hairline instead of a fainter hardcoded one, so a header or footer reads as divided by the same line
that closes the panel.

---

### Fixed here, not ported: the stacking leak

The extension's forks did not fix this one, they inherited it, and it is the bug that prompted the
work. `BlueSlider`'s track is `position: relative` with `z-index: auto`, which opens no stacking
context, so the value pill's `z-50` and the min/max labels' `z-10` were resolved against the page.
In the 4K Cam Manager they beat a sticky warning banner at `z-index: 3` and painted over its text.

The track now sets `isolation: isolate`, which keeps both inside it and costs the host nothing.

`BlueButtonGroup` had the same shape treated the other way round, with `z-[666]` on its track to win
whatever it was losing to. That is now `isolate` as well: its menu is a popover in the top layer and
needs no help from a z-index.

---

### Also not ported: the wind rose pointed the wrong way

A wind is named for where it comes from, so 45° is a wind out of the north-east. `BlueWindRose` drew
its arrow pointing outwards at the heading, which reads as a wind blowing towards the north-east:
the opposite of the value. The arrow now flies inwards, tail on the rim at the heading and head at
the centre.

Not every value on a circle is a wind, and an arrow either way round would be a claim about a plain
angle that nothing supports. The new `angle` prop marks the heading with a bare bar instead, so a
tilt or a bearing can use the same rose without inheriting a wind's convention.

---

### Also in this release

`BlueExpansiblePanel` animated `max-height` between `0` and a fixed `500px`. A panel taller than
that was clipped as it opened, and a short one reached full height in a fraction of the duration and
then sat still. Both ends now come from the panel's own measured height, set by the component in the
transition hooks, and `bluevue.css` keeps only the transition itself.

The same fold then had a stall in it, halfway through closing. `max-height` cannot take an element
below its own padding, and it never touches margin at all, so the body's inset was a floor the
collapse hit early: the panel shrank for the first half of the run and sat at that floor for the
rest, then jumped the remainder away when `v-show` hid it. The inset now lives on a wrapper inside
the animated box, which carries none of its own, so the height follows the animation to zero. That
is why `bodyClass` asks for padding rather than margin.

---

### Deliberately not taken from the extension

The forks also drifted in ways this package should not follow:

| The fork does | Why it stays here |
| --- | --- |
| `min-w-[130px]` fixed label column | The control beside the label shrinks a thousand times more readily, so the label keeps its text without a fixed column |
| `opacity-50` when disabled | `opacity-30` is the value every other control uses |
| `w-[4.5rem]` fixed-width pill | `min-w-[60px]` with `whitespace-nowrap` fits a formatted value of any length |
| `min-w-[130px]` hardcoded on every slider | The same column is available through `labelWidth`, for the host to set where it wants one |
| `text-[15px]` min/max labels | `text-[12px] font-medium` is the current type scale |
| `v-menu`, `v-list`, `v-icon`, `.elevation-*` | The library dropped Vuetify; `BlueSelect` is a native popover and `BlueButtonGroup` has a real long-press context menu |
| `px-8` panel body inset | `px-13` is the current inset |
| "beedback" in a JSDoc | Already spelled correctly here |

---

### Visual parity with the extension

Porting the extension onto this package changed how several controls read, and the cause was the
same everywhere. Tailwind v4 emits its utilities inside a cascade layer, and Vuetify's reset is
unlayered, so in the extension every unlayered Vuetify rule beat `text-xs`, `text-sm`, `font-medium`
and `font-bold` outright. Those classes were written but never applied: the extension renders them
at the inherited 16px and weight 400. Dropping Vuetify let them apply for the first time, which is
why the port came out smaller and bolder than the thing it replaces.

The controls follow what the extension actually renders rather than what its markup asked for:

- `BlueButtonGroup` names are 16px regular, and each density's inset drops by the width the larger
  type takes, so a button ends up the size it always was.
- `BlueSlider` takes a `valueWeight`, since the pill's `font-bold` never reached the extension. Its
  `width` is now a cap on a track that still holds half the row rather than a fixed width, and that
  half carries a 140px floor, so a narrow row gives the track more than half of itself instead of
  collapsing with it. `labelWidth` sets a floor for the label column so a column of sliders starts
  its tracks at one place.
- `BlueExpansiblePanel` titles are 16px regular for the same reason.
- `BlueSwitch` goes back to one knob carrying the state's own name, sliding over a track that only
  says what the other position would be. The two-column layout said both at once, which is more
  words for the same state. Its label also loses the `max-w-[45%]` cap: in a row narrow enough for
  45% to bite, that ellipsized a label with room to spare.

### New: the header family

`BlueHeader` lays out the bar a panel opens with, `BlueHeaderSelector` names the subject above the
value the way a filled form field does, and `BlueHeaderMenu` holds the actions behind a glyph sized
for a header rather than for a row. `BlueButton` gains `elevation`, 1 to 5 over the Material scale
the stylesheet now carries in full, defaulting to 1 on the chip variants and to none on text and
icon buttons, and never raised while disabled. `BlueExpansiblePanel` gains `headerAlign="end"` for a
secondary panel nested inside another, which drops the rules and tucks the title against the right
edge, and `bodyClass` to replace the body's own inset when the panel it nests in already insets.
Its body is a flex column spacing its children 15px apart, so the panel owns the rhythm of the
controls it holds and a host no longer repeats a margin on every child to get an even column.

---

### One implementation note

The label ids are generated by `src/utils/id.ts` rather than Vue's `useId`, which landed in Vue 3.5.
This package's peer range is `^3.4`, and raising it for a counter would not be a fair trade.
