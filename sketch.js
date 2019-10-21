const canvasSketch = require('canvas-sketch')
const { lerp } = require('canvas-sketch-util/math')
const random = require('canvas-sketch-util/random')

const settings = {
  dimensions: [2048, 2048],
}

const gridSize = 10
const getGrid = () => {
  let points = []
  for (let x = 0; x < gridSize - 1; x++) {
    for (let y = 0; y < gridSize - 1; y++) {
      const u = x / gridSize
      const v = y / gridSize

      points.push([u, v])
    }
  }
  return points
}

const grid = getGrid()

const snowflakeSubdivisions = 2

const drawBranch = (context, level, size, angle) => {
  if (level > 3) return
  context.beginPath()
  context.moveTo(0, 0)
  context.lineTo(size, 0)
  context.closePath()
  context.stroke()

  for (let i = 0; i < snowflakeSubdivisions; i++) {
    context.save()
    context.translate(size * (i / snowflakeSubdivisions), 0)
    context.scale(0.5, 0.5)

    context.save()
    context.rotate(angle)
    drawBranch(context, level + 1, size)
    context.restore()

    context.restore()
  }
}

const snowFlake = (context, x, y, size, angle, sym) => {
  context.save()
  context.translate(x, y)
  context.lineWidth = 3
  for (let i = 0; i < sym; i++) {
    drawBranch(context, 0, size, angle)
    context.rotate((2 * Math.PI) / sym)
  }
  context.restore()
}

const sketch = () => {
  return ({ context, width, height }) => {
    const margin = width * 0.1
    const snowFlakeSize = (width - margin * 2) / gridSize / 2

    context.fillStyle = '#111'
    context.strokeStyle = 'white'
    context.fillRect(0, 0, width, height)
    grid.forEach(([u, v]) => {
      const x = lerp(margin, width - margin, u)
      const y = lerp(margin, height - margin, v)

      // context.translate(x,y)

      const angle = random.noise1D(x) * Math.PI
      const sym = Math.abs(random.noise1D(y, 1, 4)) + 2
      console.log(sym)
      snowFlake(context, x, y, snowFlakeSize, angle, sym)

      // context.fillStyle = 'pink'
      // context.beginPath()
      // context.arc(x, y, 50, 0, Math.PI * 2)
      // context.closePath()
      // context.fill()
    })
  }
}

canvasSketch(sketch, settings)
