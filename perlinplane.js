// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three')

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls')

const canvasSketch = require('canvas-sketch')
const { lerp, mapRange } = require('canvas-sketch-util/math')
const random = require('canvas-sketch-util/random')

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
  // Turn on MSAA
  attributes: { antialias: true },
}

const sketch = ({ context, width, height }) => {
  const scale = 20
  const gridWidth = 1200
  const gridHeight = 1200
  const gridSize = gridWidth / scale
  let flyingY = 0
  let flyingX = 0

  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context,
  })

  // WebGL background color
  renderer.setClearColor('hsl(0,0%,0%)', 1)

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 10000)
  camera.position.set(100, 100, 100)
  // camera.lookAt(new THREE.Vector3())
  camera.lookAt(new THREE.Vector3(0, 50, -1000))
  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas)

  // Setup your scene
  const scene = new THREE.Scene()

  // Specify an ambient/unlit colour
  scene.add(new THREE.AmbientLight('#FFFFFF'))

  // Add some light
  const light = new THREE.PointLight('#FFFFFf', 1, 15.5)
  light.position.set(2, 2, -4).multiplyScalar(1.5)
  scene.add(light)

  // CREATE PLANE
  const planeGeometry = new THREE.PlaneGeometry(
    gridWidth,
    gridHeight,
    gridSize,
    gridSize,
  )
  const material = new THREE.MeshLambertMaterial({
    color: 'black',
    // wireframe: true,
  })
  const plane = new THREE.Mesh(planeGeometry, material)

  plane.geometry.dynamic = true
  scene.add(plane)

  // add wireframe
  let wireframe = new THREE.WireframeGeometry(planeGeometry)
  let line = new THREE.LineSegments(wireframe)
  line.material.color.setHex(0xffffff)
  scene.add(line)

  scene.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI / 2 + 0.2)

  // DEBUG
  camera.position.set(0, 200, 700)
  controls.target = new THREE.Vector3(0, 0, 0)
  var axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

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
      controls.update()
      renderer.render(scene, camera)

      flyingY -= 0.05
      let yoff = flyingY
      for (let y = 0; y <= gridSize; y++) {
        let xoff = flyingX
        for (let x = 0; x <= gridSize; x++) {
          const point = plane.geometry.vertices[x + y * gridSize]
          // console.log(point)
          const n = random.noise2D(xoff, yoff)
          point.z = mapRange(n, 0, 1, -20, 20)
          // point.z = n
          xoff += 0.1
        }

        yoff += 0.1
      }
      console.log(plane.geometry.vertices.length)

      plane.geometry.verticesNeedUpdate = true
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose()
      renderer.dispose()
    },
  }
}

canvasSketch(sketch, settings)
