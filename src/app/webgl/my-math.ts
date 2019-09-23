export class MyMath {
    static degreeToRad(d: number) {
        return d * Math.PI / 180;
    }

    static rotate2D(degree: number): Float32Array {
        const angle = MyMath.degreeToRad(degree);
        
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        const m = new Float32Array(9);

        m[0] = cos; m[1] = -sin; m[2] = 0.0;    // col 1
        m[3] = sin; m[4] =  cos; m[5] = 0.0;    // col 2
        m[6] = 0.0; m[7] =  0.0; m[8] = 1.0;    // col 3 

        return m;
    }

    static translate2D(x: number, y: number) {        
        const m = new Float32Array(9);
        m[0] = 1; m[3] = 0; m[6] = x;
        m[1] = 0; m[4] = 1; m[7] = y;
        m[2] = 0; m[5] = 0; m[8] = 1;
        return m;
    }

    static multiplyMatrix2D(m1: Float32Array, m2: Float32Array) {

        const m1_l1: [number, number, number] = [m1[0], m1[3], m1[6]];
        const m1_l2: [number, number, number] = [m1[1], m1[4], m1[7]];
        const m1_l3: [number, number, number] = [m1[2], m1[5], m1[8]];

        const m2_c1: [number, number, number] = [m2[0], m2[1], m2[2]];
        const m2_c2: [number, number, number] = [m2[3], m2[4], m2[5]];
        const m2_c3: [number, number, number] = [m2[6], m2[7], m2[8]];

        const m = new Float32Array(9);

        m[0] = MyMath.dot3f(m1_l1, m2_c1);    m[3] = MyMath.dot3f(m1_l1, m2_c2);    m[6] = MyMath.dot3f(m1_l1, m2_c3);
        m[1] = MyMath.dot3f(m1_l2, m2_c1);    m[4] = MyMath.dot3f(m1_l2, m2_c2);    m[7] = MyMath.dot3f(m1_l2, m2_c3);
        m[2] = MyMath.dot3f(m1_l3, m2_c1);    m[5] = MyMath.dot3f(m1_l3, m2_c2);    m[8] = MyMath.dot3f(m1_l3, m2_c3);

        return m;
    }

    static dot3f(v1: [number, number, number], v2: [number, number, number]) {
        return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
    }

    static identity_matrix(){
        var out = new Float32Array(16);
        out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = 1;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = 1;
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
        
        return out;
    }

    static lookAt(eye: number[], center:number[], up:number[]) {
        
        var out = new Float32Array(16);
        var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
	        eyex = eye[0],
	        eyey = eye[1],
	        eyez = eye[2],
	        upx = up[0],
	        upy = up[1],
	        upz = up[2],
	        centerx = center[0],
	        centery = center[1],
	        centerz = center[2];

	    if (Math.abs(eyex - centerx) < 0.000001 &&
	        Math.abs(eyey - centery) < 0.000001 &&
	        Math.abs(eyez - centerz) < 0.000001) {
	        return this.identity_matrix();
	    }

	    z0 = eyex - centerx;
	    z1 = eyey - centery;
	    z2 = eyez - centerz;

	    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
	    z0 *= len;
	    z1 *= len;
	    z2 *= len;

	    x0 = upy * z2 - upz * z1;
	    x1 = upz * z0 - upx * z2;
	    x2 = upx * z1 - upy * z0;
	    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
	    if (!len) {
	        x0 = 0;
	        x1 = 0;
	        x2 = 0;
	    } else {
	        len = 1 / len;
	        x0 *= len;
	        x1 *= len;
	        x2 *= len;
	    }

	    y0 = z1 * x2 - z2 * x1;
	    y1 = z2 * x0 - z0 * x2;
	    y2 = z0 * x1 - z1 * x0;

	    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
	    if (!len) {
	        y0 = 0;
	        y1 = 0;
	        y2 = 0;
	    } else {
	        len = 1 / len;
	        y0 *= len;
	        y1 *= len;
	        y2 *= len;
	    }

	    out[0] = x0;
	    out[1] = y0;
	    out[2] = z0;
	    out[3] = 0;
	    out[4] = x1;
	    out[5] = y1;
	    out[6] = z1;
	    out[7] = 0;
	    out[8] = x2;
	    out[9] = y2;
	    out[10] = z2;
	    out[11] = 0;
	    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
	    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
	    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
	    out[15] = 1;

	    return out;
    }
    
    static perspective = function (fovy:any, aspect:any, near:any, far:any) {
        var out = new Float32Array(16);
        var f = 1.0 / Math.tan(fovy / 2),
	        nf = 1 / (near - far);
	    out[0] = f / aspect;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = f;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = (far + near) * nf;
	    out[11] = -1;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = (2 * far * near) * nf;
	    out[15] = 0;
	    return out;
    }
    
    static rotateX3D(a:Float32Array, rad:any) {
        var out = new Float32Array(16);
        var s = Math.sin(rad),
	        c = Math.cos(rad),
	        a10 = a[4],
	        a11 = a[5],
	        a12 = a[6],
	        a13 = a[7],
	        a20 = a[8],
	        a21 = a[9],
	        a22 = a[10],
	        a23 = a[11];

	    if (a !== out) { 
	        out[0]  = a[0];
	        out[1]  = a[1];
	        out[2]  = a[2];
	        out[3]  = a[3];
	        out[12] = a[12];
	        out[13] = a[13];
	        out[14] = a[14];
	        out[15] = a[15];
	    }

	    out[4] = a10 * c + a20 * s;
	    out[5] = a11 * c + a21 * s;
	    out[6] = a12 * c + a22 * s;
	    out[7] = a13 * c + a23 * s;
	    out[8] = a20 * c - a10 * s;
	    out[9] = a21 * c - a11 * s;
	    out[10] = a22 * c - a12 * s;
	    out[11] = a23 * c - a13 * s;
	    return out;
    }
    
    static rotateY3D(a:Float32Array, rad:any) {
        const out = new Float32Array(16);
        var s = Math.sin(rad),
	        c = Math.cos(rad),
	        a00 = a[0],
	        a01 = a[1],
	        a02 = a[2],
	        a03 = a[3],
	        a20 = a[8],
	        a21 = a[9],
	        a22 = a[10],
	        a23 = a[11];

	    if (a !== out) { 
	        out[4]  = a[4];
	        out[5]  = a[5];
	        out[6]  = a[6];
	        out[7]  = a[7];
	        out[12] = a[12];
	        out[13] = a[13];
	        out[14] = a[14];
	        out[15] = a[15];
	    }

	
	    out[0] = a00 * c - a20 * s;
	    out[1] = a01 * c - a21 * s;
	    out[2] = a02 * c - a22 * s;
	    out[3] = a03 * c - a23 * s;
	    out[8] = a00 * s + a20 * c;
	    out[9] = a01 * s + a21 * c;
	    out[10] = a02 * s + a22 * c;
	    out[11] = a03 * s + a23 * c;
	    return out;
    }

    static multXY3D(a:Float32Array, b:Float32Array) {

        const out = new Float32Array(16);

        let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
      
        let b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];

        out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;      
        out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
        
        b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
        out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
      
        b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
        out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
      
        b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
        out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
      
        return out;
      
      }

      static translate3D(v:any) {

        var out = new Float32Array(16);
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = 1;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 1;
        out[11] = 0;
        out[12] = v[0];
        out[13] = v[1];
        out[14] = v[2];
        out[15] = 1;
      
        return out;
      
      }

}