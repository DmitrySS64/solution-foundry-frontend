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

// Style properties for a node (rectangle, circle, diamond, etc.)
interface NodeStyle {
    fill: string       // Fill color of the node
    stroke: string     // Stroke (outline) color
    strokeWidth: number // Width of the stroke in pixels
    cornerRadius: number // Radius for rounded corners (rectangle only)
    opacity: number    // Node opacity (0 = fully transparent, 1 = fully opaque)
}

interface NodeNotationProperty {
    name: string
    label: string
    type: 'text' | 'number' | 'color' | 'select' | 'boolean'
    value: string | number | boolean
    options?: string[]
    editable?: boolean
}

interface NodeImageSource {
    src?: string
    url?: string
    href?: string
    svg?: string
    preserveAspectRatio?: boolean
}


interface NodePrimitive {
    type: 'rect' | 'circle' | 'diamond' | 'text' | 'svg' | 'image'
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
    src?: string
    url?: string
    href?: string
    preserveAspectRatio?: boolean
}

interface NodeNotation {
    id: string
    name: string
    svg?: string
    image?: string | NodeImageSource
    preview?: string | NodeImageSource
    primitives?: NodePrimitive[]
    properties: NodeNotationProperty[]
}

interface DiagramNode {
    id: string

    type: NodeType

    x: number
    y: number

    /**
     * Если задан — используется кастомный рендерер из canvas/RendererRegistry
     * (работает поверх стандартного primitive/svg рендера).
     */
    customRendererId?: string
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

    // Если true — текст рендерится в отдельном слое, вне группы.
    // Трансформер будет применяться только к фигуре, текст визуально вне группы.
    textOutsideGroup?: boolean

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
    NodeImageSource,
}
