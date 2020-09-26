const p5 = require('p5')

class Node {
  constructor(x, y, mF, mS) {
    this.acceleration = new p5.Vector(0, 0)
    this.velocity = p5.Vector.random2D()
    this.position = new p5.Vector(x, y)
    this.maxSpeed = mF
    this.maxForce = mS
  }

  applyForce = force => {
    this.acceleration.add(force)
  }

  update = () => {
    this.velocity.add(this.acceleration)
    this.velocity.limit(this.maxSpeed)
    this.position.add(this.velocity)
    this.acceleration.mult(0)
  }

  seek = target => {
    const desired = p5.Vector.sub(target, this.position)
    desired.setMag(this.maxSpeed)
    const steer = p5.Vector.sub(desired, this.velocity)
    steer.limit(this.maxForce)
    return steer
  }
}

module.exports = Node
