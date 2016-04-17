export default class Point {
  x = 0
  y = 0

  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  clone() {
    return new Point(this.x, this.y)
  }

  add(other) {
    this.x += other.x
    this.y += other.y

    return this
  }

  multiply(num) {
    this.x *= num
    this.y *= num

    return this
  }

  normalize() {
    const factor = 1 / Math.sqrt(this.x * this.x + this.y * this.y)
    this.x = this.x * factor
    this.y = this.y * factor

    return this
  }

  equals(other) {
    return this.x === other.x && this.y === other.y
  }
}
