import Player from './Player'
import Point from '../Point'

import {
  Gunner,
  Launcher,
  Repair,
  Bank,
  Wall,
} from './modules'

export default class HumanPlayer extends Player {
  constructor(game, rootPos) {
    super(game, rootPos)

    this.color = '#369'

    // this.addModule(new Wall(rootPos.clone().add(new Point(1, 0))))
    // this.addModule(new Wall(rootPos.clone().add(new Point(2, 0))))
    // this.addModule(new Wall(rootPos.clone().add(new Point(3, 0))))
    // this.addModule(new Wall(rootPos.clone().add(new Point(4, 0))))
    // this.addModule(new Launcher(rootPos.clone().add(new Point(1, 0))))
    // this.addModule(new Wall(rootPos.clone().add(new Point(-1, 0))))
    // this.addModule(new Wall(rootPos.clone().add(new Point(-2, 0))))
    // this.addModule(new Wall(rootPos.clone().add(new Point(-3, 0))))
    // this.addModule(new Wall(rootPos.clone().add(new Point(-4, 0))))
    // this.addModule(new Launcher(rootPos.clone().add(new Point(-1, 0))))
  }
}
