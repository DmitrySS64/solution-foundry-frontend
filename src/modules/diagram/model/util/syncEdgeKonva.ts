import Konva from 'konva'
import type {DiagramEdge} from '../types/edge.types'
import type {DiagramNode} from '../types/node.types'
import {flattenEdgePoints, resolveEdgePoints} from './edgeGeometry'

export interface EdgeKonvaRefs {
    line: Konva.Line
    startCap?: Konva.Arrow
    endCap?: Konva.Arrow
}

export const edgeRegistry = new Map<string, EdgeKonvaRefs>()

export const syncEdgeKonva = (
    edge: DiagramEdge,
    nodes: DiagramNode[],
) => {
    const refs = edgeRegistry.get(edge.id)
    if (!refs) return

    // keep caps in sync when edge geometry changes
    // (Arrow components use Konva attrs; without updating them, they may reset)
    const resolved = resolveEdgePoints(edge, nodes)
    if (resolved.length < 2) return
    const flat = flattenEdgePoints(resolved)

    refs.line.points(flat)

    const start = resolved[0]
    const end = resolved[resolved.length - 1]
    const startNeighbor = resolved[1] ?? end
    const endNeighbor = resolved[resolved.length - 2] ?? start

    const stroke = edge.style.stroke
    const strokeWidth = edge.style.strokeWidth

    if (refs.startCap && edge.style.startCap === 'arrow') {
        refs.startCap.points([
            startNeighbor.x,
            startNeighbor.y,
            start.x,
            start.y,
        ])
        refs.startCap.stroke(stroke)
        refs.startCap.fill(stroke)
        refs.startCap.strokeWidth(strokeWidth)
    }

    if (refs.endCap && edge.style.endCap === 'arrow') {
        refs.endCap.points([
            endNeighbor.x,
            endNeighbor.y,
            end.x,
            end.y,
        ])
        refs.endCap.stroke(stroke)
        refs.endCap.fill(stroke)
        refs.endCap.strokeWidth(strokeWidth)
    }

    refs.line.getLayer()?.batchDraw()
}
