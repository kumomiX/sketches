const canvasSketch = require('canvas-sketch')
const { lerp, mapRange } = require('canvas-sketch-util/math')
const random = require('canvas-sketch-util/random')
const palettes = require('nice-color-palettes')

const settings = {
  dimensions: [2048, 2048],
}

const sketch = () => {
  const palette = random.pick(palettes)

  const createGrid = () => {
    const points = []
    const gridSize = 6

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const u = x / (gridSize - 1)
        const v = y / (gridSize - 1)

        points.push({
          position: {
            u,
            v,
          },
        })
      }
    }
    return points
  }

  const grid = createGrid()
  const margin = 400

  const getPointCoords = (width, height, { position: { u, v } }) => {
    const x = lerp(margin, width - margin, u)
    const y = lerp(margin, height - margin, v)

    return [x, y]
  }

  const getTrapezoidCoords = (context, width, height) => {
    const p1 = random.pick(grid)
    const p2 = random.pick(grid)

    const leftSide = grid.filter(
      ({ position: { u, v } }) => u === p1.position.u && v >= p1.position.v,
    )
    const rightSide = grid.filter(
      ({ position: { u, v } }) => u === p2.position.u && v >= p2.position.v,
    )

    if (leftSide.length < 2 || rightSide.length < 2)
      return getTrapezoidCoords(context, width, height)
    return [leftSide, rightSide]
  }

  const drawTrapezoid = (context, width, height) => {
    const [leftSide, rightSide] = getTrapezoidCoords(context, width, height)

    const [x1, y1] = getPointCoords(width, height, leftSide[0])
    const [x2, y2] = getPointCoords(width, height, rightSide[0])

    context.beginPath()
    context.lineWidth = 15
    context.fillStyle = random.pick(palette) + '88'
    context.moveTo(x1, y1)
    leftSide.forEach(point => {
      const [x, y] = getPointCoords(width, height, point)
      context.lineTo(x, y)
    })

    context.moveTo(x1, y1)
    context.lineTo(x2, y2)
    rightSide.forEach(point => {
      const [x, y] = getPointCoords(width, height, point)
      context.lineTo(x, y)
    })
    const leftLast = leftSide[leftSide.length - 1]
    const [lastX, lastY] = getPointCoords(width, height, leftLast)
    context.lineTo(lastX, lastY)

    context.fill()
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'white'
    context.fillRect(0, 0, width, height)

    grid.forEach(point => {
      // const x = lerp(margin, width - margin, u)
      // const y = lerp(margin, height - margin, v)
      const [x, y] = getPointCoords(width, height, point)

      context.beginPath()
      context.arc(x, y, 5, 0, 2 * Math.PI)
      context.fillStyle = 'grey'
      context.fill()

      // context.save()
      // context.translate(x, y)
      // context.rotate(angle)
      // context.fillStyle = color
      // context.font = `${radius * width}px "Helvetica"`
      // context.fillText('👌', 0, 0)
      // context.restore()
    })

    drawTrapezoid(context, width, height)
    drawTrapezoid(context, width, height)
  }
}

canvasSketch(sketch, settings)
