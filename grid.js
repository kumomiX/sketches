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
    const gridSize = 30

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const u = x / (gridSize - 1)
        const v = y / (gridSize - 1)
        const color = palette[random.rangeFloor(0, 5)]
        const radius = Math.abs(random.noise2D(u, v)) * 0.01
        const angle = mapRange(random.noise2D(u, v), 0, Math.PI * 2)

        points.push({
          position: {
            u,
            v,
          },
          radius,
          color,
          angle,
        })
      }
    }
    return points
  }

  const grid = createGrid().filter(() => random.value() > 0.5)
  const margin = 400

  return ({ context, width, height }) => {
    context.fillStyle = 'white'
    context.fillRect(0, 0, width, height)

    grid.forEach(({ position: { u, v }, radius, color, angle }) => {
      const x = lerp(margin, width - margin, u)
      const y = lerp(margin, height - margin, v)

      context.beginPath()
      context.arc(x, y, radius * width, 0, 2 * Math.PI)
      context.fillStyle = color
      context.fill()

      // context.save()
      // context.translate(x, y)
      // context.rotate(angle)
      // context.fillStyle = color
      // context.font = `${radius * width}px "Helvetica"`
      // context.fillText('👌', 0, 0)
      // context.restore()
    })
  }
}

canvasSketch(sketch, settings)
