import Player from './Player'

const AI_INTERVAL = 10

export default class AIPlayer extends Player {
  actionDelay = 0
  buildPlan = []

  constructor(game, rootPos, plan) {
    super(game, rootPos)

    this.color = '#933'
    this.buildPlan = plan
  }

  tick(dt) {
    super.tick(dt)

    this.actionDelay -= dt * 1000
    if (this.actionDelay <= 0) {
      this.actionDelay = AI_INTERVAL

      this.doAI()
    }
  }

  doAI() {
    this.followPlan()
  }

  followPlan() {
    const rootPos = this.root.position

    for (const [type, offset] of this.buildPlan) {
      const pos = rootPos.clone().add(offset)
      if (!this.findModule(type, pos)) {
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
