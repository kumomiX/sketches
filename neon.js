const canvasSketch = require('canvas-sketch')
const createShader = require('canvas-sketch-util/shader')
const glsl = require('glslify')
const fragExample = require('./neonex.frag')

// Setup our sketch
const settings = {
  context: 'webgl',
  animate: true,
}

// Your glsl code
const frag = glsl(`
  precision highp float;

  uniform float time;
  varying vec2 vUv;

  void main () {
    vec3 color = 0.5 + 0.5 * cos(time + vUv.xyx + vec3(0.0, 2.0, 4.0));
    gl_FragColor = vec4(color, 1.0);
  }
`)

// Your sketch, which simply returns the shader
const sketch = ({ gl, width, height }) => {
  // Create the shader and return it
  return createShader({
    // Pass along WebGL context
    gl,
    // Specify fragment and/or vertex shader strings
    frag: fragExample,
    // Specify additional uniforms to pass down to the shaders
    uniforms: {
      // Expose props from canvas-sketch
      time: ({ time }) => time,
      width,
      height,
    },
  })
}

canvasSketch(sketch, settings)
