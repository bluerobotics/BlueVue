import { readonly, type Ref, ref } from 'vue'

export interface BlueLoadingState {
  show: boolean
  message: string
  dismissible: boolean
}

interface BlueLoadingApi {
  loading: Readonly<Ref<BlueLoadingState>>
  /**
   * Raises the overlay. Leave it blocking for anything that is writing to a vehicle: dismissing it
   * would leave the page live over a change still in flight. A wait that only delays information,
   * such as the first read of a vehicle, can be dismissible.
   */
  showLoading: (message?: string, dismissible?: boolean) => void
  hideLoading: () => void
}

// One overlay for the whole application, so two operations cannot each raise their own and leave
// the second one holding the page after the first has finished.
const loading = ref<BlueLoadingState>({ show: false, message: 'Working…', dismissible: false })

const showLoading = (message = 'Working…', dismissible = false): void => {
  loading.value = { show: true, message, dismissible }
}

const hideLoading = (): void => {
  loading.value = { ...loading.value, show: false }
}

/**
 * The application's blocking wait, which BlueApp renders as a BlueLoadingDialog.
 * @returns {BlueLoadingApi} The state, and the ways to raise and lower it.
 */
export function useBlueLoading(): BlueLoadingApi {
  return { loading: readonly(loading) as Readonly<Ref<BlueLoadingState>>, showLoading, hideLoading }
}
