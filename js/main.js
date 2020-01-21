async function linkMyGlProgram(glTool) {
    const gl = glTool.gl;
    const vertexShaderText = await fetch('/res/vertex.glsl')
        .then(r => r.text());
    const fragmentShaderText = await fetch('/res/fragment.glsl')
        .then(r => r.text());

    const vertexShader = glTool.createShader(gl.VERTEX_SHADER, vertexShaderText);
    const fragmentShader = glTool.createShader(gl.FRAGMENT_SHADER, fragmentShaderText);

    const program = glTool.createProgram(vertexShader, fragmentShader);

    const matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    const matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
    const texturesUniformLocation = gl.getUniformLocation(program, 'textures');

    const vertexBufferObject = gl.createBuffer();
    const indexBufferObject = gl.createBuffer();

    const floatSize = Float32Array.BYTES_PER_ELEMENT;
    let positionAttribLocation;
    let texCoordAttribLocation;
    let texNumberAttribLocation;

    const allocLocations = () => {
        positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
        // Attribute location, Number of elements per attribute, Type of elements, Is normalized?,
        // Size of invidual vertex, Offset from the beginning of a single vertex to this attribute
        gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 6 * floatSize, 0);
        gl.enableVertexAttribArray(positionAttribLocation);

        texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
        gl.vertexAttribPointer(texCoordAttribLocation, 2, gl.FLOAT, gl.FALSE, 6 * floatSize, 3 * floatSize);
        gl.enableVertexAttribArray(texCoordAttribLocation);

        texNumberAttribLocation = gl.getAttribLocation(program, 'vertTextureNumber');
        gl.vertexAttribPointer(texNumberAttribLocation, 1, gl.FLOAT, gl.FALSE, 6 * floatSize, 5 * floatSize);
        gl.enableVertexAttribArray(texNumberAttribLocation);
    }

    Object.defineProperty(program, 'verticles', { set: function(verticles) { 
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticles), gl.STATIC_DRAW);

        if (!positionAttribLocation) {
            allocLocations();
        }
    }});
    Object.defineProperty(program, 'indices', { set: function(indices) { 
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    }});

    Object.defineProperty(program, 'mWorld', { set: function(worldMatrix) { 
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    }});
    Object.defineProperty(program, 'mProj', { set: function(projMatrix) { 
        gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
    }});

    Object.defineProperty(program, 'textures', { set: function(textures) { 
        gl.uniform1iv(texturesUniformLocation, textures);
    }});


    return program;
}

async function createCanvasTextures() {
    const texturesContainer = document.getElementById('textures-div');
    
    const textureCanvases = [];
    /* small outer textures */
    for (let i = 0; i < 9; i++) {
        const canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'tex-' + String(i).padStart(2, '0'));
        canvas.height = 256;
        canvas.width = i < /*6*/10 ? 256 : 512;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = `hsl(${i*40}, 75%, 50%)`;
        ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20);

        ctx.font = '100px arial';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.fillText(String(i), i < /*6*/10 ? 128 : 256, 128);

        texturesContainer.appendChild(canvas);
        textureCanvases.push(canvas);
    }

    return textureCanvases;
}

async function main() {
    const mainCanvas = document.getElementById('animation-canvas');
    const textureCanvases = await createCanvasTextures();

    const gl = mainCanvas.getContext('webgl');
    const glTool = new GlTool(gl);
    const textures = textureCanvases.map(
        canvas => glTool.createTexture(
            canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height)
        )
    );

    gl.clearColor(0.11, 0.13, 0.13, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    const program = await linkMyGlProgram(glTool);

    gl.useProgram(program);

    const foldingCube = new FoldingCube();

    program.verticles = foldingCube.verticles;
    program.indices = foldingCube.indices;
    program.mProj = glTool.projectionMatrix;

    // world rotation
    const xRotationMatrix = new Float32Array(16);
    const yRotationMatrix = new Float32Array(16);
    const worldMatrix = new Float32Array(16);
    const identityMatrix = new Float32Array(16);

    for (let i = 0; i < textures.length; i++) {
        gl.bindTexture(gl.TEXTURE_2D, textures[i]);
        gl.activeTexture(gl.TEXTURE1 + i);
    }

    program.textures = new Int32Array([0,1,2,3,4,5,6,7,8]);

    let angle = 0;
    const loop = function() {
        angle = performance.now() / 1000 / 6 * 2 * Math.PI;

        mat4.identity(identityMatrix);
        mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
        mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
        mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);

        program.mWorld = worldMatrix;
        gl.clearColor(0.11, 0.13, 0.13, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.drawElements(gl.TRIANGLES, foldingCube.indices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(loop)
    };
    requestAnimationFrame(loop);
}

//window.onload = main;
main();
