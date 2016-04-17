import Point from './Point'
export const DIR_UP = Symbol()
export const DIR_RIGHT = Symbol()
export const DIR_DOWN = Symbol()
export const DIR_LEFT = Symbol()

export function dirToPoint(dir) {
  if (dir === DIR_UP) return new Point(0, -1)
  if (dir === DIR_RIGHT) return new Point(1, 0)
  if (dir === DIR_DOWN) return new Point(0, 1)
  if (dir === DIR_LEFT) return new Point(-1, 0)
}
