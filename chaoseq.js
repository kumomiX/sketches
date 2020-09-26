const canvasSketch = require('canvas-sketch')
const random = require('canvas-sketch-util/random')
const palettes = require('nice-color-palettes')
const { lerp, mapRange } = require('canvas-sketch-util/math')
const palette = random.pick(palettes)

const settings = {
  animate: true,
  dimensions: [1048, 1048],
}

const sketch = ({ context, width, height }) => {
  // function toScreen(x, y) {
  //   const s = plot_scale * (height / 2)
  //   const nx = width * 0.5 + (x - plot_x) * s
  //   const ny = height * 0.5 + (y - plot_y) * s

  //   return { x: nx, y: ny }
  // }

  const s = height / 100 //(1 * height) / 2
  const plotX = 0
  const plotY = 0
  const toScreen = ([x, y]) => {
    return [width * 0.5 + (x - plotX) * s, height * 0.5 + (y - plotY) * s]
  }

  const FLT_MAX = 1e37

  function generateRandomParams() {
    const paramsDimensions = ['x', 'y']
    const paramsOrder = ['xx', 'yy', 'tt', 'xy', 'xt', 'yt', 'x', 'y', 't']
    const result = {}
    paramsDimensions.forEach(eaDim => {
      result[eaDim] = {}
      paramsOrder.forEach(eaParam => {
        result[eaDim][eaParam] = Math.floor(Math.random() * 3) - 1
      })
    })
    return result
  }
  const params = generateRandomParams()
  /*  {
    x: {
      xx: 1,
      yy: 1,
      tt: 1,
      xy: 1,
      xt: -1,
      yt: 1,
      x: 1,
      y: 0,
      t: 1,
    },
    y: {
      xx: 2,
      yy: 2,
      tt: 2,
      xy: 2,
      xt: 2,
      yt: 2,
      x: -2,
      y: 1,
      t: 0,
    },
  }*/
  const f = (q, t) => {
    let [x, y] = q

    const xx = Math.min(Math.max(x * x, -FLT_MAX), FLT_MAX)
    const yy = Math.min(Math.max(y * y, -FLT_MAX), FLT_MAX)
    const tt = Math.min(Math.max(t * t, -FLT_MAX), FLT_MAX)
    const xy = Math.min(Math.max(x * y, -FLT_MAX), FLT_MAX)
    const xt = Math.min(Math.max(x * t, -FLT_MAX), FLT_MAX)
    const yt = Math.min(Math.max(y * t, -FLT_MAX), FLT_MAX)
    const xp = Math.min(Math.max(x, -FLT_MAX), FLT_MAX)
    const yp = Math.min(Math.max(y, -FLT_MAX), FLT_MAX)
    const tp = Math.min(Math.max(t, -FLT_MAX), FLT_MAX)

    const nx =
      xx * params.x.xx +
      yy * params.x.yy +
      tt * params.x.tt +
      xy * params.x.xy +
      xt * params.x.xt +
      yt * params.x.yt +
      xp * params.x.x +
      yp * params.x.y +
      tp * params.x.t
    const ny =
      xx * params.y.xx +
      yy * params.y.yy +
      tt * params.y.tt +
      xy * params.y.xy +
      xt * params.y.xt +
      yt * params.y.yt +
      xp * params.y.x +
      yp * params.y.y +
      tp * params.y.t

    return [nx, ny]
  }

  // const f = (q, t) => {
  //   let [x, y] = q

  //   // CODEPA
  //   // return [
  //   //   -(x ** 2) - t ** 2 + x * t - y * t - x,
  //   //   -(x ** 2) + t ** 2 + x * t - x - y,
  //   // ]

  //   // //Y_SMYR
  //   // return [
  //   //   x ** 2 + y ** 2 - x * y - x * t - y * t + x - y,
  //   //   x * y + x * t + x - y - t,
  //   // ]
  // }

  const scale = 5
  const solve = (t, n) => {
    let q = [t, t]
    let Q = []
    for (let i = 0; i < n; i++) {
      q = f(q, t)
      let screenx = lerp(20, width - 20, q[0]) / scale
      let screeny = lerp(20, width - 20, q[1]) / scale
      Q[i] = [screenx, screeny]
    }
    return Q
  }

  let n = 800
  let maxT = 3
  let minT = -3
  let t = -0.45 //np.arange(-0.3, 0.0, 1e-3)
  //np.zeros((len(T), n, 2))
  let steps = 10
  let timeFactor = 0.007

  // fig = pyplot.figure()
  // ax = fig.add_subplot(1, 1, 1)
  // colors = np.random.sample((n, 3))

  const history = Array(steps * n).fill([0, 0])

  context.fillStyle = 'rgba(0,0,0,1)'
  context.fillRect(0, 0, width, height)

  return () => {
    context.fillStyle = 'rgba(0,0,0,0.1)'
    context.fillRect(0, 0, width, height)

    context.translate(width / 2, height / 2)

    for (let step = 0; step < steps; step++) {
      const H = solve(t, n)
      let c = random.pick(palette)
      H.forEach(([x, y], idx) => {
        const iter = step * idx

        context.fillStyle = c //'red'
        // context.arc(x, y, 0.5, 0, Math.PI * 2)
        // context.fill()
        context.fillRect(x, y, 1, 1)

        history[iter] = [x, y]
      })

      t += 0.01 * timeFactor
      if (t > maxT) {
        t = minT
      }
    }

    // for (let [i, t] of T.entries()) {
    //   const H[i] = solve(t, n)
    //   H.forEach(([x, y], idx) => {
    //     context.fillStyle = 'red'
    //     context.fillRect(x, y, 2, 2)
    //   })

    //   t += 0.001
    //   if (t > maxT) {
    //     t = minT
    //   }
    // }
  }
}

canvasSketch(sketch, settings)
