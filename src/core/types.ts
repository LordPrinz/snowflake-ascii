import { Vector3 } from '../math/Vector3';

export interface NormalPoint {
    position: Vector3;
    normal: Vector3;
}

export interface SnowflakeStyle {
    branchProb: number;
    subBranchDecay: number;
    angleVariance: number;
    width: number;
    density: number;
    maxDepth: number;
    branchAngle: number;
    lengthMult: number;
    startOffset: number;
    thickness: number;
    volumeType?: 'SPHERE' | 'PRISM';
    hasCenterHex?: boolean;
}

export type SnowflakeType = 
    | 'PERFECT' 
    | 'PERFECT_3D' 
    | 'DENDRITE_3D' 
    | 'DENDRITE' 
    | 'PLATE' 
    | 'STAR';
