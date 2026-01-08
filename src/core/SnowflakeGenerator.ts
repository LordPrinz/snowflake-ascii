import type { NormalPoint, SnowflakeStyle } from './types';
import { SNOWFLAKE_STYLES, STYLE_KEYS } from './constants';
import { Vector3 } from '../math/Vector3';

export class SnowflakeGenerator {
    private vertices: NormalPoint[] = [];
    private style: SnowflakeStyle = {} as SnowflakeStyle;

    private random(seed: number): number {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    public generate(seed: number = Math.random() * 1000): NormalPoint[] {
        this.vertices = [];
        let curSeed = seed;

        const typeKey = STYLE_KEYS[Math.floor(this.random(curSeed++) * STYLE_KEYS.length)]!;
        this.style = SNOWFLAKE_STYLES[typeKey];

        const baseLen = 6 + this.random(curSeed++) * 4;
        const armLength = baseLen * this.style.lengthMult;

        if (this.style.hasCenterHex) {
            this.drawHexagon(2.5, this.style.width * 0.8, this.style.density, this.style.thickness);
        }

        const armPoints: NormalPoint[] = [];
        this.generateBranch(
            armPoints,
            new Vector3(0, 0, 0),
            new Vector3(0, 1, 0),
            armLength,
            this.style.width,
            0,
            curSeed
        );

        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            
            for (const p of armPoints) {
                this.vertices.push({
                    position: p.position.rotateZ(angle),
                    normal: p.normal.rotateZ(angle)
                });
            }
        }

        return this.vertices;
    }

    private generateBranch(points: NormalPoint[], start: Vector3, dir: Vector3, length: number, width: number, depth: number, seed: number): void {
        if (length < 0.4 || depth > this.style.maxDepth) return;

        let curSeed = seed;
        const end = start.add(dir.scale(length));

        this.addSegment(points, start, end, width, width * 0.4, this.style.density, this.style.thickness);

        if (depth < this.style.maxDepth) {
            const slots = Math.floor(length * 1.5);
            const startIdx = (depth === 0) ? Math.floor(slots * (this.style.startOffset || 0)) : 1;

            for (let i = startIdx; i < slots; i++) {
                if (this.random(curSeed++) < this.style.branchProb) {
                    const t = i / slots;
                    const currentBranchWidth = width * (1 - t * 0.6);
                    
                    const origin = start.add(dir.scale(length * t));

                    const side = this.random(curSeed++) > 0.5 ? 1 : -1;
                    const forceSymmetry = (depth === 0 && this.random(curSeed++) > 0.1);
                    const both = forceSymmetry || (this.random(curSeed++) > 0.4);

                    const spawn = (directionSign: number) => {
                        const baseAngle = this.style.branchAngle * directionSign;
                        const vary = (this.random(curSeed++) - 0.5) * this.style.angleVariance;
                        const finalAngle = baseAngle + vary;
                        
                        const newDir = dir.rotateZ(finalAngle);

                        const newLen = length * this.style.subBranchDecay * (0.8 + this.random(curSeed++) * 0.4);
                        const newWidth = currentBranchWidth * 0.7;

                        this.generateBranch(points, origin, newDir, newLen, newWidth, depth + 1, curSeed);
                    };

                    spawn(side);
                    if (both) spawn(-side);
                }
            }
        }
    }

    private addSegment(points: NormalPoint[], start: Vector3, end: Vector3, startRadius: number, endRadius: number, density: number, thickness: number): void {
        const delta = end.sub(start);
        const len = delta.length();
        const steps = Math.floor(len / density);

        for (let s = 0; s <= steps; s++) {
            const t = s / steps;
            const currentPos = start.add(delta.scale(t));
            
            const r = startRadius + (endRadius - startRadius) * t;
            this.addVolume(points, currentPos, r, thickness);
        }
    }

    private drawHexagon(radius: number, thicknessWidth: number, density: number, prismDepth: number): void {
        for (let i = 0; i < 6; i++) {
            const angle1 = (Math.PI / 3) * i;
            const up = new Vector3(0, radius, 0); 
            const start = new Vector3(Math.sin(angle1)*radius, Math.cos(angle1)*radius, 0);
            const nextAngle = (Math.PI / 3) * ((i + 1) % 6);
            const end = new Vector3(Math.sin(nextAngle)*radius, Math.cos(nextAngle)*radius, 0);
            
            this.addSegment(this.vertices, start, end, thicknessWidth, thicknessWidth, density, prismDepth);
        }
    }

    private addVolume(points: NormalPoint[], center: Vector3, r: number, thickness: number): void {        
        if (this.style.volumeType === 'SPHERE') {
            const segments = 6;
            const rings = 6;
            
            for (let i = 0; i < segments; i++) {
                const phi = (Math.PI * 2 * i) / segments;
                for (let j = 0; j < rings; j++) {
                    const theta = (Math.PI * j) / rings;
                    
                    const px = Math.sin(theta) * Math.cos(phi);
                    const py = Math.sin(theta) * Math.sin(phi);
                    const pz = Math.cos(theta);
                    
                    const normal = new Vector3(px, py, pz);
                    const offset = normal.scale(thickness || 0.3);

                    points.push({
                        position: center.add(offset),
                        normal: normal
                    });
                }
            }
        } else {
            const halfThick = (thickness || 0.1) / 2;
            const dens = this.style.density || 0.3;
            const vSteps = Math.max(1, Math.floor((thickness || 0.1) / dens));
            const segments = 6;

            for (let i = 0; i < segments; i++) {
                const phi = (Math.PI * 2 * i) / segments;
                const px = Math.cos(phi) * r;
                const py = Math.sin(phi) * r;
                
                for (let k = 0; k <= vSteps; k++) {
                    const t = k / vSteps;
                    const currZ = center.z - halfThick + (thickness || 0.1) * t;
                    
                    points.push({
                        position: new Vector3(center.x + px, center.y + py, currZ),
                        normal: new Vector3(px / r, py / r, 0)
                    });
                }
            }
            
            points.push({ 
                position: new Vector3(center.x, center.y, center.z + halfThick), 
                normal: new Vector3(0, 0, 1) 
            });
            points.push({ 
                position: new Vector3(center.x, center.y, center.z - halfThick), 
                normal: new Vector3(0, 0, -1) 
            });
        }
    }
}
