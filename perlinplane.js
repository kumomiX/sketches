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
  fps: 30,
  dimensions: [1048, 1048],
}

const sketch = ({ context, width, height }) => {
  const scale = 3
  const gridWidth = 150
  const gridHeight = 150
  const gridSize = gridWidth / scale
  let flyingY = 0
  let flyingX = 0
  let wireframeLines
  let spheres = []

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
  // const light = new THREE.PointLight('#FFFFFf', 1, 15.5)
  // light.position.set(2, 2, -4).multiplyScalar(1.5)
  // scene.add(light)

  // CREATE PLANE
  const planeGeometry = new THREE.PlaneGeometry(
    gridWidth,
    gridHeight,
    gridSize,
    gridSize,
  )
  const material = new THREE.MeshLambertMaterial({
    color: '#000000',
    // wireframe: true,
  })
  const plane = new THREE.Mesh(planeGeometry, material)

  // plane.geometry.dynamic = true
  scene.add(plane)

  scene.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI / 2 + 0.2)

  // const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32)
  // const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
  // for (let y = 0; y <= gridSize; y++) {
  //   for (let x = 0; x <= gridSize; x++) {
  //     const idx = x + y * gridSize
  //     const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  //     sphere.position.set(0, 0, 0)
  //     scene.add(sphere)
  //     spheres[idx] = sphere
  //   }
  // }

  // let wireframe = new THREE.WireframeGeometry(planeGeometry)
  // let line = new THREE.LineSegments(wireframe)
  // line.material.color.setHex(0xffffff)
  // scene.add(line)

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

      flyingY += 0.02
      let yoff = flyingY
      for (let y = 0; y <= gridSize; y++) {
        let xoff = flyingX
        for (let x = 0; x <= gridSize; x++) {
          const idx = x + y * gridSize
          const point = plane.geometry.vertices[idx]
          // console.log(point)
          const n = random.noise2D(xoff, yoff)
          const z = mapRange(n, -1, 1, 0, 30)
          point.z = z

          // const sphere = spheres[idx]
          // sphere.position.set(point.x, point.y, point.z)
          // sphere.geometry.verticesNeedUpdate = true

          // point.z = n
          xoff += 0.1
        }

        yoff += 0.1
      }

      // add wireframe
      if (wireframeLines) scene.remove(wireframeLines)
      let wireframe = new THREE.WireframeGeometry(planeGeometry)
      wireframeLines = new THREE.LineSegments(wireframe)
      wireframeLines.drawMode = THREE.TriangleFanDrawMode
      wireframeLines.material.color.setHex(0xffffff)

      scene.add(wireframeLines)

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
