import {flatMap} from 'lodash'

import loadImage from '../imageLoader'

import Point from '../Point'
import {degsToRads} from '../trig'
import {range} from '../random'
import {DIR_UP, DIR_RIGHT, DIR_DOWN, DIR_LEFT} from '../direction'

import {
  Core,
  Launcher,
  Gunner,
  Repair,
  Bank,
  Wall,
} from '../game/modules'

const PIX_FIX = 0.5
const MODULE_EDGE_SEGMENTS = 4
const MODULE_WIGGLE = 2
const TIMER_SIZE = 5

const MODULE_NAMES = {
  GUNNER: 'gunner',
  LAUNCHER: 'launcher',
  REPAIR: 'repair',
  BANK: 'bank',
  WALL: 'wall',
}

export default class Gui {
  container = null
  game = null
  canvas = null
  ctx = null
  grid = 0
  gridSize = 0
  imageCache = {}
  currentModule = null
  elements = {
    MONEY: null,
    MUSIC: null,
  }

  constructor(container, game, settings, callback) {
    this.container = container
    this.game = game
    this.grid = game.grid
    this.gridSize = game.gridSize

    this.canvas = this.container.querySelector('[data-js=canvas]')
    this.canvas.width = this.grid.x * this.gridSize
    this.canvas.height = this.grid.y * this.gridSize
    this.ctx = this.canvas.getContext('2d')

    this.canvas.addEventListener('mousedown', ::this.boardClicked)

    this.container.querySelector('[data-js=moduleShop]').addEventListener('mousedown', ::this.moduleShopClicked)

    this.elements.MONEY = this.container.querySelector('[data-js=playerMoney]')

    this.elements.MUSIC = document.getElementById('music')
    this.elements.MUSIC_TOGGLE = document.querySelector('[data-js="toggleMusic"]')
    this.elements.MUSIC_TOGGLE.addEventListener('click', ::this.toggleMusic)
    this.elements.SOUND_TOGGLE = document.querySelector('[data-js="toggleSound"]')
    this.elements.SOUND_TOGGLE.addEventListener('click', ::this.toggleSound)

    this.toggleMusic()
    this.toggleSound()

    Promise.all([
      loadImage('gfx/missile.png', 'missile'),
      loadImage('gfx/bullet.png', 'bullet'),
      loadImage('gfx/launcher.png', MODULE_NAMES.LAUNCHER),
      loadImage('gfx/gunner.png', MODULE_NAMES.GUNNER),
      loadImage('gfx/repair.png', MODULE_NAMES.REPAIR),
      loadImage('gfx/bank.png', MODULE_NAMES.BANK),
      loadImage('gfx/wall.png', MODULE_NAMES.WALL),
    ]).then(images => {
      this.imageCache = images.reduce((acc, img) => {
        acc[img.name] = img
        return acc
      }, {})
      this.changeModule(MODULE_NAMES.GUNNER)
      callback()
    })

    this.showSetupScreen()
  }

  draw() {
    this.ctx.clearRect(0, 0, this.grid.x * this.gridSize, this.grid.y * this.gridSize)
    this.drawGrid()
    this.drawPlayers()
    this.drawProjectiles()
    this.drawParticles()

    this.drawTopbar()
    this.drawModuleShop()
  }

  drawTopbar() {
    this.elements.MONEY.textContent = Math.floor(this.game.player.money)
  }

  drawModuleShop() {
    Array.from(this.container.querySelectorAll('[data-js=moduleButton]')).forEach(b => {
      const cd = this.game.player.getCooldown(b.getAttribute('data-module'))
      const overlay = b.querySelector('.overlay')
      overlay.style.height = `${cd * 100}%`
    })
  }

  drawGrid() {
    this.ctx.lineWidth = 1
    this.ctx.strokeStyle = '#ccc'

    for (let x = 1; x <= this.grid.x; x++) {
      this.ctx.beginPath()
      this.ctx.moveTo(x * this.gridSize + PIX_FIX, PIX_FIX)
      this.ctx.lineTo(x * this.gridSize + PIX_FIX, this.grid.y * this.gridSize + PIX_FIX)
      this.ctx.stroke()
    }
    for (let y = 1; y <= this.grid.y; y++) {
      this.ctx.beginPath()
      this.ctx.moveTo(PIX_FIX, y * this.gridSize + PIX_FIX)
      this.ctx.lineTo(this.grid.x * this.gridSize + PIX_FIX, y * this.gridSize + PIX_FIX)
      this.ctx.stroke()
    }
  }

  drawPlayers() {
    this.drawPlayer(this.game.player)
    this.drawPlayer(this.game.opponent)
  }

  drawPlayer(player) {
    player.modules.forEach(::this.drawModule)
  }

  drawModule(mod) {
    this.ctx.fillStyle = mod.owner.color
    this.ctx.beginPath()

    this.createPath(mod).forEach((p, i) => {
      const f = i === 0 ? 'moveTo' : 'lineTo'
      this.ctx[f](...p)
    })

    this.ctx.closePath()
    this.ctx.fill()

    if (mod.alive) {
      this.drawTimer(mod)
      this.drawModuleFeature(mod)
      this.drawHealthBar(mod)
    }
  }

  createPath(mod) {
    return flatMap([DIR_UP, DIR_RIGHT, DIR_DOWN, DIR_LEFT], this.createEdge.bind(this, mod))
  }

  createEdge(mod, dir) {
    const step = this.gridSize / (MODULE_EDGE_SEGMENTS + 1)
    const path = []
    const halfGrid = this.gridSize / 2

    if (mod.hasNeighbor(dir)) {
      path.push([0, 0], [this.gridSize, 0])
    }
    else {
      const percentDead = 1 - mod.percentAlive()
      for (let i = 1; i <= MODULE_EDGE_SEGMENTS; i++) {
        const x = i * step + range(-MODULE_WIGGLE, MODULE_WIGGLE)
        if (percentDead === 0) {
          path.push([
            x,
            range(0, 2 * MODULE_WIGGLE)
          ])
        }
        else {
          path.push([
            x < halfGrid ? x + (halfGrid - x) * percentDead : x,
            range(0, 3) + percentDead * this.gridSize / 2
          ])
        }
      }
    }

    const xy = [mod.position.x * this.gridSize, mod.position.y * this.gridSize]
    return path.map(this.rotateEdge.bind(this, xy, dir))
  }

  rotateEdge([x, y], dir, [dx, dy]) {
    if (dir === DIR_UP) return [x + dx, y + dy]
    if (dir === DIR_DOWN) return [x + this.gridSize - dx, y + this.gridSize - dy]
    if (dir === DIR_RIGHT) return [x + this.gridSize - dy, y + dx]
    if (dir === DIR_LEFT) return [x + dy, y + this.gridSize - dx]
  }

  drawHealthBar(mod) {
    const healthPercent = mod.health / mod.maxHealth

    if (healthPercent < 1) {
      const rect = [
        mod.position.x * this.gridSize + 8,
        mod.position.y * this.gridSize + this.gridSize - 14,
        this.gridSize - 16,
        5
      ]

      this.ctx.fillStyle = '#fff'
      this.ctx.fillRect(...rect)

      const innerWidth = (rect[2] - 2)
      this.ctx.fillStyle = '#8ae'
      this.ctx.fillRect(
        rect[0] + 1,
        rect[1] + 1,
        (rect[2] - 2) * healthPercent,
        rect[3] - 2
      )
      this.ctx.fillStyle = '#a24'
      this.ctx.fillRect(
        rect[0] + 1 + innerWidth * healthPercent,
        rect[1] + 1,
        innerWidth * (1 - healthPercent),
        rect[3] - 2
      )
    }
  }

  drawTimer(mod) {
    if (mod.actionDelay) {
      const percentLeft = (new Date().getTime() - mod.lastAction) / mod.actionDelay

      const x = mod.position.x * this.gridSize + this.gridSize - 11
      const y = mod.position.y * this.gridSize + 11

      this.ctx.fillStyle = '#fff'
      this.ctx.beginPath()
      this.ctx.arc(x, y, TIMER_SIZE, 0, 2 * Math.PI)
      this.ctx.fill()

      this.ctx.fillStyle = '#3a3'
      this.ctx.beginPath()
      this.ctx.arc(x, y, TIMER_SIZE - 1, degsToRads(270), degsToRads(360 * percentLeft - 90))
      this.ctx.lineTo(x, y)
      this.ctx.closePath()
      this.ctx.fill()
    }
  }

  drawModuleFeature(mod) {
    const x = mod.position.x * this.gridSize + this.gridSize / 2
    const y = mod.position.y * this.gridSize + this.gridSize / 2

    const shouldFlip = mod.owner === this.game.opponent

    if (mod instanceof Core) {
      this.ctx.fillStyle = '#fff'
      this.ctx.strokeStyle = '#000'
      this.ctx.beginPath()
      this.ctx.arc(x, y, 11, 0, 2 * Math.PI)
      this.ctx.fill()
      this.ctx.stroke()

      this.ctx.fillStyle = mod.pupilColor
      this.ctx.beginPath()
      this.ctx.arc(x + mod.pupilPosition.x, y + mod.pupilPosition.y, 6, 0, 2 * Math.PI)
      this.ctx.fill()

      this.ctx.fillStyle = '#000'
      this.ctx.beginPath()
      this.ctx.arc(x + mod.pupilPosition.x, y + mod.pupilPosition.y, 3, 0, 2 * Math.PI)
      this.ctx.fill()
    }
    else if (mod instanceof Repair) {
      const img = this.imageCache.repair.img
      this.ctx.drawImage(img, x - Math.floor(img.width / 2), y - Math.floor(img.height / 2))
    }
    else if (mod instanceof Launcher) {
      this.drawModuleImage(this.imageCache.launcher.img, [x, y], shouldFlip)
    }
    else if (mod instanceof Gunner) {
      this.drawModuleImage(this.imageCache.gunner.img, [x, y], shouldFlip)
    }
    else if (mod instanceof Bank) {
      const img = this.imageCache.bank.img
      this.ctx.drawImage(img, x - Math.floor(img.width / 2), y - 4)
    }
    else if (mod instanceof Wall) {
      const img = this.imageCache.wall.img
      this.ctx.drawImage(img, x - Math.floor(img.width / 2), y - 4)
    }
  }

  drawModuleImage(img, [x, y], flip) {
    const dx = x - Math.floor(img.width / 2)
    const dy = y - 4
    if (!flip) {
      this.ctx.drawImage(img, dx, dy)
    }
    else {
      this.ctx.save()
      this.ctx.translate(Math.floor(dx + img.width / 2), Math.floor(dy + img.width / 2))
      this.ctx.rotate(degsToRads(180))
      this.ctx.drawImage(img, -img.width / 2, -img.height / 2)
      this.ctx.restore()
    }
  }

  drawProjectiles() {
    this.game.projectiles.forEach(p => {
      this.ctx.save()
      this.ctx.translate(Math.floor(p.position.x + p.size.x / 2), Math.floor(p.position.y + p.size.y / 2))
      this.ctx.rotate(degsToRads(p.rotation))
      this.ctx.drawImage(this.imageCache[p.imageName].img, -p.size.x / 2, -p.size.y / 2)
      this.ctx.restore()
    })
  }

  drawParticles() {
    this.game.particles.forEach(p => {
      this.ctx.fillStyle = p.color
      this.ctx.fillRect(p.position.x, p.position.y, p.size, p.size)
    })
  }

  getMousePos(evt) {
    const offset = new Point(
      'offsetX' in evt ? evt.offsetX : evt.originalEvent.layerX,
      'offsetY' in evt ? evt.offsetY : evt.originalEvent.layerY
    )

    return {
      offset,
      tile: new Point(
        Math.floor(offset.x / this.gridSize),
        Math.floor(offset.y / this.gridSize)
      )
    }
  }

  boardClicked(evt) {
    if (this.game.winner || !this.game.started) return

    const clickPos = this.getMousePos(evt)

    this.game.player.addModule(new (this.getModuleType(this.currentModule))(clickPos.tile))
  }

  moduleShopClicked(evt) {
    if (this.game.winner || !this.game.started) return

    this.changeModule(evt.target.getAttribute('data-module'))
  }

  changeModule(mod) {
    Array.from(this.container.querySelectorAll('[data-js=moduleButton]')).forEach(b => {
      const op = b.getAttribute('data-module') === mod ? 'add' : 'remove'
      b.classList[op]('current')
    })

    const t = this.getModuleType(mod)
    const blueprint = new t()

    this.container.querySelector('[data-js=moduleName]').textContent = blueprint.displayName
    this.container.querySelector('[data-js=moduleCost]').textContent = blueprint.cost
    this.container.querySelector('[data-js=moduleHealth]').textContent = blueprint.maxHealth
    this.container.querySelector('[data-js=moduleCooldown]').textContent = `${(blueprint.cooldownTime / 1000).toFixed(2)} sec`
    this.container.querySelector('[data-js=moduleDesc]').textContent = blueprint.description

    this.currentModule = mod
  }

  getModuleType(typeName) {
    if (typeName === MODULE_NAMES.GUNNER) return Gunner
    if (typeName === MODULE_NAMES.LAUNCHER) return Launcher
    if (typeName === MODULE_NAMES.REPAIR) return Repair
    if (typeName === MODULE_NAMES.BANK) return Bank
    if (typeName === MODULE_NAMES.WALL) return Wall
  }

  toggleMusic() {
    this.elements.MUSIC_TOGGLE.classList.toggle('enabled')
    const music = this.elements.MUSIC
    if (music.paused) {
      music.play()
    }
    else {
      music.pause()
    }
  }

  toggleSound() {
    this.elements.SOUND_TOGGLE.classList.toggle('enabled')
    this.game.toggleSound()
  }

  startGame() {
    const setupScreen = this.container.querySelector('[data-js="setupScreen"]')
    setupScreen.classList.remove('active')

    const easyCheck = setupScreen.querySelector('[data-js="easyMode"]')
    const settings = {
      easy: easyCheck.checked
    }

    this.game.start(settings)
  }

  showSetupScreen() {
    const setupScreen = this.container.querySelector('[data-js="setupScreen"]')
    setupScreen.classList.add('active')
    setupScreen.querySelector('[data-js="startButton"]').addEventListener('click', ::this.startGame)
  }

  showEndScreen(playerDidWin) {
    const winScreen = this.container.querySelector('[data-js="winScreen"]')
    winScreen.classList.add('active')
    winScreen.querySelector('[data-js="result"]').textContent = playerDidWin ? 'Congratulations, you won!' : 'Sorry - you lost :('
  }
}
