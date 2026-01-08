import type { NormalPoint } from '../core/types';
import { Vector3 } from '../math/Vector3';
import { Matrix3 } from '../math/Matrix3';

export class AsciiRenderer {
    private element: HTMLElement | null;
    private width: number = 80;
    private height: number = 40;
    private zoom: number = 15;
    private chars: string = ".,-~:;=!*#$@";

    constructor(elementId: string, width: number = 80, height: number = 40) {
        this.element = document.getElementById(elementId);
        this.setSize(width, height);
    }

    public setSize(width: number, height: number): void {
        this.width = Math.max(1, Math.floor(width || 80));
        this.height = Math.max(1, Math.floor(height || 40));
    }

    public setZoom(zoom: number): void {
        this.zoom = zoom;
    }

    public render(mesh: NormalPoint[], rotationX: number, rotationY: number): void {
        if (!this.element || !this.width || !this.height) return;

        const area = Math.floor(this.width * this.height);
        if (Number.isNaN(area) || area <= 0) return;

        const zBuffer = new Array<number>(area).fill(0);
        const outputBuffer = new Array<string>(area).fill(' ');

        const MIN_DIM = Math.min(this.width, this.height);
        const K1 = MIN_DIM * 0.6;
        const K2 = this.zoom || 15;
        const matRotX = Matrix3.rotationX(rotationX);
        const matRotY = Matrix3.rotationY(rotationY);

        const rotationMatrix = matRotY.multiply(matRotX);

        const lightDir = new Vector3(0, 0.707, -0.707).normalize();

        for (const point of mesh) {
            const transformedPos = rotationMatrix.multiplyVector(point.position);
            
            const zDepth = transformedPos.z + K2;
            if (zDepth <= 0) continue;

            const ooz = 1 / zDepth;

            const xp = Math.floor(this.width / 2 + (K1 * 2) * ooz * transformedPos.x);
            const yp = Math.floor(this.height / 2 - K1 * ooz * transformedPos.y);

            if (xp >= 0 && xp < this.width && yp >= 0 && yp < this.height) {
                const idx = xp + yp * this.width;

                if (ooz > (zBuffer[idx] ?? 0)) {
                    zBuffer[idx] = ooz;

                    const transformedNormal = rotationMatrix.multiplyVector(point.normal);
                    const L = transformedNormal.dot(lightDir);

                    if (L > 0) {
                        const charIdx = Math.floor(L * (this.chars.length - 1));
                        outputBuffer[idx] = this.chars[Math.max(0, Math.min(this.chars.length - 1, charIdx))] || ' ';
                    }
                }
            }
        }

        let output = "";
        for (let j = 0; j < this.height; j++) {
            for (let i = 0; i < this.width; i++) {
                output += outputBuffer[i + j * this.width];
            }
            output += "\n";
        }
        this.element.textContent = output;
    }
}
