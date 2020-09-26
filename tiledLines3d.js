// SOMEDAY IT WILL ALL MAKE SENSE

// ADD MORE RANDOM TO INITIAL POSITON => make puzzle sort of feel

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three')

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls')

const canvasSketch = require('canvas-sketch')
const random = require('canvas-sketch-util/random')

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
  // Turn on MSAA
  attributes: { antialias: true },
  dimensions: [1048, 1048],
  fps: 30,
}

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context,
  })

  // WebGL background color
  renderer.setClearColor('#000', 1)

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 1000)
  camera.position.set(2, 2, -4)
  camera.lookAt(new THREE.Vector3())

  // Setup camera controller
  // const controls = new THREE.OrbitControls(camera, context.canvas)

  // Setup your scene
  const scene = new THREE.Scene()

  //create a blue LineBasicMaterial
  var material = new THREE.LineBasicMaterial({ color: 0xffff00 })

  const lines = []

  function draw(x, y, width, height) {
    var geometry = new THREE.Geometry()
    const leftToRight = random.value() >= 0.5
    const z = Math.abs(random.gaussian(100, 20))

    if (leftToRight) {
      geometry.vertices.push(new THREE.Vector3(x, y, z))
      geometry.vertices.push(new THREE.Vector3(x + width, y + height, z))
    } else {
      geometry.vertices.push(new THREE.Vector3(x + width, y, z))
      geometry.vertices.push(new THREE.Vector3(x, y + height, z))
    }

    var line = new THREE.Line(geometry, material)
    lines.push(line)
  }
  const size = 100
  const step = 2
  // draw(0, 0, size, size)
  for (var x = 0; x < size; x += step) {
    for (var y = 0; y < size; y += step) {
      draw(x, y, step, step)
    }
  }

  lines.forEach(l => scene.add(l))

  // var line = new THREE.Line(geometry, material)
  // scene.add(line)

  // Specify an ambient/unlit colour
  scene.add(new THREE.AmbientLight('#59314f'))

  // Add some light
  const light = new THREE.PointLight('#45caf7', 1, 15.5)
  light.position.set(2, 2, -10).multiplyScalar(1.5)
  scene.add(light)

  // DEBUG
  camera.position.set(size / 2, size / 2, 150)
  camera.lookAt(new THREE.Vector3(size / 2, size / 2, 0))

  // controls.target = new THREE.Vector3(size / 2, size / 2, 0)
  var axesHelper = new THREE.AxesHelper(5)
  // scene.add(axesHelper)

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio)
      renderer.setSize(viewportWidth, viewportHeight)
      camera.aspect = viewportWidth / viewportHeight
      camera.updateProjectionMatrix()
    },
    // Update & render your scene here
    render({ time }) {
      // controls.update()

      lines.forEach(l => {
        l.geometry.vertices.forEach(v => {
          if (Math.abs(v.z) < 0.5) {
            v.z = 0
          } else if (v.z > 0) {
            v.z -= 0.01 + time * 0.05
            l.geometry.verticesNeedUpdate = true
          } else if (v.z < 0) {
            v.z += 0.01 + time * 0.05
            l.geometry.verticesNeedUpdate = true
          }
        })
        l.frustumCulled = false
      })

      renderer.render(scene, camera)
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      // controls.dispose()
      renderer.dispose()
    },
  }
}

canvasSketch(sketch, settings)
