import { ShaderProgram } from './webgl/shader-program';
import { BasicApp } from './basic-app';
import { MyMath } from './webgl/my-math';

export class InteractiveCubeSpin implements BasicApp {

    private gl: WebGL2RenderingContext;    
    private width: number;
    private height: number;
    private then: number;

    private stopped: boolean;

    private shaderProgram: ShaderProgram;

    private cubeVAO: WebGLVertexArrayObject;
    private cubeVBO: WebGLBuffer;
    private cubeIBO: WebGLBuffer;
    private colorVBO: WebGLBuffer;
    private positions: Float32Array;
    private colors: Float32Array;
    private indices: Int32Array;

    private position: [number, number, number] = [0, 0, 0];

    constructor(private canvas: HTMLCanvasElement) {}

    private async init() {
        this.stopped = false;

        try {
            this.gl = this.canvas.getContext('webgl2');
        } catch (e) {
            throw new Error('Could not generate WebGL 2.0 context.');
        }   

        let vsText: string, fsText: string;
        try {
            const vs = await fetch('../assets/shaders/spinningx-cube/basic.vert');
            vsText = await vs.text();

            const fs = await fetch('../assets/shaders/spinningx-cube/basic.frag');
            fsText = await fs.text();
        } catch (e) {
            console.log(e);
        }

        this.shaderProgram = new ShaderProgram(this.gl);
        try {
            this.shaderProgram.loadShaders(vsText, fsText);
        } catch (e) {
            console.log(e);
        }

        try {            

            this.onCanvasResized();

            // Clear canvas
            this.gl.clearColor(0.23, 0.38, 0.47, 1.0);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            
        } catch (e) {
            throw new Error('Could not generate WebGL 2.0 viewport.');
        }

        document.addEventListener('keydown', this.onKeyDown.bind(this));

    }

    

    private initCubeBuffers() {
        this.cubeVAO = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.cubeVAO);

        // Third coordinate is 1 because we're working with homogeneous coordinates!
        this.positions = new Float32Array([
            // Top
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,   
             1.0, 1.0, 1.0,    
             1.0, 1.0, -1.0,
             
             // Left
            -1.0, 1.0, 1.0,   
            -1.0, -1.0, 1.0,   
            -1.0, -1.0, -1.0,  
            -1.0, 1.0, -1.0,
            
            // Right
            1.0, 1.0, 1.0, 
            1.0, -1.0, 1.0,  
            1.0, -1.0, -1.0,  
            1.0, 1.0, -1.0,
            
            // Front
            1.0, 1.0, 1.0,  
            1.0, -1.0, 1.0,   
            -1.0, -1.0, 1.0,   
            -1.0, 1.0, 1.0,  
            
            // Back
            1.0, 1.0, -1.0,  
            1.0, -1.0, -1.0,   
            -1.0, -1.0, -1.0,   
            -1.0, 1.0, -1.0,   
            
            // Bottom
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,   
            1.0, -1.0, 1.0,     
            1.0, -1.0, -1.0,    

        ]);

        this.indices = new Int32Array([
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
        ]);

        this.cubeVBO = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVBO);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.positions, this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(0);

        this.cubeIBO = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeIBO);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.STATIC_DRAW);

        this.colors = new Float32Array([
                    0.5, 0.5, 0.5,
                    0.5, 0.5, 0.5,
                    0.5, 0.5, 0.5,
                    0.5, 0.5, 0.5,

                    // Left
                    0.75, 0.25, 0.5,
                    0.75, 0.25, 0.5,
                    0.75, 0.25, 0.5,
                    0.75, 0.25, 0.5,

                    // Right
                    0.25, 0.25, 0.75,
                    0.25, 0.25, 0.75,
                    0.25, 0.25, 0.75,
                    0.25, 0.25, 0.75,

                    // Front
                    1.0, 0.0, 0.15,
                    1.0, 0.0, 0.15,
                    1.0, 0.0, 0.15,
                    1.0, 0.0, 0.15,

                    // Back
                    0.0, 1.0, 0.15,
                    0.0, 1.0, 0.15,
                    0.0, 1.0, 0.15,
                    0.0, 1.0, 0.15,

                    // Bottom
                    0.5, 0.5, 1.0,
                    0.5, 0.5, 1.0,
                    0.5, 0.5, 1.0,
                    0.5, 0.5, 1.0,
        ]);

        this.colorVBO = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorVBO);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.colors, this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(1);
    }

    private onKeyDown(e: KeyboardEvent) {
        const amount = 0.1;
        switch (e.keyCode) {
            case 37: // left
                this.position[0] += amount;
                break;
            case 38: // up
                this.position[1] += amount;
                break;
            case 39: // right
                this.position[0] -= amount;
                break;
            case 40: // down
                this.position[1] -= amount;
                break;
        }
    }

    async run() {
        await this.init();
        
        this.initCubeBuffers();        
        
        requestAnimationFrame(this.drawScene.bind(this));
    }

    async stop() {
        this.stopped = true;
        this.shaderProgram.destroy();
        this.gl.deleteVertexArray(this.cubeVAO);
        this.gl.deleteBuffer(this.cubeVBO);
        this.gl.deleteBuffer(this.colorVBO);
        document.removeEventListener('keydown', this.onKeyDown.bind(this));
    }

    drawScene(now: number) {
        if (this.stopped) {
            return;
        }
        // Resize window if necessary
        this.onCanvasResized();

        // Calculate delta time to make animation frame rate independent
        now *= 0.001;   // convert current time to seconds
        const deltaTime = now - this.then;  // get time difference from previous time to current time
        this.then = now; // remember time for the next frame

        //Radian convert
        const degree = Math.PI / 180;

        const angle = performance.now()/1000/6*2*Math.PI;
    

        var worldMatrix = MyMath.identity_matrix();
        const viewMatrix =  MyMath.lookAt([0,0,-8], [0,0,0],[0,1,0]);
        const projMatrix = MyMath.perspective(45*degree, this.width/this.height, 0.1, 100.0);

        const identity_mat = MyMath.identity_matrix();
        
        // Tell WebGL how to convert from clip space to pixels
        this.gl.viewport(0, 0, this.width, this.height);

        // Clear the canvas
        this.gl.clearColor(0.23, 0.38, 0.47, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        //Testando profundidade e eliminando faces voltadas para trás
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);

        // Draw
        this.shaderProgram.use();
        this.shaderProgram.setUniformMatrix4fv('mWorld', worldMatrix);    // pass transformation matrix
        this.shaderProgram.setUniformMatrix4fv('mView', viewMatrix);    // pass transformation matrix
        this.shaderProgram.setUniformMatrix4fv('mProj', projMatrix);    // pass transformation matrix
        
        const xRotationMatrix = MyMath.rotateX3D(identity_mat,angle/4);
        const yRotationMatrix = MyMath.rotateY3D(identity_mat,angle);
        worldMatrix = MyMath.multXY3D(yRotationMatrix,xRotationMatrix);
        const wTranslateMatrix = MyMath.translate3D([this.position[0], this.position[1], this.position[2]]);



        this.shaderProgram.setUniformMatrix4fv('mWorld', MyMath.multXY3D(wTranslateMatrix, worldMatrix));
        
        
        this.gl.bindVertexArray(this.cubeVAO);      // tell WebGL we want to draw the triangle
        this.gl.drawElements(this.gl.TRIANGLES, 36, this.gl.UNSIGNED_INT, 0);    // params: primitive type, offset, count        

        // Call draw scene again at the next frame
        requestAnimationFrame(this.drawScene.bind(this));
    }

    onCanvasResized() {
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;

        if (this.canvas.width !== this.width || this.canvas.height !== this.height) {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        }
    }
}
