export function degsToRads(degs) {
  let d = degs % 360
  if (d < 0) d += 360
  return d * Math.PI / 180
}

export function radsToDegs(rads) {
  let degs = rads * 180 / Math.PI
  if (degs < 0) degs += 360
  return degs
}

export function rectsOverlap([l1, t1, w1, h1], [l2, t2, w2, h2]) {
  const r1 = l1 + w1
  const r2 = l2 + w2
  const b1 = t1 + h1
  const b2 = t2 + h2
  return !(l2 > r1 || r2 < l1 || t2 > b1 || b2 < t1)
}
