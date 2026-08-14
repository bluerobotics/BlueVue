import { ref } from 'vue'

// Hash routing rather than paths: the site is a project page on GitHub Pages, where a deep link to
// a path is a 404 unless the server rewrites it, and Pages will not.
const readSlug = (): string => window.location.hash.replace(/^#\/?/, '')

export const currentSlug = ref(readSlug())

export const hrefFor = (slug: string): string => `#/${slug}`

window.addEventListener('hashchange', () => {
  currentSlug.value = readSlug()
  // A page opened from halfway down the gallery starts at its own top, not at that scroll.
  window.scrollTo({ top: 0 })
})
