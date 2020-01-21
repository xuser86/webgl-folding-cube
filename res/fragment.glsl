precision mediump float;

varying vec2 fragTexCoord;
varying float textureNumber;

uniform sampler2D textures[9];

void main() {
  if (textureNumber <= 0.0) {
    gl_FragColor = texture2D(textures[0], fragTexCoord);
  } else if (textureNumber <= 1.1) {
    gl_FragColor = texture2D(textures[1], fragTexCoord);
  } else if (textureNumber <= 2.1){
    gl_FragColor = texture2D(textures[2], fragTexCoord);
  } else if (textureNumber <= 3.1){
    gl_FragColor = texture2D(textures[3], fragTexCoord);
  } else if (textureNumber <= 4.1){
    gl_FragColor = texture2D(textures[4], fragTexCoord);
  } else if (textureNumber <= 5.1){
    gl_FragColor = texture2D(textures[5], fragTexCoord);
  } else if (textureNumber <= 6.1){
    gl_FragColor = texture2D(textures[6], fragTexCoord);
  } else if (textureNumber <= 7.1){
    gl_FragColor = texture2D(textures[7], fragTexCoord);
  } else {
    gl_FragColor = texture2D(textures[8], fragTexCoord);
  }
}