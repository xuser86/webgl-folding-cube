function GlTool(gl) {
  this.gl = gl;

  this.cameraCoords = [0, 0, -10];
  this.fov = glMatrix.toRadian(45);

  this.resize();
}

GlTool.prototype.cameraMatrix = function(cameraCoords = this.cameraCoords, fov = this.fov) {
  const projMatrix = new Float32Array(16);
  const viewMatrix = new Float32Array(16);

  this.cameraCoords = cameraCoords;
  this.fov = fov;

  mat4.lookAt(viewMatrix, cameraCoords, [0,0,0], [0,1,0]);
  mat4.perspective(projMatrix, fov, this.aspectRatio, 0.1, 1100.0);
  mat4.mul(projMatrix, projMatrix, viewMatrix);

  return projMatrix;
}

GlTool.prototype.resize = function () {
  const gl = this.gl;
  const realToCSSPixels = window.devicePixelRatio;

  const displayWidth  = Math.floor(gl.canvas.clientWidth  * realToCSSPixels);
  const displayHeight = Math.floor(gl.canvas.clientHeight * realToCSSPixels);

  // Check if the canvas is not the same size.
  if (gl.canvas.width  !== displayWidth ||
      gl.canvas.height !== displayHeight) {

    // Make the canvas the same size
    gl.canvas.width  = displayWidth;
    gl.canvas.height = displayHeight;
  }

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  this.aspectRatio = displayWidth / displayHeight;
  this.projectionMatrix = this.cameraMatrix();
}

GlTool.prototype.createShader = function(type, text) {
  const gl = this.gl;
  const shader = gl.createShader(type);
  gl.shaderSource(shader, text);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Error compiling shader!", gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
};

GlTool.prototype.createProgram = function(vertexShader, fragmentShader) {
  const gl = this.gl;
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Error linking ", gl.getProgramInfoLog(program));
    return null;
  }

  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error("Error validationg program ", gl.getProgramInfoLog(program));
    return null;
  }

  return program;
};

GlTool.prototype.createTexture = function(imageData) {
  const gl = this.gl;
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    imageData
  );
  gl.bindTexture(gl.TEXTURE_2D, null);

  return texture;
};
