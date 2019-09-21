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
}