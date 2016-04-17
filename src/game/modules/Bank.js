import Module from '../Module'

export default class Bank extends Module {
  incomeAmount = 25

  constructor(pos) {
    super(pos, 250)

    this.cost = 200
    this.displayName = 'Bank'
    this.description = `Generates ${this.incomeAmount} money per second`
    this.actionDelay = 1000
  }

  performAction() {
    super.performAction()

    this.owner.changeMoney(this.incomeAmount)
  }
}
