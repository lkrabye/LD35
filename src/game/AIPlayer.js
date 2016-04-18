import Player from './Player'

export default class AIPlayer extends Player {
  actionDelay = 0
  aiInterval = 0
  buildPlan = []

  constructor(game, rootPos, plan, interval, smartCooldown = false) {
    super(game, rootPos)

    this.color = '#933'
    this.buildPlan = plan
    this.aiInterval = interval
    this.smartCooldown = smartCooldown
  }

  tick(dt) {
    super.tick(dt)

    this.actionDelay -= dt * 1000
    if (this.actionDelay <= 0) {
      this.actionDelay = this.aiInterval

      this.doAI()
    }
  }

  doAI() {
    if (!this.game.winner) {
      this.followPlan()
    }
  }

  followPlan() {
    const rootPos = this.root.position

    for (const [type, offset] of this.buildPlan) {
      const pos = rootPos.clone().add(offset)
      if (!this.findModule(type, pos)) {
        if (this.smartCooldown && this.getCooldown(type.name) > 0) {
          continue
        }
        return this.build(type, pos)
      }
    }
  }

  findModule(type, pos) {
    return this.modules.find(m => m instanceof type && m.position.equals(pos))
  }

  build(type, pos) {
    this.addModule(new type(pos.clone()))
  }
}
