const cache = new Map()

export default function playSound(url) {
  return
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
  console.log(cache)
}
