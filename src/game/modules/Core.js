import TWEEN from 'tween.js'
import {sample} from 'lodash'

import Module from '../Module'
import Point from '../../Point'
import {range} from '../../random'

export default class Core extends Module {
  idle = true
  pupilPosition = null
  pupilColor = null

  constructor(pos) {
    super(pos, 1000)

    this.cost = 0
    this.displayName = 'Core'
    this.description = 'Your core. It is important.'

    this.pupilPosition = new Point()
    this.pupilColor = sample(['#35f', '#482C07', '#276D23'])
  }

  tick() {
    super.tick()

    if (this.idle) {
      this.creep()
    }
  }

  creep() {
    this.idle = false

    this.tween = new TWEEN.Tween(this.pupilPosition)
      .to({x: range(-3, 3), y: range(-3, 3)}, range(500, 2000))
      .easing(TWEEN.Easing.Cubic.InOut)
      .start()
      .onComplete(::this.pause)
  }

  pause() {
    setTimeout(() => { this.idle = true }, range(0, 3000))
  }
}
