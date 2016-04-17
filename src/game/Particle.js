import TWEEN from 'tween.js'

export default class Particle {
  alive = true
  color = null
  size = 0
  position = null
  velocity = null
  direction = null
  tween = null

  constructor(col, size, vel, fromPos, toPos, type, extraFall = false) {
    this.color = col
    this.size = size
    this.velocity = vel
    this.fromPos = fromPos
    this.toPos = toPos
    this.position = this.fromPos

    this.tween = new TWEEN.Tween(this.position)
      .to({x: toPos.x, y: toPos.y}, 1000)
      .easing(type)
      .start()
      .onComplete(::this.kill)

    if (extraFall) {
      new TWEEN.Tween(this.position)
        .to({y: toPos.y + 2}, 1000)
        .start()
        .onComplete(::this.kill)
    }
  }

  kill() {
    this.alive = false
  }
}
