// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three')

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls')

const canvasSketch = require('canvas-sketch')

const settings = {
  // Make the loop animated
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
  renderer.setClearColor('hsl(100,100%,100%)', 1)

  // Setup a camera
  const camera = new THREE.OrthographicCamera()

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas)

  // Setup your scene
  const scene = new THREE.Scene()
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
  const material = new THREE.MeshPhysicalMaterial({
    color: 'hsl(300,100%,100%)',
    roughness: 0.75,
    // flatShading: true,
  })
  const mesh = new THREE.Mesh(sphereGeometry, material)
  scene.add(mesh)

  // Specify an ambient/unlit colour
  scene.add(new THREE.AmbientLight('hsl(300,90%,90%)'))

  // Add some light
  const light = new THREE.PointLight('hsl(100,100%,100%)', 1, 15.5)
  light.position.set(2, 2, -4).multiplyScalar(1.5)
  scene.add(light)

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio)
      renderer.setSize(viewportWidth, viewportHeight)
      const aspect = viewportWidth / viewportHeight

      // Ortho zoom
      const zoom = 10

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
    render({ time }) {
      // mesh.rotation.y = time * ((10 * Math.PI) / 180)
      controls.update()
      renderer.render(scene, camera)
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose()
      renderer.dispose()
    },
  }
}

canvasSketch(sketch, settings)
