import type { SnowflakeStyle, SnowflakeType } from './types';

export const SNOWFLAKE_STYLES: Record<SnowflakeType, SnowflakeStyle> = {
    'PERFECT': { 
        branchProb: 0.85, 
        subBranchDecay: 0.55,
        angleVariance: 0.0, 
        width: 0.35, 
        density: 0.25,
        maxDepth: 2,
        branchAngle: Math.PI / 3, 
        lengthMult: 1.1,
        startOffset: 0.2, 
        thickness: 0.25 
    },
    'PERFECT_3D': { 
        branchProb: 0.7, 
        subBranchDecay: 0.55,
        angleVariance: 0.0, 
        width: 0.3, 
        density: 0.4, 
        maxDepth: 2,
        branchAngle: Math.PI / 3, 
        lengthMult: 1.1,
        startOffset: 0.3, 
        thickness: 0.4, 
        volumeType: 'SPHERE'
    },
    'DENDRITE_3D': {
        branchProb: 0.6, 
        subBranchDecay: 0.5,
        angleVariance: 0.05, 
        width: 0.3, 
        density: 0.4, 
        maxDepth: 3, 
        branchAngle: Math.PI / 3,
        lengthMult: 1.0,
        startOffset: 0.3,
        thickness: 0.35,
        volumeType: 'SPHERE'
    },
    'DENDRITE': { 
        branchProb: 0.6, 
        subBranchDecay: 0.55, 
        angleVariance: 0.05, 
        width: 0.3, 
        density: 0.3,
        maxDepth: 3,
        branchAngle: Math.PI / 3,
        lengthMult: 1.0,
        startOffset: 0.25, 
        thickness: 0.15 
    },
    'PLATE': { 
        branchProb: 0.1, 
        subBranchDecay: 0.9,
        angleVariance: 0.0,
        width: 0.3, 
        density: 0.3,
        maxDepth: 2,
        branchAngle: Math.PI / 3,
        lengthMult: 0.8, 
        startOffset: 0.2,
        thickness: 0.1 
    },
    'STAR': { 
        branchProb: 0.05, 
        subBranchDecay: 0.1,
        angleVariance: 0.0,
        width: 0.35, 
        density: 0.3,
        maxDepth: 1,
        branchAngle: Math.PI / 3,
        lengthMult: 0.9,
        startOffset: 0.1,
        thickness: 0.2 
    }
};

export const STYLE_KEYS: SnowflakeType[] = [
    'PERFECT', 'PERFECT', 
    'PERFECT_3D', 'PERFECT_3D',
    'DENDRITE_3D', 'DENDRITE_3D', 'DENDRITE_3D',
    'DENDRITE', 
    'STAR', 
    'PLATE'
];
