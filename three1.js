// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three')

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls')

const canvasSketch = require('canvas-sketch')
const random = require('canvas-sketch-util/random')
const palettes = require('nice-color-palettes')
const eases = require('eases')

const settings = {
  dimensions: [512, 512],

  // Make the loop animated
  fps: 60,
  duration: 4,
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
  // Turn on MSAA
  attributes: { antialias: true },
}

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context,
  })

  // WebGL background color
  renderer.setClearColor('hsl(0,0%,90%)', 1)

  // Setup a camera
  const camera = new THREE.OrthographicCamera()

  // Setup camera controller
  // const controls = new THREE.OrbitControls(camera, context.canvas)

  // Setup your scene
  const scene = new THREE.Scene()

  const box = new THREE.BoxGeometry(1, 1, 1)
  const palette = random.pick(palettes)

  for (let i = 0; i < 50; i++) {
    const mesh = new THREE.Mesh(
      box,
      new THREE.MeshStandardMaterial({
        color: random.pick(palette),
      }),
    )
    mesh.position.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1),
    )
    mesh.scale.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1),
    )
    mesh.scale.multiplyScalar(0.5)
    scene.add(mesh)
  }

  // Specify an ambient/unlit colour
  scene.add(new THREE.AmbientLight('hsl(0,0%,10%)'))

  // Add some light
  const light = new THREE.PointLight('white', 1)
  light.position.set(0, 0, 4)
  scene.add(light)

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio)
      renderer.setSize(viewportWidth, viewportHeight)
      const aspect = viewportWidth / viewportHeight

      // Ortho zoom
      const zoom = 2

      // Bounds
      camera.left = -zoom * aspect
      camera.right = zoom * aspect
      camera.top = zoom
      camera.bottom = -zoom

      // Near/Far
      camera.near = -100
      camera.far = 100

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom)
      camera.lookAt(new THREE.Vector3())

      camera.updateProjectionMatrix()
    },
    // Update & render your scene here
    render({ playhead }) {
      // controls.update()
      const t = Math.sin(playhead * Math.PI)
      scene.rotation.z = eases.expoInOut(t)
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
