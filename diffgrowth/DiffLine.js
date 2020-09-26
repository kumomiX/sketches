const p5 = require('p5')
const Node = require('./Node')

class DiffLine {
  constructor({
    width,
    height,
    nodesStart = 10,
    edgeLen = 2,
    maxForce,
    maxSpeed,
    rejectionForce = 1.1,
    attractionForce = 2,
  }) {
    this.nodes = []
    this.width = width
    this.height = height
    this.edgeLen = edgeLen
    this.rejectionForce = rejectionForce
    this.attractionForce = attractionForce
    this.maxSpeed = maxSpeed
    this.maxEdgeLen = 5

    this.initNodes(nodesStart)
  }

  initNodes = nodesStart => {
    // init nodes
    const angInc = (Math.PI * 2) / nodesStart
    const radius = 10
    for (let a = 0; a < Math.PI * 2; a += angInc) {
      const x = this.width / 2 + Math.cos(a) * radius
      const y = this.height / 2 + Math.sin(a) * radius
      this.addNode(new Node(x, y, this.maxSpeed))
    }
  }

  addNode = node => {
    this.nodes.push(node)
  }

  addNodeAt = (node, idx) => {
    this.nodes.splice(idx, 0, node)
  }

  /**
   * Create and return a Node exactly halfway between the two provided Nodes
   * @param {object} node1 First node
   * @param {object} node2 Second node
   * @param {boolean} [fixed] Whether this new Node should be fixed or not
   * @returns {object} New Node object
   */
  getMidpointNode(node1, node2) {
    return new Node(
      (node1.position.x + node2.position.x) / 2,
      (node1.position.y + node2.position.y) / 2,
      this.maxSpeed,
    )
  }

  applyAttractionForce = (idx, nextIdx, prevIdx) => {
    const node = this.nodes[idx]
    const nextNode = this.nodes[nextIdx]
    const prevNode = this.nodes[prevIdx]

    const sum = new p5.Vector(0, 0)
    sum.add(prevNode.position).add(nextNode.position)
    sum.div(2)
    const force = node.seek(sum)
    node.applyForce(force)

    // const attr1 = nextNode.position
    //   .copy()
    //   .sub(node.position)
    //   .normalize()
    //   .mult(this.attractionForce)
    // // .setMag(this.attractionForce)
    // const edge1 = attr1.mag()
    // if (edge1 > this.edgeLen) node.applyForce(attr1)

    // // console.log(edge1)

    // const attr2 = prevNode.position
    //   .copy()
    //   .sub(node.position)
    //   .normalize()
    //   .mult(this.attractionForce)
    // // .setMag(this.attractionForce)
    // const edge2 = attr2.mag()
    // if (edge2 > this.edgeLen) node.applyForce(attr2)
  }

  applyRejectionForce = (idx, nextIdx, prevIdx) => {
    const node = this.nodes[idx]
    const nextNode = this.nodes[nextIdx]
    const prevNode = this.nodes[prevIdx]

    const repNodes = this.nodes.filter(
      (n, i) => i !== idx && i !== nextIdx && i !== prevIdx,
    )

    // for (const repNode of repNodes) {
    //   const force = repNode.position
    //     .copy()
    //     .sub(node.position)
    //     .normalize()
    //     .mult(-1)
    //     .mult(this.rejectionForce)

    //   node.applyForce(force)
    // }

    const getSeparationForce = (n1, n2) => {
      const steer = new p5.Vector(0, 0)
      const sq_d =
        (n2.position.x - n1.position.x) ** 2 +
        (n2.position.y - n1.position.y) ** 2
      if (sq_d > 0) {
        const diff = p5.Vector.sub(n1.position, n2.position)
        diff.normalize()
        diff.div(Math.sqrt(sq_d)) //Weight by distacne
        steer.add(diff)
      }
      return steer
    }

    for (const repNode of repNodes) {
      const force = getSeparationForce(node, repNode)

      if (force.mag() > 0) {
        force.setMag(this.maxSpeed)
        force.sub(node.velocity)
        force.limit(this.maxForce)
      }
      node.applyForce(force)
    }
  }

  growth = () => {
    for (const [idx, node] of this.nodes.entries()) {
      const n2 =
        idx === this.nodes.length - 1 ? this.nodes[0] : this.nodes[idx + 1]
      const d = p5.Vector.dist(node.position, n2.position)
      if (d > this.maxEdgeLen) {
        // Can add more rules for inserting nodes
        const middleNode = p5.Vector.add(node.position, n2.position).div(2)
        this.addNodeAt(
          new Node(middleNode.x, middleNode.y, this.maxSpeed),
          idx + 1,
        )
      }
    }
  }

  update = () => {
    // const attractionForce = new p5.Vector(1, 1)
    // const rejectionForce = new p5.Vector(1, 1)

    for (const [idx, node] of this.nodes.entries()) {
      // node.applyForce(attractionForce)
      // node.applyForce(rejectionForce)
      const nextIdx = idx === this.nodes.length - 1 ? 0 : idx + 1
      const prevIdx = idx === 0 ? this.nodes.length - 1 : idx - 1

      this.applyAttractionForce(idx, nextIdx, prevIdx)
      this.applyRejectionForce(idx, nextIdx, prevIdx)

      // console.log(this.nodes.length)
      node.update()
    }

    this.growth()
  }

  draw = context => {
    for (let i = 0; i < this.nodes.length - 1; i++) {
      const p1 = this.nodes[i].position
      const p2 = this.nodes[i + 1].position
      context.line(p1.x, p1.y, p2.x, p2.y)
      if (i == this.nodes.length - 2) {
        context.line(
          p2.x,
          p2.y,
          this.nodes[0].position.x,
          this.nodes[0].position.y,
        )
      }
    }
  }
}

module.exports = DiffLine
