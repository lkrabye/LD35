import {DIR_UP, DIR_RIGHT, DIR_DOWN, DIR_LEFT, dirToPoint} from '../direction'

import {
  Core,
} from './modules'

export default class Player {
  game = null
  color = null
  root = null
  modules = []
  money = 500000
  income = 15
  onAddProjectile = null

  constructor(game, rootPos) {
    this.game = game
    this.root = new Core(rootPos)
    this.root.game = this.game
    this.root.owner = this
    this.modules.push(this.root)
  }

  addModule(mod) {
    if (this.money < mod.cost) {
      return false
    }

    const tile = mod.position
    if (this.modules.find(m => m.position.equals(tile))) {
      return false
    }

    if (this === this.game.player && tile.y < Math.ceil(this.game.grid.y / 2)) {
      return false
    }

    const positions = [DIR_UP, DIR_RIGHT, DIR_DOWN, DIR_LEFT].map(dir => tile.clone().add(dirToPoint(dir)))
    const neighbors = this.modules.filter(m => !!positions.find(p => p.equals(m.position)))

    if (neighbors.length) {
      this.money -= mod.cost
      mod.game = this.game
      mod.owner = this
      this.modules.push(mod)

      neighbors.forEach(n => {
        mod.neighbors.push(n)
        n.neighbors.push(mod)
      })
    }
  }

  tick(dt) {
    this.changeMoney(dt * this.income)
    ;[...this.modules].forEach(m => m.tick(dt))
  }

  changeMoney(amount) {
    this.money += amount
  }

  moduleDestroyed(mod) {
    mod.neighbors.forEach(n => n.detach(mod))
    mod.neighbors.length = 0
    this.game.spawnModuleExplosion(mod)
  }

  removeModule(mod) {
    this.modules = this.modules.filter(m => m !== mod)
  }
}
