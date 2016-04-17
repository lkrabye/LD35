import domready from 'domready'
import Game from './game/Game'
import Gui from './gui/Gui'
import Point from './Point'
import './sass/index.scss'
import './sfx/missile.mp3'
import './sfx/explosion.mp3'

domready(() => {
  const gridSize = 48
  const grid = new Point(9, 13)
  const game = new Game({
    gridSize,
    grid
  })
  const gui = new Gui(document.querySelector('[data-js=game]'), game, {
  }, () => {
    game.start(gui)
  })
})
