// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three')

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls')

const canvasSketch = require('canvas-sketch')
const { mapRange } = require('canvas-sketch-util/math')
const random = require('canvas-sketch-util/random')

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
  // Turn on MSAA
  attributes: { antialias: true },
}

const sketch = ({ width, height, context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context,
  })
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  // WebGL background color
  // renderer.setClearColor('hsl(100,100%,100%)', 1)
  renderer.setClearColor(0x000000, 1)

  // Setup a camera
  // const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100)
  // camera.position.set(2, 100, -4)
  // camera.lookAt(new THREE.Vector3())
  const camera = new THREE.OrthographicCamera()

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas)
  const cameraAmpl = { x: 4, y: 0 }
  const cameraVelocity = 0.05
  const lookAt = new THREE.Vector3(0, 10, 0)

  const mousePosition = { x: 0, y: 0 }
  const normalizedOrientation = new THREE.Vector3(4, 2, 100)

  const handleMouseMove = event => {
    mousePosition.x =
      event.clientX ||
      (event.touches && event.touches[0].clientX) ||
      mousePosition.x
    mousePosition.y =
      event.clientY ||
      (event.touches && event.touches[0].clientY) ||
      mousePosition.y

    let x = -(mousePosition.x / width - 0.5) * cameraAmpl.x
    x = mapRange(x, -2, 2, 2, 3)

    // x = mapRange(x,)
    normalizedOrientation.set(
      x,
      (mousePosition.y / height - 0.5) * cameraAmpl.y,
      0.5,
    )
  }

  // const handleOrientationMove = event => {
  //   // https://stackoverflow.com/questions/40716461/how-to-get-the-angle-between-the-horizon-line-and-the-device-in-javascript
  //   const rad = Math.atan2(event.gamma, event.beta)
  //   if (Math.abs(rad) > 1.5) return
  //   this.normalizedOrientation.x = -rad * this.cameraAmpl.y
  //   // TODO handle orientation.y
  // }

  // if (app.isMobile) {
  //   window.addEventListener('deviceorientation', handleOrientationMove)
  // } else {
  // window.addEventListener('mousemove', handleMouseMove)
  // }

  // Setup your scene
  const scene = new THREE.Scene()
  // scene.add(new THREE.CameraHelper(camera))

  const boxWidth = 1
  const boxGeom = new THREE.BoxGeometry(boxWidth, boxWidth, boxWidth)
  const boxMat = new THREE.MeshPhongMaterial({
    color: '#F6F4F5',
    // roughness: 0.95,
    // flatShading: true,
  })
  const scaleUp = (mesh, height, scale) => {
    mesh.scale.set(1, scale, 1)
    mesh.position.y = (height * scale) / 2
  }

  let heights = []
  let boxes = []
  for (let i = 1; i < 9; i++) {
    const mesh = new THREE.Mesh(boxGeom, boxMat)
    const scale = i
    mesh.scale.set(1, i, 3)
    mesh.position.set(1 * i, 0, -5)

    heights[i] = i
    mesh.castShadow = true
    mesh.receiveShadow = true
    scene.add(mesh)
    boxes.push(mesh)
  }

  // Specify an ambient/unlit colour
  scene.add(new THREE.AmbientLight('#D2D5DE', 1))

  // Add some light

  // const pointLight = new THREE.PointLight(0xffffff, 0.9, 18)
  // pointLight.position.set(5, 10, 5)
  // pointLight.castShadow = true
  // pointLight.shadow.camera.near = 0.1
  // pointLight.shadow.camera.far = 25
  // scene.add(pointLight)
  // const pointLightHelper = new THREE.PointLightHelper(pointLight, 1, 'purple')
  // scene.add(pointLightHelper)

  // const spotLight = new THREE.SpotLight(0xffffff, 0.9, 18)
  // spotLight.position.set(5, 10, 5)
  // spotLight.castShadow = true
  // spotLight.shadow.camera.near = 0.1
  // spotLight.shadow.camera.far = 25
  // scene.add(spotLight)
  // const spotLightHelper = new THREE.PointLightHelper(spotLight, 1, 'purple')
  // scene.add(spotLightHelper)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(-30, 10, 40)
  directionalLight.castShadow = true
  // directionalLight.shadow.camera.near = 3
  // directionalLight.shadow.camera.far = camera.far
  scene.add(directionalLight)
  const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    1,
    'green',
  )
  scene.add(directionalLightHelper)

  var axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  //////////////////////////////////////////////////////////////////////////////////
  //		Ground
  //////////////////////////////////////////////////////////////////////////////////

  var geometry = new THREE.BoxGeometry(100, 0.2, 100)
  var material = new THREE.MeshPhongMaterial({
    // ambient: 0x444444,
    color: 0xffffff,

    // specular: 0x888888,
    flatShading: THREE.FlatShading,
  })
  var ground = new THREE.Mesh(geometry, material)
  ground.scale.multiplyScalar(3)
  ground.position.y = -0.5 / 2
  scene.add(ground)

  ground.castShadow = false
  ground.receiveShadow = true

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio)
      renderer.setSize(viewportWidth, viewportHeight)
      // camera.aspect = viewportWidth / viewportHeight

      const aspect = viewportWidth / viewportHeight

      // Ortho zoom
      const zoom = 15

      // Bounds
      camera.left = -zoom * aspect
      camera.right = zoom * aspect
      camera.top = zoom
      camera.bottom = -zoom

      // Near/Far
      camera.near = -100
      camera.far = 1000

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom)
      camera.lookAt(new THREE.Vector3(0, 0, 0))

      camera.updateProjectionMatrix()
    },
    // Update & render your scene here
    render({ time }) {
      // camera.position.x +=
      // (normalizedOrientation.x - camera.position.x) * cameraVelocity

      // camera.position.y +=
      //   (normalizedOrientation.y - camera.position.y) * cameraVelocity
      // camera.lookAt(lookAt)
      // boxes.forEach((b, idx) => {
      //   if (b.position.y < heights[idx]) {
      //     scaleUp(b, boxWidth, (b.position.y += time * 2))
      //   }
      // })

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
