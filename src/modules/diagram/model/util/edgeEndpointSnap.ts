import type {EdgePoint} from '../types/edge.types'
import type {DiagramNode} from '../types/node.types'
import {getNodeAnchors} from '../factories/getNodeAnchors'
import {closestPointOnRectPerimeter} from './edgeGeometry'

export const snapEdgeEndpointToGraph = (
    point: EdgePoint,
    nodes: DiagramNode[],
) => {
    const anchorSnap = 28

    let bestAnchor:
        | {nodeId: string; anchorId: string; point: EdgePoint; distance: number}
        | undefined

    for (const node of nodes) {
        const anchors = getNodeAnchors(node)
        for (const anchor of anchors) {
            const dx = anchor.x - point.x
            const dy = anchor.y - point.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance <= anchorSnap && (!bestAnchor || distance < bestAnchor.distance)) {
                bestAnchor = {
                    nodeId: node.id,
                    anchorId: anchor.id,
                    point: {x: anchor.x, y: anchor.y},
                    distance,
                }
            }
        }
    }

    if (bestAnchor) {
        return {
            nodeId: bestAnchor.nodeId,
            anchorId: bestAnchor.anchorId,
            point: bestAnchor.point,
        }
    }

    for (const node of nodes) {
        const inside =
            point.x >= node.x &&
            point.x <= node.x + node.width &&
            point.y >= node.y &&
            point.y <= node.y + node.height

        if (!inside) continue

        const perimeter = closestPointOnRectPerimeter(node, point)
        return {
            nodeId: node.id,
            point: perimeter,
        }
    }

    return {point}
}
