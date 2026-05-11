import type { DiagramNode } from '../types/node.types'
import type { NodeAnchor } from '../types/anchor.types'

export const getNodeAnchors = (
    node: DiagramNode,
    local = false
): NodeAnchor[] => {
    const X = local ? 0 : node.x
    const Y = local ? 0 : node.y

    return [
        {
            id: 'top',
            x: X + node.width / 2,
            y: Y,
        },

        {
            id: 'right',
            x: X + node.width,
            y: Y + node.height / 2,
        },

        {
            id: 'bottom',
            x: X + node.width / 2,
            y: Y + node.height,
        },

        {
            id: 'left',
            x: X,
            y: Y + node.height / 2,
        },
    ]
}