import React from 'react';
import { Line, RegularPolygon } from 'react-konva';


export type EdgeEndMarkerProps = {
    // edge endpoints are provided by caller via x/y/rotation
    x: number;
    y: number;
    rotationRad: number;
    stroke: string;
    strokeWidth: number;
    markerId: string;
};

type EdgeEndMarker = (props: EdgeEndMarkerProps) => React.ReactNode;

const arrowHead: EdgeEndMarker = ({ x, y, rotationRad, stroke, strokeWidth }) => {
    // simple triangular arrow head (works for custom marker baseline)
    // Konva RegularPolygon uses rotation in degrees
    return (
        <RegularPolygon
            x={x}
            y={y}
            sides={3}
            radius={8}
            fill={stroke}
            stroke={stroke}
            strokeWidth={strokeWidth}
            rotation={(rotationRad * 180) / Math.PI}
            offsetX={0}
            offsetY={0}
            listening={false}
        />
    );
};

const crowFeet: EdgeEndMarker = ({ x, y, rotationRad, stroke, strokeWidth }) => {
    // “crow feet” placeholder: 3 short lines in a V/arrow arrangement
    // Rotation is applied by drawing relative points and rotating group-like via Line points.
    // For now we draw in local coords and rotate by setting each segment via rotation.
    const len = 10;

    const angles = [0, -Math.PI / 6, Math.PI / 6];

    const pts = angles.map(a => {
        const dx = Math.cos(a) * len;
        const dy = Math.sin(a) * len;
        return { x1: x, y1: y, x2: x + dx, y2: y + dy };
    });

    // Apply edge rotation by rotating endpoints around (x,y)
    const rotatePoint = (px: number, py: number) => {
        const cos = Math.cos(rotationRad);
        const sin = Math.sin(rotationRad);
        const rx = x + (px - x) * cos - (py - y) * sin;
        const ry = y + (px - x) * sin + (py - y) * cos;
        return { rx, ry };
    };

    return (
        <>
            {pts.map((p, i) => {
                const r1 = rotatePoint(p.x1, p.y1);
                const r2 = rotatePoint(p.x2, p.y2);
                return (
                    <Line
                        key={i}
                        points={[r1.rx, r1.ry, r2.rx, r2.ry]}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                        lineCap='round'
                        listening={false}
                    />
                );
            })}
        </>
    );
};

const markerRegistry = new Map<string, EdgeEndMarker>([
    // baseline built-in
    ['arrow', arrowHead],

    // p.7 example
    ['c4.crow_feet', crowFeet],
]);

export const getEdgeEndMarker = (markerId: string | undefined) => {
    if (!markerId) return undefined;
    return markerRegistry.get(markerId);
};

