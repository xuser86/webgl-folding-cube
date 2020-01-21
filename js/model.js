function FoldingCube() {
  const templateCube = { 
    verticles: [
      // X, Y, Z,        U, V, TEX
      // Top
      -1.0, 1.0, -1.0,   0, 0, 0,
      -1.0, 1.0, 1.0,    0, 1, 0,
      1.0, 1.0, 1.0,     1, 1, 0,
      1.0, 1.0, -1.0,    1, 0, 0,

      // Left
      -1.0, 1.0, 1.0,    0, 0, 1,
      -1.0, -1.0, 1.0,   1, 0, 1,
      -1.0, -1.0, -1.0,  1, 1, 1,
      -1.0, 1.0, -1.0,   0, 1, 1,

      // Right
      1.0, 1.0, 1.0,    1, 1, 2,
      1.0, -1.0, 1.0,   0, 1, 2,
      1.0, -1.0, -1.0,  0, 0, 2,
      1.0, 1.0, -1.0,   1, 0, 2,

      // Front
      1.0, 1.0, 1.0,    1, 1, 3,
      1.0, -1.0, 1.0,    1, 0, 3,
      -1.0, -1.0, 1.0,    0, 0, 3,
      -1.0, 1.0, 1.0,    0, 1, 3,

      // Back
      1.0, 1.0, -1.0,    0, 0, 4,
      1.0, -1.0, -1.0,    0, 1, 4,
      -1.0, -1.0, -1.0,    1, 1, 4,
      -1.0, 1.0, -1.0,    1, 0, 4,

      // Bottom
      -1.0, -1.0, -1.0,   1, 1, 5,
      -1.0, -1.0, 1.0,    1, 0, 5,
      1.0, -1.0, 1.0,     0, 0, 5,
      1.0, -1.0, -1.0,    0, 1, 5
    ],
    indices: [
      // Top
      0, 1, 2,
      0, 2, 3,

      // Left
      5, 4, 6,
      6, 4, 7,

      // Right
      8, 9, 10,
      8, 10, 11,

      // Front
      13, 12, 14,
      15, 14, 12,

      // Back
      16, 17, 18,
      16, 18, 19,

      // Bottom
      21, 20, 22,
      22, 20, 23
    ]
  };

  this.verticles = [];//new Float32Array();
  this.indices = [];//new Uint16Array();

  /* create cubes */
  let idx = 0;
  for (let x of [-1, 1]) {
    for (let y of [-1, 1]) {
      for (let z of [-1, 1]) {
         const verticles = templateCube.verticles.slice(0);
         const indices = templateCube.indices.slice(0);

         for (let i = 0; i < verticles.length; i+=6) {
            verticles[i] += x*1.5;
            verticles[i + 1] += y*1.5;
            verticles[i + 2] += z*1.5;
/*
            verticles[i + 3] /= 2;
            verticles[i + 4] /= 2;

           if (x < 0 && y < 0) {
              verticles[i + 3] += 0.5;
           } else if (x > 0 && y > 0) {
              verticles[i + 4] += 0.5;
           }*/
            //verticles[i + 3] += u;
            //verticles[i + 4] += v;
           verticles[i + 5] = idx; // textureNumber
         }

         for (let i = 0; i < indices.length; i++) {
            indices[i] += idx*24;
         }

         idx ++;
         this.verticles.push(...verticles);
         this.indices.push(...indices);
      }
    }
  }
}