//model/types/edge.types
interface EdgePoint {
    x: number
    y: number
}

type EdgeType = 'straight' | 'orthogonal' | 'bezier'

interface EdgeAnchor {
    nodeId?: string
    anchorId?: string

    point: EdgePoint
}

type EdgeEndStyle = 'none' | 'arrow'

interface EdgeLabelStyle {
    fill: string
    fontSize: number
    fontFamily: string
    fontStyle: 'normal' | 'italic'
    fontWeight: 'normal' | 'bold'
}

interface DiagramEdge {
    id: string

    source: EdgeAnchor
    target: EdgeAnchor

    type: EdgeType

    controlPoints: EdgePoint[]

    style:{
        stroke: string
        strokeWidth: number
        dash?: number[]
        startCap?: EdgeEndStyle
        endCap?: EdgeEndStyle
    }

    label?: string
    labelStyle?: EdgeLabelStyle
}

interface TempEdge {
    active: boolean

    fromX: number
    fromY: number

    toX: number
    toY: number

    fromNodeId?: string
    fromAnchor?: string
}

export type {
    EdgePoint,
    EdgeAnchor,
    DiagramEdge,
    TempEdge,
    EdgeEndStyle,
    EdgeLabelStyle,
}
