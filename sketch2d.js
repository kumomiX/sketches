const canvasSketch = require('canvas-sketch')
const { lerp } = require('canvas-sketch-util/math')
const random = require('canvas-sketch-util/random')
const palettes = require('nice-color-palettes')

const settings = {
  dimensions: [2048, 2048],
}

const sketch = ({ width, height }) => {
  const palette = random.pick(palettes)
  const margin = width * 0.1

  const getPointCoords = ({ pos: [u, v] }) => [
    lerp(margin, width - margin, u),
    lerp(margin, height - margin, v),
  ]

  const gridSize = 10
  const createGrid = () => {
    let points = []

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const u = x / (gridSize - 1)
        const v = y / (gridSize - 1)

        const pos = getPointCoords({ pos: [u, v] })

        points.push({
          pos,
        })
      }
    }
    return points
  }

  const points = createGrid()

  return ({ context }) => {
    context.fillStyle = 'hsl(300,90%,90%)'
    context.fillRect(0, 0, width, height)

    // context.rotateX()
    points.forEach((point, idx) => {
      const pointToTheRight = points[idx + 1]
      const pointBelow = points[idx + gridSize]
      const isLastInRow = idx % gridSize === gridSize - 1

      context.beginPath()
      context.strokeStyle = 'black'
      context.moveTo(point.pos[0], point.pos[1])

      if (pointBelow) {
        context.lineTo(pointBelow.pos[0], pointBelow.pos[1])
      }
      if (!isLastInRow && pointToTheRight)
        context.lineTo(pointToTheRight.pos[0], pointToTheRight.pos[1])
      context.lineTo(point.pos[0], point.pos[1])

      context.stroke()
    })
  }
}

canvasSketch(sketch, settings)
