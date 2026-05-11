import type {DiagramEdge, EdgePoint} from '../types/edge.types'
import type {DiagramNode} from '../types/node.types'
import {getNodeAnchors} from '../factories/getNodeAnchors'

const closestPointOnSegment = (
    ax: number,
    ay: number,
    bx: number,
    by: number,
    px: number,
    py: number,
): EdgePoint => {
    const abx = bx - ax
    const aby = by - ay
    const apx = px - ax
    const apy = py - ay
    const ab2 = abx * abx + aby * aby
    if (ab2 <= 1e-12) return {x: ax, y: ay}
    let t = (apx * abx + apy * aby) / ab2
    t = Math.max(0, Math.min(1, t))
    return {
        x: ax + abx * t,
        y: ay + aby * t,
    }
}

const closestPointOnRectPerimeter = (
    node: DiagramNode,
    toward: EdgePoint,
): EdgePoint => {
    const x0 = node.x
    const y0 = node.y
    const x1 = node.x + node.width
    const y1 = node.y + node.height
    const px = toward.x
    const py = toward.y

    const candidates = [
        closestPointOnSegment(x0, y0, x1, y0, px, py),
        closestPointOnSegment(x1, y0, x1, y1, px, py),
        closestPointOnSegment(x1, y1, x0, y1, px, py),
        closestPointOnSegment(x0, y1, x0, y0, px, py),
    ]

    let best = candidates[0]
    let bestD = Infinity
    for (const c of candidates) {
        const dx = c.x - px
        const dy = c.y - py
        const d = dx * dx + dy * dy
        if (d < bestD) {
            bestD = d
            best = c
        }
    }
    return best
}

const getAnchorPoint = (
    node: DiagramNode | undefined,
    anchorId: string | undefined,
    toward: EdgePoint,
): EdgePoint | null => {
    if (!node) return null

    if (!anchorId) {
        return closestPointOnRectPerimeter(node, toward)
    }

    const anchor =
        getNodeAnchors(node)
            .find(anchor => anchor.id === anchorId)

    return anchor ?? null
    //if (!anchor) {
    //    return null
    //}
//
    //return {
    //    x: node.x + anchor.x,
    //    y: node.y + anchor.y,
    //}
}

const resolveEdgePoints = (
    edge: DiagramEdge,
    nodes: DiagramNode[],
): EdgePoint[] => {
    const sourceNode =
        nodes.find(node => node.id === edge.source.nodeId)

    const targetNode =
        nodes.find(node => node.id === edge.target.nodeId)

    const targetToward: EdgePoint =
        edge.controlPoints.at(-1)
        ?? edge.source.point
        ?? { x: 0, y: 0 }

    const target =
        getAnchorPoint(targetNode, edge.target.anchorId, targetToward)
        ?? edge.target.point

    const sourceToward: EdgePoint =
        edge.controlPoints[0]
        ?? edge.target.point
        ?? { x: 0, y: 0 }

    const source =
        getAnchorPoint(sourceNode, edge.source.anchorId, sourceToward)
        ?? edge.source.point

    return [
        source,
        ...edge.controlPoints,
        target,
    ]
}

const flattenEdgePoints = (
    points: EdgePoint[],
) => points.flatMap(point => [point.x, point.y])

export {
    getAnchorPoint,
    resolveEdgePoints,
    flattenEdgePoints,
    closestPointOnRectPerimeter,
}
