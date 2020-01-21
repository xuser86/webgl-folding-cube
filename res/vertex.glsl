precision mediump float;

attribute vec3 vertPosition;
attribute vec2 vertTexCoord;
attribute float vertTextureNumber;
varying vec2 fragTexCoord;
varying float textureNumber;
uniform mat4 mWorld;
uniform mat4 mProj;

void main() {
  fragTexCoord = vertTexCoord;
  textureNumber = vertTextureNumber;
  gl_Position = mProj * mWorld * vec4(vertPosition, 1.0);
}