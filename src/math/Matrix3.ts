import { Vector3 } from './Vector3';

export class Matrix3 {
    elements: number[];

    constructor(elements?: number[]) {
        this.elements = elements || [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ];
    }

    static rotationX(theta: number): Matrix3 {
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        return new Matrix3([
            1, 0, 0,
            0, c, -s,
            0, s, c
        ]);
    }

    static rotationY(theta: number): Matrix3 {
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        return new Matrix3([
            c, 0, s,
            0, 1, 0,
            -s, 0, c
        ]);
    }

    static rotationZ(theta: number): Matrix3 {
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        return new Matrix3([
            c, -s, 0,
            s, c, 0,
            0, 0, 1
        ]);
    }

    multiply(m: Matrix3): Matrix3 {
        const ae = this.elements;
        const be = m.elements;
        const te = new Array(9);

        te[0] = ae[0]! * be[0]! + ae[1]! * be[3]! + ae[2]! * be[6]!;
        te[1] = ae[0]! * be[1]! + ae[1]! * be[4]! + ae[2]! * be[7]!;
        te[2] = ae[0]! * be[2]! + ae[1]! * be[5]! + ae[2]! * be[8]!;

        te[3] = ae[3]! * be[0]! + ae[4]! * be[3]! + ae[5]! * be[6]!;
        te[4] = ae[3]! * be[1]! + ae[4]! * be[4]! + ae[5]! * be[7]!;
        te[5] = ae[3]! * be[2]! + ae[4]! * be[5]! + ae[5]! * be[8]!;

        te[6] = ae[6]! * be[0]! + ae[7]! * be[3]! + ae[8]! * be[6]!;
        te[7] = ae[6]! * be[1]! + ae[7]! * be[4]! + ae[8]! * be[7]!;
        te[8] = ae[6]! * be[2]! + ae[7]! * be[5]! + ae[8]! * be[8]!;

        return new Matrix3(te);
    }

    multiplyVector(v: Vector3): Vector3 {
        const e = this.elements;
        const x = v.x, y = v.y, z = v.z;
        return new Vector3(
            e[0]! * x + e[1]! * y + e[2]! * z,
            e[3]! * x + e[4]! * y + e[5]! * z,
            e[6]! * x + e[7]! * y + e[8]! * z
        );
    }
}
