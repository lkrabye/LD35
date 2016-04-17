import Point from '../../Point'
import {degsToRads} from '../../trig'

export default class Projectile {
  alive = true
  owner = null
  size = null
  position = null
  rotation = 0
  direction = null
  velocity = null
  damage = 0
  imageName = null

  constructor(vel, size, imgName) {
    this.velocity = vel
    this.size = size
    this.imageName = imgName
  }

  init(pos, dir, rot) {
    this.position = pos
    this.direction = dir
    this.rotation = rot
    this.updateDirection()
  }

  rotate(degs) {
    this.rotation = (this.rotation + degs) % 360
    if (this.rotation < 0) this.rotation += 360
    this.updateDirection()
  }

  updateDirection() {
    const rads = degsToRads(this.rotation)
    this.direction = new Point(Math.cos(rads), Math.sin(rads)).normalize()
  }

  tick(dt) {
    this.position.add(this.direction.clone().multiply(this.velocity * dt))
  }

  kill() {
    this.alive = false
  }
}
