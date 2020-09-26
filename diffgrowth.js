const canvasSketch = require('canvas-sketch')
const p5 = require('p5')
const DifferentialLine = require('./diffgrowth/DiffLine')
const Node = require('./diffgrowth/Node')

const preload = p5 => {
  // You can use p5.loadImage() here, etc...
}

const settings = {
  // Pass the p5 instance, and preload function if necessary
  p5: { p5, preload },
  // Turn on a render loop
  animate: true,
  dimensions: [2042, 2042],
}

const maxForce = 0.2 // Maximum steering force
const maxSpeed = 0.5 // Maximum speed
const desiredSeparation = 10
const separationCohesionRation = 1.1
const maxEdgeLen = 5

canvasSketch(({ width, height }) => {
  const DiffLine = new DifferentialLine({
    width,
    height,
    maxForce,
    maxSpeed,
  })

  // Return a renderer, which is like p5.js 'draw' function
  return ({ p5, time }) => {
    // Draw with p5.js things
    p5.background(255)
    // p5.fill(255)
    // p5.noStroke()
    p5.stroke(255, 250, 220)
    p5.stroke(0, 0, 0)

    DiffLine.update()
    DiffLine.draw(p5)
    // DiffLine.run(p5)
    // DiffLine.renderLine(p5)

    // const anim = p5.sin(time - p5.PI / 2) * 0.5 + 0.5
    // p5.rect(0, 0, width * anim, height)
  }
}, settings)
