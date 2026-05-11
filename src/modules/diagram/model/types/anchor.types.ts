//model/types/anchor.types
export type AnchorPosition =
    | 'top'
    | 'right'
    | 'bottom'
    | 'left'

export interface NodeAnchor {
    id: AnchorPosition
    x: number
    y: number
}