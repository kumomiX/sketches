const canvasSketch = require('canvas-sketch')
const createShader = require('canvas-sketch-util/shader')
const glsl = require('glslify')
const frag = require('./shader.frag')

// Setup our sketch
const settings = {
  context: 'webgl',
  animate: true,
  dimensions: [2048, 2048],
}

// Your glsl code
// const frag = glsl(shader)

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
  // Create the shader and return it
  return createShader({
    clearColor: 'white',
    // Pass along WebGL context
    gl,
    // Specify fragment and/or vertex shader strings
    frag,
    // Specify additional uniforms to pass down to the shaders
    uniforms: {
      // Expose props from canvas-sketch
      time: ({ time }) => time,
      aspect: ({ width, height }) => width / height,
    },
  })
}

canvasSketch(sketch, settings)
