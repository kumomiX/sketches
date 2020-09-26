const p5 = require('p5')
const Node = require('./Node')

class DifferentialLine {
  constructor(mF, mS, dS, sCr, eL, context) {
    this.nodes = []
    this.maxSpeed = mF
    this.maxForce = mS
    this.desiredSeparation = dS
    this.sq_desiredSeparation = this.desiredSeparation ** 2
    this.separationCohesionRation = sCr
    this.maxEdgeLen = eL
    this.context = context
  }

  addNode = n => {
    this.nodes.push(n)
  }

  addNodeAt = (n, index) => {
    this.nodes.splice(index, 0, n)
  }

  run = () => {
    this.differentiate()
    this.growth()
  }

  growth = () => {
    for (let i = 0; i < this.nodes.length - 1; i++) {
      const n1 = this.nodes[i]
      const n2 = this.nodes[i + 1]
      const d = p5.Vector.dist(n1.position, n2.position)
      if (d > this.maxEdgeLen) {
        // Can add more rules for inserting nodes
        const index = i + 1
        const middleNode = p5.Vector.add(n1.position, n2.position).div(2)
        this.addNodeAt(
          new Node(
            middleNode.x,
            middleNode.y,
            this.this.maxForce,
            this.maxSpeed,
          ),
          index,
        )
      }
    }
  }

  differentiate = () => {
    const separationForces = this.getSeparationForces()
    const cohesionForces = this.getEdgeCohesionForces()
    for (let i = 0; i < this.nodes.length; i++) {
      const separation = separationForces[i]
      const cohesion = cohesionForces[i]
      separation.mult(this.separationCohesionRation)
      this.nodes[i].applyForce(separation)
      this.nodes[i].applyForce(cohesion)
      this.nodes[i].update()
    }
  }
  getSeparationForces = () => {
    const n = this.nodes.length
    const separateForces = Array(n).fill(new p5.Vector())
    const nearNodes = Array(n).fill(0)
    let nodei
    let nodej

    for (let i = 0; i < n; i++) {
      nodei = this.nodes[i]
      for (let j = i + 1; j < n; j++) {
        nodej = this.nodes[j]
        const forceij = this.getSeparationForce(nodei, nodej)
        if (forceij.mag() > 0) {
          separateForces[i].add(forceij)
          separateForces[j].sub(forceij)
          nearNodes[i]++
          nearNodes[j]++
        }
      }
      if (nearNodes[i] > 0) {
        separateForces[i].div(nearNodes[i])
      }
      if (separateForces[i].mag() > 0) {
        separateForces[i].setMag(this.maxSpeed)
        separateForces[i].sub(nodes[i].velocity)
        separateForces[i].limit(this.maxForce)
      }
    }
    return separateForces
  }
  getSeparationForce = (n1, n2) => {
    const steer = new p5.Vector(0, 0)
    const sq_d =
      (n2.position.x - n1.position.x) ** 2 +
      (n2.position.y - n1.position.y) ** 2
    if (sq_d > 0 && sq_d < this.sq_desiredSeparation) {
      const diff = p5.Vector.sub(n1.position, n2.position)
      diff.normalize()
      diff.div(Math.sqrt(sq_d)) //Weight by distacne
      steer.add(diff)
    }
    return steer
  }
  getEdgeCohesionForces = () => {
    const n = this.nodes.length
    const cohesionForces = Array(n).fill(new p5.Vector())
    for (let i = 0; i < n; i++) {
      const sum = new p5.Vector(0, 0)
      if (i != 0 && i != n - 1) {
        sum.add(this.nodes[i - 1].position).add(this.nodes[i + 1].position)
      } else if (i == 0) {
        sum.add(this.nodes[n - 1].position).add(this.nodes[i + 1].position)
      } else if (i == n - 1) {
        sum.add(this.nodes[i - 1].position).add(this.nodes[0].position)
      }
      sum.div(2)
      cohesionForces[i] = this.nodes[i].seek(sum)
    }
    return cohesionForces
  }
  // renderShape() {
  //   beginShape()
  //   for (let i = 0; i < this.nodes.length; i++) {
  //     vertex(this.nodes[i].position.x, this.nodes[i].position.y)
  //   }
  //   endShape(CLOSE)
  // }
  renderLine(p5) {
    
  }
}

module.exports = DifferentialLine
