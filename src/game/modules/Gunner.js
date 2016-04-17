import Module from '../Module'
import {Bullet} from '../projectiles'

export default class Gunner extends Module {
  constructor(pos) {
    super(pos, 175)

    this.cost = 50
    this.displayName = 'Gunner'
    this.description = 'Fires fast but weak shots that travel in a straight line'
    this.actionDelay = 800
  }

  performAction() {
    super.performAction()

    this.fire(new Bullet())
  }
}
