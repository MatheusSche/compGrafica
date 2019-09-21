import { ShaderProgram } from './webgl/shader-program';
import { BasicApp } from './basic-app';

export class TriangleAspectRatio implements BasicApp {

    private gl: WebGL2RenderingContext;    
    private width: number;
    private height: number;
    private then: number;

    private stopped: boolean;

    private shaderProgram: ShaderProgram;

    private triangleVAO: WebGLVertexArrayObject;
    private triangleVBO: WebGLBuffer;
    private colorVBO: WebGLBuffer;
    private positions: Float32Array;
    private colors: Float32Array;

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
            const vs = await fetch('../assets/shaders/triangle-aspect-ratio/basic.vert');
            vsText = await vs.text();

            const fs = await fetch('../assets/shaders/triangle-aspect-ratio/basic.frag');
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
    }    

    private initTriangleBuffers() {
        this.triangleVAO = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.triangleVAO);

        // Third coordinate is 1 because we're working with homogeneous coordinates!
        this.positions = new Float32Array([
            -0.5, -0.5, 1.0,
             0.5, -0.5, 1.0,
             0.0,  0.5, 1.0
        ]);

        this.triangleVBO = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVBO);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.positions, this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(0);

        this.colors = new Float32Array([
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
        ]);

        this.colorVBO = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorVBO);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.colors, this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(1);
    }    

    async run() {
        await this.init();
        
        this.initTriangleBuffers();     
        
        requestAnimationFrame(this.drawScene.bind(this));
    }

    async stop() {
        this.stopped = true;
        this.shaderProgram.destroy();
        this.gl.deleteVertexArray(this.triangleVAO);
        this.gl.deleteBuffer(this.triangleVBO);
        this.gl.deleteBuffer(this.colorVBO);
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

        // Tell WebGL how to convert from clip space to pixels
        this.gl.viewport(0, 0, this.width, this.height);

        // Clear the canvas
        this.gl.clearColor(0.53, 0.38, 0.47, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // Draw
        this.shaderProgram.use();
        this.shaderProgram.setUniform1f('u_aspectRatio', this.width / this.height);    // pass WebGL the aspect ratio
        this.gl.bindVertexArray(this.triangleVAO);      // tell WebGL we want to draw the triangle
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);    // params: primitive type, offset, count        

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
