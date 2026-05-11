import type { DiagramNode, NodeType } from '../types/node.types'
import {
    cloneNotation,
    getNodeDefinition,
} from '../registry/nodeDefinitions'

export const createNode = (
    type: NodeType,
    x: number,
    y: number
): DiagramNode => {

    const now = Date.now()
    const definition =
        getNodeDefinition(type)

    return {
        id: crypto.randomUUID(),
        type,
        x,
        y,
        width: 160,
        height: 80,
        rotation: 0,
        label: 'Node',
        style: {
            fill: '#DBEAFE',
            stroke: '#3B82F6',
            strokeWidth: 2,
            cornerRadius: 8,
            opacity: 1,
        },
        textStyle: {
            fill: '#111827',
            fontSize: 13,
            fontFamily: 'Arial',
            fontStyle: 'normal',
            fontWeight: 'normal',
            align: 'center',
        },
        notation: definition
            ? cloneNotation(definition.notation)
            : undefined,
        createdAt: now,
        updatedAt: now,
        edges: [],
    }
}
