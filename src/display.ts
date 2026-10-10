/**
 * Display density, per device: 'auto' switches to compact on small screens (iPhone SE & co.),
 * 'compact' / 'normal' force it. Applied as the class `compact-ui` on <html>.
 */
export type Density = 'auto' | 'compact' | 'normal'
const KEY = 'wfd:density'

export function loadDensity(): Density {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'compact' || v === 'normal' ? v : 'auto'
  } catch {
    return 'auto'
  }
}

const isSmall = () => window.innerWidth <= 380 || window.innerHeight <= 700

export function applyDensity(d: Density = loadDensity()) {
  document.documentElement.classList.toggle('compact-ui', d === 'compact' || (d === 'auto' && isSmall()))
}

export function saveDensity(d: Density) {
  try {
    localStorage.setItem(KEY, d)
  } catch {
    /* ignore */
  }
  applyDensity(d)
}

/** Call once at startup: applies the setting and follows rotation / window size in 'auto'. */
export function initDensity() {
  applyDensity()
  window.addEventListener('resize', () => applyDensity())
}
