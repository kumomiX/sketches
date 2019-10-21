precision highp float;

uniform float time;
uniform float aspect;
varying vec2 vUv;

#pragma glslify: noise = require('glsl-noise/simplex/3d')
#pragma glslify: hsl2rgb = require('glsl-hsl2rgb')

void main () {
  // vec3 colorA = vec3(sin(time + 0.5), 0.0, 0.8);
  // vec3 colorB = vec3(1.0, 0.5, 0.0);

  vec2 center = vUv - 0.5;
  center.x *= aspect;

  float dist = length(center);
  float alpha = smoothstep(0.35, 0.05, dist);

  float n = noise(vec3(center * 0.25, time * 0.25));

  vec3 color = hsl2rgb(
    0.8 + 0.2 * n,
    0.5,
    0.5
  );

  gl_FragColor = vec4(color, alpha);
}