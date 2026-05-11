import type { DiagramEdge } from '../types/edge.types'
import type { DiagramNode } from '../types/node.types'

import { getNodeAnchors } from '../factories/getNodeAnchors'
import { closestPointOnRectPerimeter } from './edgeGeometry'

export const recalculateEdge = (
    edge: DiagramEdge,
    movedNode: DiagramNode,
) => {

    const anchors =
        getNodeAnchors(movedNode)


    // SOURCE
    if (edge.source.nodeId === movedNode.id) {
        const anchor =
            anchors.find(a =>
                a.id === edge.source.anchorId)

        if (anchor) {
            edge.source.point.x = anchor.x
            edge.source.point.y = anchor.y
        } else {
            const toward =
                edge.controlPoints.length > 0
                    ? edge.controlPoints[0]
                    : edge.target.point

            const p = closestPointOnRectPerimeter(movedNode, toward)
            edge.source.point.x = p.x
            edge.source.point.y = p.y
        }
    }

    // TARGET
    if (edge.target.nodeId === movedNode.id) {

        const anchor =
            anchors.find(
                a =>
                    a.id === edge.target.anchorId
            )

        if (anchor) {
            edge.target.point.x = anchor.x
            edge.target.point.y = anchor.y
        } else {
            const toward =
                edge.controlPoints.length > 0
                    ? edge.controlPoints[edge.controlPoints.length - 1]
                    : edge.source.point

            const p = closestPointOnRectPerimeter(movedNode, toward)
            edge.target.point.x = p.x
            edge.target.point.y = p.y
        }
    }
}
