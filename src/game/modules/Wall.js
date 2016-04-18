import Module from './Module'

export default class Wall extends Module {
  incomeAmount = 50

  constructor(pos) {
    super(pos, 300)

    this.cost = 25
    this.cooldownTime = 800
    this.displayName = 'Wall'
    this.description = 'Simple defensive wall'
  }
}
