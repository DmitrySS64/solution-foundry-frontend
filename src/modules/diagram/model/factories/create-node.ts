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
        width: definition?.box?.initialWidth ?? 160,
        height: definition?.box?.initialHeight ?? 80,
        rotation: 0,
        label: definition?.defaultLabel ?? 'Node',
        ...(definition?.customRendererId
            ? { customRendererId: definition.customRendererId }
            : {}),

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
        renderLabel: definition?.renderLabel ?? true,
        textOutsideGroup: definition?.textOutsideGroup ?? false,
    }
}
