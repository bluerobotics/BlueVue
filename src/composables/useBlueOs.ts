import { onBeforeUnmount, onMounted, ref, type Ref, watch } from 'vue'

import { BlueOsError, blueOsService, isBlueOsExtension } from '../services/blueos'

const beacon = blueOsService('beacon')
const bag = blueOsService('bag')
const versionChooser = blueOsService('version-chooser')

export interface BlueOsHost {
  /** What the vehicle is called, which is what an extension should call it too. */
  vehicleName: Ref<string | null>
  /** The address the vehicle answers to, without the .local suffix. */
  hostname: Ref<string | null>
  /** The BlueOS image currently running, as its docker tag. */
  version: Ref<string | null>
  /** Whether BlueOS is serving this page, as opposed to a development server. */
  embedded: boolean
  /** Why the last read failed, or null while all of them have worked. */
  error: Ref<BlueOsError | null>
  /** Reads all three again, which a page does after something else may have changed them. */
  refresh: () => Promise<void>
}

/**
 * What the vehicle running this extension says about itself. Read once when the page mounts and
 * again whenever it is asked for, since none of it changes on its own.
 * @returns {BlueOsHost} The vehicle's name, address and version, and the means to read them again.
 */
export const useBlueOs = (): BlueOsHost => {
  const vehicleName = ref<string | null>(null)
  const hostname = ref<string | null>(null)
  const version = ref<string | null>(null)
  const error = ref<BlueOsError | null>(null)

  const refresh = async (): Promise<void> => {
    try {
      const [name, host, image] = await Promise.all([
        beacon.get<string>('vehicle_name'),
        beacon.get<string>('hostname'),
        versionChooser.get<{ repository: string; tag: string }>('version/current'),
      ])
      vehicleName.value = name
      hostname.value = host
      version.value = image.tag
      error.value = null
    } catch (raised) {
      // A page off the vehicle has no BlueOS to ask, which is a normal state to be in rather than
      // a failure worth shouting about. It is reported and the values stay as they were.
      error.value = raised as BlueOsError
    }
  }

  onMounted(refresh)

  return { vehicleName, hostname, version, embedded: isBlueOsExtension(), error, refresh }
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
    } catch (error) {
      // 400 is what the bag answers with for a path holding nothing, which is the ordinary state
      // of a setting nobody has changed yet. Anything else is a failure, and the fallback stands.
      if ((error as BlueOsError).status !== 400) console.warn(`Could not read ${path}:`, error)
    }
    settled = true
  })

  const save = (): void => {
    bag.post(`set/${path}`, value.value).catch((error) => console.warn(`Could not save ${path}:`, error))
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
