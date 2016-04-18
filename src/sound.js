const cache = new Map()
let enabled = false

export function playSound(url) {
  if (!enabled) {
    return
  }

  let cached = cache.get(url)
  if (!cached) {
    cached = []
    cache.set(url, cached)
  }

  let available = cached.find(s => s.paused)
  if (!available) {
    available = new Audio(url)
    cached.push(available)
  }
  available.play()
}

export function toggleSound() {
  enabled = !enabled
}
