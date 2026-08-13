import { onBeforeUnmount, onMounted, ref, type Ref, watch } from 'vue'

import { BlueOsError, blueOsService, isBlueOsExtension } from '../services/blueos'

const beacon = blueOsService('beacon')
const bag = blueOsService('bag')
const versionChooser = blueOsService('version-chooser')
const customization = blueOsService('customization')

export interface BlueOsHost {
  /** What the vehicle is called, which is what an extension should call it too. */
  vehicleName: Ref<string | null>
  /** The address the vehicle answers to, without the .local suffix. */
  hostname: Ref<string | null>
  /** The BlueOS image currently running, as its docker tag. */
  version: Ref<string | null>
  /** The vehicle's primary colour, as #RRGGBB. Null until it arrives, and when it cannot. */
  primaryColor: Ref<string | null>
  /** Whether BlueOS itself is in dark mode. Extensions are drawn dark either way. */
  isDarkTheme: Ref<boolean>
  /** Whether BlueOS is in pirate mode, which is what hides or shows developer-only controls. */
  isPirateMode: Ref<boolean>
  /** Whether BlueOS is serving this page, as opposed to a development server. */
  embedded: boolean
  /** Why the last identity read failed, or null while the vehicle answered. */
  error: Ref<BlueOsError | null>
  /** Reads everything again, which a page does after something else may have changed it. */
  refresh: () => Promise<void>
}

// One set of values for the whole page: BlueApp and whoever else asks share the same read rather
// than each hitting the vehicle for the same three strings.
const vehicleName = ref<string | null>(null)
const hostname = ref<string | null>(null)
const version = ref<string | null>(null)
const primaryColor = ref<string | null>(null)
const isDarkTheme = ref(true)
const isPirateMode = ref(false)
const error = ref<BlueOsError | null>(null)

const take = async <T>(task: Promise<T>, write: (value: T) => void): Promise<boolean> => {
  try {
    write(await task)
    return true
  } catch {
    return false
  }
}

const refresh = async (): Promise<void> => {
  const [named, addressed, imaged] = await Promise.all([
    take(beacon.get<string>('vehicle_name'), (value) => {
      vehicleName.value = value
    }),
    take(beacon.get<string>('hostname'), (value) => {
      hostname.value = value
    }),
    take(versionChooser.get<{ repository: string; tag: string }>('version/current'), (image) => {
      version.value = image.tag
    }),
  ])

  // Theme and pirate mode are extras: a vehicle that answers its name but not its colour is still
  // a vehicle, and the kit keeps the colours it shipped with.
  await Promise.all([
    take(customization.get<{ primary: string }>('theme'), (theme) => {
      primaryColor.value = theme.primary
    }),
    take(bag.get<{ is_dark_theme?: boolean; is_pirate_mode?: boolean }>('get/settings'), (settings) => {
      if (typeof settings.is_dark_theme === 'boolean') isDarkTheme.value = settings.is_dark_theme
      if (typeof settings.is_pirate_mode === 'boolean') isPirateMode.value = settings.is_pirate_mode
    }),
  ])

  error.value = named || addressed || imaged
    ? null
    : new BlueOsError('Could not reach the vehicle', beacon.url('vehicle_name'), 0)
}

/**
 * What the vehicle running this extension says about itself. Read once when the first consumer
 * mounts, and again whenever it is asked for, since none of it changes on its own. Each field
 * stays at its default when that particular call fails, so a page opened off the vehicle still
 * renders.
 * @returns {BlueOsHost} The vehicle's name, address, version and look, and the means to read them again.
 */
export const useBlueOs = (): BlueOsHost => {
  onMounted(() => {
    void refresh()
  })

  return {
    vehicleName,
    hostname,
    version,
    primaryColor,
    isDarkTheme,
    isPirateMode,
    embedded: isBlueOsExtension(),
    error,
    refresh,
  }
}

/**
 * A value kept on the vehicle rather than in this browser, so an extension is configured once and
 * found configured from every machine that opens it. It reads as the fallback until the stored
 * value arrives, and writes itself back, at most twice a second, whenever it is changed.
 * @param {string} path Where it is kept, as 'extension-name/setting'. Slashes nest.
 * @param {T} fallback What it reads as while there is nothing stored, and if the read fails.
 * @returns {Ref<T>} The value, which is written back on assignment.
 */
export const useBlueOsSetting = <T>(path: string, fallback: T): Ref<T> => {
  const value = ref(fallback) as Ref<T>
  // Assignments made while the stored value is still on its way would otherwise be written back as
  // if they were the reader's, and the arriving value would then overwrite what the reader chose.
  let settled = false
  let pending: ReturnType<typeof setTimeout> | undefined

  onMounted(async () => {
    try {
      value.value = await bag.get<T>(`get/${path}`)
    } catch (raised) {
      // 400 is what the bag answers with for a path holding nothing, which is the ordinary state
      // of a setting nobody has changed yet. Anything else is a failure, and the fallback stands.
      if ((raised as BlueOsError).status !== 400) console.warn(`Could not read ${path}:`, raised)
    }
    settled = true
  })

  const save = (): void => {
    bag.post(`set/${path}`, value.value).catch((raised) => console.warn(`Could not save ${path}:`, raised))
  }

  const stop = watch(value, () => {
    if (!settled) return
    clearTimeout(pending)
    pending = setTimeout(() => {
      pending = undefined
      save()
    }, 500)
  }, { deep: true })

  onBeforeUnmount(() => {
    stop()
    // A page closed within half a second of a change would otherwise lose it.
    if (pending !== undefined) {
      clearTimeout(pending)
      save()
    }
  })

  return value
}
