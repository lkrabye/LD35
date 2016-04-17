import TWEEN from 'tween.js'

import playSound from '../sound'
import {dirToPoint} from '../direction'
import {COLOR_HEAL} from '../colors'

const DEATH_ANIM_DUR = 1000

export default class Module {
  game = null
  owner = null
  alive = true
  deathTimer = 0
  position = null
  neighbors = []
  maxHealth = 0
  health = 0
  actionDelay = 0
  lastAction = 0
  cost = 0
  cooldownTime = 0
  displayName = ''
  description = ''

  constructor(pos, health) {
    this.position = pos ? pos.clone() : null
    this.maxHealth = health
    this.health = health
    this.resetTimer()
  }

  hasNeighbor(dir) {
    const target = this.position.clone().add(dirToPoint(dir))
    return !!this.neighbors.find(n => n.position.equals(target))
  }

  changeHealth(amount, source) {
    const old = this.health
    this.health = Math.min(this.maxHealth, Math.max(0, this.health + amount))

    if (old !== this.health && this !== source) {
      if (amount > 0) {
        this.game.createParticle(COLOR_HEAL, 2, 12, source.position, this.position, 3, 5, TWEEN.Easing.Cubic.InOut, true)
      }
      else if (this.health <= 0) {
        this.kill()
      }
    }
  }

  detach(other) {
    this.neighbors = this.neighbors.filter(n => n !== other)
  }

  tick(dt) {
    if (this.actionDelay) {
      const now = new Date().getTime()
      if (now >= this.lastAction + this.actionDelay) {
        this.performAction()
      }
    }

    if (this.deathTimer) {
      this.deathTimer -= dt * 1000
      if (this.deathTimer <= 0) {
        this.owner.removeModule(this)
      }
    }
  }

  performAction() {
    this.resetTimer()
  }

  resetTimer() {
    this.lastAction = new Date().getTime()
  }

  fire(p) {
    this.game.fireProjectile(p, this)
  }

  kill() {
    this.alive = false
    this.deathTimer = DEATH_ANIM_DUR
    this.owner.moduleDestroyed(this)
    playSound('sfx/explosion.mp3')
  }

  percentAlive() {
    if (!this.deathTimer) {
      return 1
    }

    return Math.max(0, this.deathTimer / DEATH_ANIM_DUR)
  }
}
