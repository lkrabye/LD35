import Projectile from './Projectile'
import Point from '../../Point'

export default class Bullet extends Projectile {
  constructor() {
    super(175, new Point(7, 10), 'bullet')

    this.damage = 30
  }
}
