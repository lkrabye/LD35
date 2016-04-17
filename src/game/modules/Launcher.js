import Module from '../Module'
import {Missile} from '../projectiles'
import playSound from '../../sound'

export default class Launcher extends Module {
  constructor(pos) {
    super(pos, 100)

    this.cost = 500
    this.displayName = 'Launcher'
    this.description = 'Fires missiles that track your opponent\'s core'
    this.actionDelay = 3000
  }

  performAction() {
    super.performAction()

    playSound('sfx/missile.mp3')

    this.fire(new Missile())
  }
}
