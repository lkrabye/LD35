import Module from '../Module'

export default class Repair extends Module {
  healAmount = 0.1

  constructor(pos) {
    super(pos, 125)

    this.cost = 175
    this.cooldownTime = 3000
    this.displayName = 'Repair'
    this.description = 'Repairs adjacent modules'
    this.actionDelay = 2500
  }

  performAction() {
    super.performAction()

    ;[...this.neighbors, this].forEach(n => n.changeHealth(this.healAmount * n.maxHealth, this))
  }
}
