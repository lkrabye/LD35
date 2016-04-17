import Projectile from './Projectile'
import Point from '../../Point'
import {radsToDegs} from '../../trig'

const TRACKING_DELAY = 100
const ROTATION_SPEED = 3

export default class Missile extends Projectile {
  trackingTime = 0
  constructor() {
    super(175, new Point(16, 12), 'missile')

    this.damage = 100
  }

  init(pos, dir, rot) {
    super.init(pos, dir, rot)
    this.track()
  }

  tick(dt) {
    super.tick(dt)

    this.trackingTime -= dt * 1000
    if (this.trackingTime <= 0) {
      this.track()
    }
  }

  track() {
    const g = this.owner.game
    const target = g.opponentOf(this.owner).root

    if (target.alive) {
      const targetAngle = radsToDegs(Math.atan2(
        (target.position.y * g.gridSize + g.gridSize / 2) - this.position.y,
        (target.position.x * g.gridSize + g.gridSize / 2) - this.position.x
      ))

      let diff = targetAngle - this.rotation
      if (diff > 180) diff -= 180
      if (Math.abs(diff) < ROTATION_SPEED) this.rotation = targetAngle
      else this.rotation += Math.sign(diff) * ROTATION_SPEED
      this.updateDirection()
    }

    this.resetTracking()
  }

  resetTracking() {
    this.trackingTime = TRACKING_DELAY
  }
}
