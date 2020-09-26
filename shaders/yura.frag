precision highp float;

uniform float time;
varying vec2 vUv;

//Knowing the distance from a fragment to the source of the glow, 
    //the above can be written compactly as the function: 
    //
    	float getGlow(float dist, float radius, float intensity){
    		return pow(radius/dist, intensity);
		}
    //
    //The returned value can then be multiplied with a colour to get the final result
	

void main () {
  // float g = sin(time) * 0.5 + 0.5;

   vec2 centre = vec2(0.5, 0.5);
   vec2 pos = centre - vUv;
   float dist = 1.0/length(pos);
   dist *= 0.1;
   // Get colour
    vec3 col = dist * vec3(1.0, 0.5, 0.25);
       // See comment by P_Malin
    col = 1.0 - exp( -col );

    // Raising the result to a power allows us to change the glow fade behaviour
    // See https://www.desmos.com/calculator/eecd6kmwy9 for an illustration
    // (Move the slider of m to see different fade rates)

    // float glow = getGlow(dist,dist * 0.1,0.8);
    // // Get colour
    // vec3 col = glow * vec3(1.0, 0.5, 0.25);
    
    // See comment by P_Malin
    // col = 1.0 - exp( -col );

    
    // Output to screen
    gl_FragColor = vec4(col, 1.0);

}