export class Vector3 {
    constructor(
        public x: number = 0,
        public y: number = 0,
        public z: number = 0
    ) {}

    add(v: Vector3): Vector3 {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    sub(v: Vector3): Vector3 {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    scale(s: number): Vector3 {
        return new Vector3(this.x * s, this.y * s, this.z * s);
    }

    dot(v: Vector3): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v: Vector3): Vector3 {
        return new Vector3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    length(): number {
        return Math.sqrt(this.dot(this));
    }

    normalize(): Vector3 {
        const len = this.length();
        return len === 0 ? new Vector3() : this.scale(1 / len);
    }

    clone(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }

    rotateZ(angle: number): Vector3 {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector3(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos,
            this.z
        );
    }

    static fromObject(obj: { x: number, y: number, z: number }): Vector3 {
        return new Vector3(obj.x, obj.y, obj.z);
    }
}
