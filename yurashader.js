// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three')

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls')
require('three/examples/js/postprocessing/EffectComposer.js')
require('three/examples/js/postprocessing/ShaderPass.js')
require('three/examples/js/postprocessing/GlitchPass.js')
require('three/examples/js/shaders/DigitalGlitch.js')
require('three/examples/js/postprocessing/RenderPass.js')
require('three/examples/js/postprocessing/BloomPass')
require('three/examples/js/shaders/CopyShader.js')
require('three/examples/js/shaders/DotScreenShader.js')
require('three/examples/js/shaders/ConvolutionShader.js')
// require('three/examples/js/shaders/LuminosityHighPassShader.js')
require('three/examples/js/shaders/LuminosityHighPassShader')
require('three/examples/js/postprocessing/UnrealBloomPass')

const canvasSketch = require('canvas-sketch')
const frag = require('./shaders/yura.frag')
const vert = require('./shaders/yura.vert')
// const {
//   EffectComposer,
// } = require('three/examples/jsm/postprocessing/EffectComposer.js')
// const {
//   RenderPass,
// } = require('three/examples/jsm/postprocessing/RenderPass.js')
// const {
//   GlitchPass,
// } = require('three/examples/jsm/postprocessing/GlitchPass.js')

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
  renderer.setClearColor('#000', 1)

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100)
  camera.position.set(0, 0, 4)
  camera.lookAt(new THREE.Vector3())

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas)

  // Setup your scene
  const scene = new THREE.Scene()

  const geometry = new THREE.BoxBufferGeometry(0.75, 0.75, 0.75)
  const material = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms: {
      time: { value: 0.0 },
      resolution: { value: new THREE.Vector2() },
    },
  })
  material.transparent = true
  // const material = new THREE.MeshLambertMaterial({ color: '#FFFFFF' })
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  // Specify an ambient/unlit colour
  scene.add(new THREE.AmbientLight('#59314f'))

  // Add some light
  const light = new THREE.PointLight('#45caf7', 1, 15.5)
  light.position.set(2, 2, -4).multiplyScalar(1.5)
  scene.add(light)

  // debug
  controls.target = new THREE.Vector3(0, 0, 0)
  var axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  // post

  const composer = new THREE.EffectComposer(renderer)
  composer.addPass(new THREE.RenderPass(scene, camera))

  // const effect1 = new THREE.ShaderPass(THREE.DotScreenShader)
  // console.log(effect1)
  // effect1.uniforms.amount.value = 0
  // composer.addPass(effect1)

  // const unrealBloom = new THREE.UnrealBloomPass(
  //   new THREE.Vector2(window.innerWidth, window.innerHeight),
  //   1.5,
  //   0.4,
  //   0.85,
  // )
  // renderer.toneMappingExposure = Math.pow(1.7, 0.8)
  // unrealBloom.threshold = 0
  // unrealBloom.strength = 2.0
  // unrealBloom.radius = 0.5
  // unrealBloom.renderToScreen = true
  // composer.addPass(unrealBloom)

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio = 0, viewportWidth, viewportHeight }) {
      // renderer.setPixelRatio(pixelRatio)
      // let pixelRatio = window.devicePixelRatio || 0
      renderer.setSize(viewportWidth, viewportHeight)
      composer.setSize(viewportWidth * pixelRatio, viewportHeight * pixelRatio)

      renderer.setSize(viewportWidth, viewportHeight)
      camera.aspect = viewportWidth / viewportHeight
      camera.updateProjectionMatrix()
    },
    // Update & render your scene here
    render({ time }) {
      // mesh.rotation.y = time * ((10 * Math.PI) / 180)

      controls.update()
      composer.render()
      mesh.material.uniforms.time.value = time
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose()
      composer.dispose()
    },
  }
}

canvasSketch(sketch, settings)
