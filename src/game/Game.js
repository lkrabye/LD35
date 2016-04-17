import TWEEN from 'tween.js'

import HumanPlayer from './HumanPlayer'
import AIPlayer from './AIPlayer'
import Point from '../Point'
import Particle from './Particle'
import {range} from '../random'
import {rectsOverlap} from '../trig'
import {randomPlan} from './buildPlans'

export default class Game {
  grid = 0
  gridSize = 0
  player = null
  opponent = null
  projectiles = []
  particles = []
  gui = null
  lastTick = 0

  constructor({grid, gridSize}) {
    this.grid = grid
    this.gridSize = gridSize

    const x = Math.floor(grid.x / 2)
    this.player = new HumanPlayer(this, new Point(x, grid.y - 3))
    this.opponent = new AIPlayer(this, new Point(x, 2), randomPlan())
  }

  start(gui) {
    this.gui = gui
    this.lastTick = new Date().getTime()
    setInterval(::this.tick, 1000 / 16)
    this.temp = 0
  }

  tick() {
    const dt = (new Date().getTime() - this.lastTick) / 1000
    this.player.tick(dt)
    this.opponent.tick(dt)

    this.updateProjectiles(dt)
    // this.particles.forEach(p => p.tick(dt))

    TWEEN.update()

    this.projectiles = this.projectiles.filter(p => p.alive)
    this.particles = this.particles.filter(p => p.alive)

    this.gui.draw()

    this.lastTick = new Date().getTime()
  }

  updateProjectiles(dt) {
    this.projectiles.forEach(p => {
      p.tick(dt)

      const projBox = [p.position.x, p.position.y, p.size.x, p.size.y]
      this.opponentsModules(p.owner).forEach(m => {
        if (m.alive && p.alive) {
          const modBox = [
            m.position.x * this.gridSize,
            m.position.y * this.gridSize,
            this.gridSize,
            this.gridSize
          ]
          if (rectsOverlap(modBox, projBox)) { // no time to care about rotation
            m.changeHealth(-p.damage)
            p.kill()
          }
        }
      })

      if (p.alive && (p.position.y < -p.size.y || p.position.y > this.grid.y * this.gridSize + p.size.y)) {
        p.kill()
      }
    })
  }

  opponentsModules(other) {
    return [...this.opponentOf(other).modules]
  }

  opponentOf(other) {
    return other === this.player ? this.opponent : this.player
  }

  fireProjectile(projectile, module) {
    this.temp = (this.temp + 1 % 360)
    projectile.owner = module.owner
    projectile.init(
      new Point(
        module.position.x * this.gridSize + this.gridSize / 2 - projectile.size.x / 2,
        module.position.y * this.gridSize + this.gridSize / 2 - projectile.size.y / 2,
      ),
      new Point(0, -1),
      module.owner === this.player ? 270 : 90
    )
    this.projectiles.push(projectile)
  }

  spawnModuleExplosion(mod) {
    this.createParticle('yellow', 2, 12, mod.position, mod.position, 12, 30, TWEEN.Easing.Quintic.Out, false)
  }

  createParticle(color, size, vel, fromPos, toPos, count, spread, type, extraFall) {
    const params = [
      color,
      size,
      vel
    ]

    this.spawnCluster(params,
      new Point(
        fromPos.x * this.gridSize + this.gridSize / 2,
        fromPos.y * this.gridSize + this.gridSize / 2,
      ),
      new Point(
        toPos.x * this.gridSize + this.gridSize / 2,
        toPos.y * this.gridSize + this.gridSize / 2,
      ),
      count,
      spread,
      type,
      extraFall,
    )
  }

  spawnCluster(params, fromPos, toPos, num, spread, type, extraFall) {
    for (let i = 0; i < num; i++) {
      const particle = new Particle(
        ...params,
        fromPos.clone(),
        toPos.clone().add(new Point(range(-spread, spread), range(-spread, spread))),
        type,
        extraFall,
      )
      this.particles.push(particle)
    }
  }
}
