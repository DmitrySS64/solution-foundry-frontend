//model/types/node.types
type NodeType =
    | 'rectangle'
    | 'circle'
    | 'diamond'
    | string

interface NodeTextStyle {
    fill: string
    fontSize: number
    fontFamily: string
    fontStyle: 'normal' | 'italic'
    fontWeight: 'normal' | 'bold'
    align: 'left' | 'center' | 'right'
}

interface NodeStyle {
    fill: string
    stroke: string
    strokeWidth: number
    cornerRadius: number
    opacity: number
}

interface NodeNotationProperty {
    name: string
    label: string
    type: 'text' | 'number' | 'color' | 'select' | 'boolean'
    value: string | number | boolean
    options?: string[]
    editable?: boolean
}


interface NodePrimitive {
    type: 'rect' | 'circle' | 'diamond' | 'text' | 'svg'
    x?: number
    y?: number
    width?: number
    height?: number
    radius?: number
    fill?: string
    stroke?: string
    strokeWidth?: number
    text?: string
    textKey?: string
    fontSize?: number
    fontFamily?: string
    fontStyle?: 'normal' | 'italic'
    fontWeight?: 'normal' | 'bold'
    align?: 'left' | 'center' | 'right'
    svg?: string
}

interface NodeNotation {
    id: string
    name: string
    svg?: string
    primitives?: NodePrimitive[]
    properties: NodeNotationProperty[]
}

interface DiagramNode {
    id: string

    type: NodeType

    x: number
    y: number

    width: number
    height: number

    rotation: number

    label: string

    style: NodeStyle

    textStyle: NodeTextStyle

    notation?: NodeNotation

    //zIndex: number

    // Политики отображения/рендера.
    // Если false — node.label не рендерим.
    renderLabel?: boolean

    // Политики растяжения/пропорций.
    // Если false — запрещаем менять width/height при resize.
    canStretch?: boolean

    // Если true — сохраняем пропорции при resize.
    preserveAspectRatio?: boolean

    createdAt: number


    updatedAt: number

    edges: {
        id: string
        direction: 'in' | 'out'
    }[]
}

export type {
    NodeType,
    DiagramNode,
    NodeStyle,
    NodeTextStyle,
    NodeNotation,
    NodeNotationProperty,
    NodePrimitive,
}
