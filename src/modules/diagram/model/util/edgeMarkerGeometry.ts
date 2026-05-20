import type { DiagramNode } from '../types/node.types';
import type { DiagramEdge, EdgePoint } from '../types/edge.types';
import { resolveEdgePoints } from './edgeGeometry';


export const getEdgeTangentAngle = (p1: EdgePoint, p2: EdgePoint) => {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
};

export const getEdgeEndMarkerRotation = (
    edge: DiagramEdge,
    nodes: DiagramNode[],
    end: 'start' | 'end',
): { x: number; y: number; rotationRad: number } | null => {
    const resolved = resolveEdgePoints(edge, nodes);
    if (resolved.length < 2) return null;

    if (end === 'start') {
        const a = resolved[0];
        const b = resolved[1];
        return { x: a.x, y: a.y, rotationRad: getEdgeTangentAngle(b, a) };
    }

    const a = resolved[resolved.length - 2];
    const b = resolved[resolved.length - 1];
    return { x: b.x, y: b.y, rotationRad: getEdgeTangentAngle(a, b) };
};

