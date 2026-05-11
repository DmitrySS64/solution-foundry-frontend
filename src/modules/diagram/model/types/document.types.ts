//model/types/document.types
import type { DiagramNode } from './node.types'
import type { DiagramEdge } from './edge.types'

interface DiagramDocument {
    nodes: DiagramNode[]
    edges: DiagramEdge[]
}

export type {DiagramDocument}